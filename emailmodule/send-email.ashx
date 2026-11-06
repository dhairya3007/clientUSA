<%@ WebHandler Language="C#" Class="UniversalEmailHandler" %>

// =============================================================================
// REUSABLE WINDOWS IIS EMAIL SERVICE (ASP.NET / C#)
// • Zero-Maintenance: Never edit this C# file for new projects or forms
// • Reads SMTP & Receiver from config.json
// • 100% Dynamic: Auto-discovers and maps {{placeholders}} in HTML templates
// • Fallback Mode: Auto-builds responsive HTML table if no template is used
// • Works with both JSON (fetch) and FormData / standard HTML forms
// • Handles honeypot spam protection & file attachments
// =============================================================================

using System;
using System.IO;
using System.Web;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using System.Collections.Generic;

public class UniversalEmailHandler : IHttpHandler
{
    private class ModuleConfig
    {
        public SmtpSettings smtp { get; set; }
        public string defaultReceiver { get; set; }
        public string websiteName { get; set; }
        public bool sendAutoReply { get; set; }
        public string honeypotField { get; set; }

        public ModuleConfig()
        {
            smtp = new SmtpSettings();
            websiteName = "Website Notification";
            sendAutoReply = true;
            honeypotField = "_gotcha";
        }
    }

    private class SmtpSettings
    {
        public string host { get; set; }
        public int port { get; set; }
        public bool enableSsl { get; set; }
        public string user { get; set; }
        public string pass { get; set; }
        public string fromName { get; set; }

        public SmtpSettings()
        {
            host = "smtp.gmail.com";
            port = 587;
            enableSsl = true;
            fromName = "Website Inquiries";
        }
    }

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json; charset=utf-8";
        context.Response.AddHeader("Access-Control-Allow-Origin", "*");
        context.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        context.Response.AddHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");

        // 1. CORS Preflight
        if (context.Request.HttpMethod.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
        {
            context.Response.StatusCode = 204;
            return;
        }

        // 2. Health check (GET)
        if (context.Request.HttpMethod.Equals("GET", StringComparison.OrdinalIgnoreCase))
        {
            context.Response.StatusCode = 200;
            context.Response.Write("{\"status\":\"ok\",\"service\":\"Universal IIS Email Service\",\"dynamic\":true}");
            return;
        }

        if (!context.Request.HttpMethod.Equals("POST", StringComparison.OrdinalIgnoreCase))
        {
            SendJson(context, false, "Method not allowed. Only POST is accepted.", 405);
            return;
        }

        try
        {
            // 3. Load configuration from config.json
            ModuleConfig config = LoadConfiguration(context);

            // 4. Extract incoming data (supports both JSON and Form / FormData)
            Dictionary<string, string> fields = ParseIncomingData(context);

            if (fields.Count == 0)
            {
                SendJson(context, false, "No form data was received.", 400);
                return;
            }

            // 5. Anti-spam honeypot verification
            string honeyKey = string.IsNullOrEmpty(config.honeypotField) ? "_gotcha" : config.honeypotField;
            if (fields.ContainsKey(honeyKey) && !string.IsNullOrWhiteSpace(fields[honeyKey]))
            {
                // Silently succeed to discard bot submission
                SendJson(context, true, "Message processed.");
                return;
            }

            // 6. Extract Subject, Recipient, and Template
            string subject = GetValue(fields, "_subject", "subject", "New Inquiry");
            string toEmail = GetValue(fields, "_to", "to", config.defaultReceiver);
            string templateName = GetValue(fields, "_template", "template", "");
            string senderEmail = ExtractSenderEmail(fields);
            string senderName = ExtractSenderName(fields);

            string logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "emailmodule", "email_activity.log");
            try { File.AppendAllText(logPath, string.Format("[{0}] SUBMISSION: SENDER='{1}', ADMIN='{2}', AUTOREPLY_CFG={3}\n", DateTime.Now.ToString("s"), senderEmail, toEmail, config.sendAutoReply)); } catch { }

            if (string.IsNullOrWhiteSpace(toEmail))
            {
                toEmail = config.smtp.user;
            }

            // 7. Render dynamic email body
            string emailBody = RenderEmailBody(context, templateName, fields, config);

            // 8. Enforce modern TLS security (TLS 1.2)
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | (SecurityProtocolType)3072;

            // 9. Dispatch Email via SMTP
            using (var smtp = new SmtpClient(config.smtp.host, config.smtp.port))
            {
                smtp.EnableSsl = config.smtp.enableSsl;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential(config.smtp.user, config.smtp.pass);
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.Timeout = 20000;

                // A. Main Admin Notification Email
                using (var mail = new MailMessage())
                {
                    string fromDisplayName = !string.IsNullOrEmpty(config.smtp.fromName) ? config.smtp.fromName : config.websiteName;
                    mail.From = new MailAddress(config.smtp.user, fromDisplayName);

                    foreach (var recipient in toEmail.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries))
                    {
                        if (!string.IsNullOrWhiteSpace(recipient))
                            mail.To.Add(recipient.Trim());
                    }

                    if (!string.IsNullOrWhiteSpace(senderEmail))
                    {
                        try { mail.ReplyToList.Add(new MailAddress(senderEmail, senderName)); } catch { }
                    }

                    mail.Subject = subject;
                    mail.SubjectEncoding = Encoding.UTF8;
                    mail.BodyEncoding = Encoding.UTF8;
                    mail.HeadersEncoding = Encoding.UTF8;
                    mail.IsBodyHtml = true;
                    mail.Body = emailBody;

                    // Handle file attachments dynamically (if multipart form uploaded files)
                    for (int i = 0; i < context.Request.Files.Count; i++)
                    {
                        HttpPostedFile file = context.Request.Files[i];
                        if (file.ContentLength > 0 && file.ContentLength <= 10 * 1024 * 1024) // 10MB limit
                        {
                            mail.Attachments.Add(new Attachment(file.InputStream, Path.GetFileName(file.FileName)));
                        }
                    }

                    smtp.Send(mail);
                }

                // B. Client Confirmation (Form Submitted Successfully)
                if (config.sendAutoReply && !string.IsNullOrWhiteSpace(senderEmail))
                {
                    try
                    {
                        using (var autoSmtp = new SmtpClient(config.smtp.host, config.smtp.port))
                        {
                            autoSmtp.EnableSsl = config.smtp.enableSsl;
                            autoSmtp.UseDefaultCredentials = false;
                            autoSmtp.Credentials = new NetworkCredential(config.smtp.user, config.smtp.pass);
                            autoSmtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                            autoSmtp.Timeout = 20000;

                            using (var autoReply = new MailMessage())
                            {
                                string fromDisplayName = !string.IsNullOrEmpty(config.smtp.fromName) ? config.smtp.fromName : config.websiteName;
                                autoReply.From = new MailAddress(config.smtp.user, fromDisplayName);
                                autoReply.To.Add(senderEmail);
                                autoReply.Subject = "Form Submitted Successfully";
                                autoReply.SubjectEncoding = Encoding.UTF8;
                                autoReply.BodyEncoding = Encoding.UTF8;
                                autoReply.HeadersEncoding = Encoding.UTF8;
                                autoReply.IsBodyHtml = true;
                                autoReply.Body = BuildDynamicHtmlTable(fields, config, context, true);
                                autoSmtp.Send(autoReply);
                                try { File.AppendAllText(logPath, string.Format("[{0}] AUTOREPLY SENT to '{1}'\n", DateTime.Now.ToString("s"), senderEmail)); } catch { }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        try { File.AppendAllText(logPath, string.Format("[{0}] AUTOREPLY EXCEPTION: {1}\n", DateTime.Now.ToString("s"), ex.ToString())); } catch { }
                    }
                }
            }

            SendJson(context, true, "Thank you! Your message has been sent successfully.");
        }
        catch (Exception ex)
        {
            SendJson(context, false, "Delivery Error: " + ex.Message, 500);
        }
    }

    // -------------------------------------------------------------------------
    // DYNAMIC TEMPLATE ENGINE & VARIABLE REPLACEMENT
    // -------------------------------------------------------------------------
    private string RenderEmailBody(HttpContext context, string templateName, Dictionary<string, string> fields, ModuleConfig config)
    {
        string templatePath = "";
        if (!string.IsNullOrEmpty(templateName))
        {
            string cleanName = Path.GetFileNameWithoutExtension(templateName);
            string primaryDir = context.Server.MapPath("~/emailmodule/templates/" + cleanName + ".html");
            if (File.Exists(primaryDir))
            {
                templatePath = primaryDir;
            }
            else
            {
                string relativeDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "emailmodule", "templates", cleanName + ".html");
                if (File.Exists(relativeDir)) templatePath = relativeDir;
            }
        }

        // If template file exists on server, dynamically substitute all {{placeholders}}
        if (!string.IsNullOrEmpty(templatePath) && File.Exists(templatePath))
        {
            string rawHtml = File.ReadAllText(templatePath, Encoding.UTF8);
            var regex = new Regex(@"\{\{\s*([a-zA-Z0-9_\-]+)\s*\}\}", RegexOptions.IgnoreCase);

            return regex.Replace(rawHtml, match =>
            {
                string token = match.Groups[1].Value.Trim();

                // 1. Built-in system placeholder variables
                if (token.Equals("submission_date", StringComparison.OrdinalIgnoreCase) || token.Equals("date", StringComparison.OrdinalIgnoreCase))
                    return DateTime.Now.ToString("dd-MMM-yyyy hh:mm tt");
                if (token.Equals("client_ip", StringComparison.OrdinalIgnoreCase) || token.Equals("ip", StringComparison.OrdinalIgnoreCase))
                    return context.Request.UserHostAddress;
                if (token.Equals("page_url", StringComparison.OrdinalIgnoreCase) || token.Equals("source_url", StringComparison.OrdinalIgnoreCase))
                    return context.Request.UrlReferrer != null ? context.Request.UrlReferrer.ToString() : "-";
                if (token.Equals("website_name", StringComparison.OrdinalIgnoreCase))
                    return config.websiteName;
                if (token.Equals("year", StringComparison.OrdinalIgnoreCase))
                    return DateTime.Now.Year.ToString();
                if (token.Equals("form_details", StringComparison.OrdinalIgnoreCase) || token.Equals("details", StringComparison.OrdinalIgnoreCase))
                    return BuildTableRows(fields);

                // 2. Dynamic form fields (case-insensitive lookup)
                foreach (var kvp in fields)
                {
                    if (string.Equals(kvp.Key, token, StringComparison.OrdinalIgnoreCase))
                    {
                        return HttpUtility.HtmlEncode(kvp.Value);
                    }
                }

                return "-"; // Empty fallback if field not submitted
            });
        }

        // Fallback: Build clean ZEROPOINT HTML table
        return BuildDynamicHtmlTable(fields, config, context, false);
    }

    private string BuildDynamicHtmlTable(Dictionary<string, string> fields, ModuleConfig config, HttpContext context, bool isClientConfirmation = false)
    {
        var sb = new StringBuilder();
        sb.Append("<!DOCTYPE html><html><head><meta charset='utf-8'><title>ZEROPOINT</title></head>");
        sb.Append("<body style='margin:0; padding:24px 12px; background-color:#f5f2eb; font-family:-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;'>");
        sb.Append("<div style='max-width:600px; margin:0 auto; background-color:#ffffff; border:1px solid #e5dfd5; border-radius:4px; overflow:hidden;'>");

        // ZEROPOINT Logo Header
        sb.Append("<div style='background-color:#faf8f5; text-align:center; padding:32px 24px; border-bottom:1px solid #e8e3d9;'>");
        sb.Append("<a href='https://thezeropoint.dance' target='_blank' style='text-decoration:none; display:inline-block;'>");
        sb.Append("<img src='https://raw.githubusercontent.com/dhairya3007/clientUSA/main/assets/zeropoint_logo_vector.svg' alt='ZEROPOINT - Stillness In Motion' width='280' style='max-width:280px; width:280px; height:auto; display:block; margin:0 auto; border:0;' />");
        sb.Append("</a>");
        sb.Append("</div>");

        // Client Confirmation Subheader if client email
        if (isClientConfirmation)
        {
            sb.Append("<div style='padding:22px 28px 14px 28px; text-align:center; background:#ffffff; border-bottom:1px solid #f2ede4;'>");
            sb.Append("<h3 style='margin:0 0 6px 0; font-size:17px; color:#171815; font-weight:600;'>Form Submitted Successfully</h3>");
            sb.Append("<p style='margin:0; font-size:13.5px; color:#666666; line-height:1.5;'>Thank you. Your inquiry has been received. A copy of your submitted details is provided below:</p>");
            sb.Append("</div>");
        }

        // Form Details Table
        sb.Append("<table style='width:100%; border-collapse:collapse;'>");
        sb.Append(BuildTableRows(fields));
        sb.Append("</table>");

        // Subtle timestamp footer
        sb.Append("<div style='padding:12px 20px; font-size:11px; color:#999999; text-align:center; background:#faf8f5; border-top:1px solid #eee8df;'>");
        sb.Append("Date: " + DateTime.Now.ToString("dd-MMM-yyyy hh:mm tt"));
        sb.Append("</div>");

        sb.Append("</div>");
        sb.Append("</body></html>");
        return sb.ToString();
    }

    private string BuildTableRows(Dictionary<string, string> fields)
    {
        var sb = new StringBuilder();
        int index = 0;
        foreach (var entry in fields)
        {
            if (string.IsNullOrEmpty(entry.Key) || entry.Key.StartsWith("_")) continue;

            string bg = (index++ % 2 == 0) ? "#ffffff" : "#fcfbfa";
            string label = FormatKey(entry.Key);
            sb.AppendFormat("<tr style='background:{0}; border-bottom:1px solid #f0ece3;'>", bg);
            sb.AppendFormat("<td style='padding:12px 22px; font-weight:600; width:36%; color:#555555; font-size:13px; vertical-align:top;'>{0}</td>", HttpUtility.HtmlEncode(label));
            sb.AppendFormat("<td style='padding:12px 22px; color:#171815; font-size:13.5px; line-height:1.5;'>{0}</td>", HttpUtility.HtmlEncode(entry.Value));
            sb.Append("</tr>");
        }
        return sb.ToString();
    }

    // -------------------------------------------------------------------------
    // REQUEST PARSING (JSON & FORM-DATA COMPATIBLE)
    // -------------------------------------------------------------------------
    private Dictionary<string, string> ParseIncomingData(HttpContext context)
    {
        var result = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        // A. Read standard POST / FormData fields
        foreach (string key in context.Request.Form.AllKeys)
        {
            if (!string.IsNullOrEmpty(key))
            {
                result[key] = context.Request.Form[key];
            }
        }

        // B. If Form is empty, try parsing JSON body from Request.InputStream
        if (result.Count == 0 && context.Request.InputStream.Length > 0)
        {
            try
            {
                context.Request.InputStream.Position = 0;
                using (var reader = new StreamReader(context.Request.InputStream, Encoding.UTF8))
                {
                    string json = reader.ReadToEnd();
                    if (!string.IsNullOrWhiteSpace(json))
                    {
                        var serializer = new JavaScriptSerializer();
                        var parsed = serializer.Deserialize<Dictionary<string, object>>(json);
                        if (parsed != null)
                        {
                            foreach (var kvp in parsed)
                            {
                                if (!string.IsNullOrEmpty(kvp.Key))
                                {
                                    result[kvp.Key] = kvp.Value != null ? kvp.Value.ToString() : "";
                                }
                            }
                        }
                    }
                }
            }
            catch { }
        }

        return result;
    }

    private ModuleConfig LoadConfiguration(HttpContext context)
    {
        string path = context.Server.MapPath("~/emailmodule/config.json");
        if (!File.Exists(path))
        {
            path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "emailmodule", "config.json");
        }

        var config = new ModuleConfig();

        if (File.Exists(path))
        {
            try
            {
                string rawJson = File.ReadAllText(path);
                var serializer = new JavaScriptSerializer();

                // 1. Try standard typed deserialization
                var typedConfig = serializer.Deserialize<ModuleConfig>(rawJson);
                if (typedConfig != null && typedConfig.smtp != null && !string.IsNullOrEmpty(typedConfig.smtp.user))
                {
                    config = typedConfig;
                }

                // 2. Also check flat dictionary or "Email" wrapper (supports alternate casings: SmtpServer, Username, Password, From, Port, etc.)
                var dict = serializer.Deserialize<Dictionary<string, object>>(rawJson);
                if (dict != null)
                {
                    if (dict.ContainsKey("Email") && dict["Email"] is Dictionary<string, object>)
                    {
                        var emailMap = (Dictionary<string, object>)dict["Email"];
                        foreach (var emKey in emailMap.Keys)
                        {
                            dict[emKey] = emailMap[emKey];
                        }
                    }

                    foreach (var key in dict.Keys)
                    {
                        string val = dict[key] != null ? dict[key].ToString() : "";
                        if (string.Equals(key, "SmtpServer", StringComparison.OrdinalIgnoreCase) || string.Equals(key, "host", StringComparison.OrdinalIgnoreCase) || string.Equals(key, "Host", StringComparison.OrdinalIgnoreCase))
                            config.smtp.host = val;
                        else if (string.Equals(key, "Username", StringComparison.OrdinalIgnoreCase) || string.Equals(key, "user", StringComparison.OrdinalIgnoreCase))
                            config.smtp.user = val;
                        else if (string.Equals(key, "Password", StringComparison.OrdinalIgnoreCase) || string.Equals(key, "pass", StringComparison.OrdinalIgnoreCase))
                            config.smtp.pass = val;
                        else if (string.Equals(key, "From", StringComparison.OrdinalIgnoreCase) || string.Equals(key, "FromAddress", StringComparison.OrdinalIgnoreCase))
                            config.smtp.user = string.IsNullOrEmpty(config.smtp.user) ? val : config.smtp.user;
                        else if (string.Equals(key, "FromName", StringComparison.OrdinalIgnoreCase))
                            config.smtp.fromName = val;
                        else if (string.Equals(key, "Port", StringComparison.OrdinalIgnoreCase) || string.Equals(key, "port", StringComparison.OrdinalIgnoreCase))
                        {
                            int p;
                            if (int.TryParse(val, out p)) config.smtp.port = p;
                        }
                        else if (string.Equals(key, "EnableSsl", StringComparison.OrdinalIgnoreCase))
                        {
                            bool ssl;
                            if (bool.TryParse(val, out ssl)) config.smtp.enableSsl = ssl;
                        }
                        else if (string.Equals(key, "defaultReceiver", StringComparison.OrdinalIgnoreCase) || string.Equals(key, "admin", StringComparison.OrdinalIgnoreCase) || string.Equals(key, "adminEmail", StringComparison.OrdinalIgnoreCase) || string.Equals(key, "to", StringComparison.OrdinalIgnoreCase))
                            config.defaultReceiver = val;
                        else if (string.Equals(key, "websiteName", StringComparison.OrdinalIgnoreCase))
                            config.websiteName = val;
                        else if (string.Equals(key, "sendAutoReply", StringComparison.OrdinalIgnoreCase) || string.Equals(key, "autoReply", StringComparison.OrdinalIgnoreCase) || string.Equals(key, "autoreply", StringComparison.OrdinalIgnoreCase))
                        {
                            bool ar;
                            if (bool.TryParse(val, out ar)) config.sendAutoReply = ar;
                        }
                        else if (string.Equals(key, "honeypotField", StringComparison.OrdinalIgnoreCase))
                            config.honeypotField = val;
                    }
                }

                // For Gmail with .NET SmtpClient, port 587 (STARTTLS) is required instead of 465 (Implicit SSL)
                if (config.smtp.host.IndexOf("gmail.com", StringComparison.OrdinalIgnoreCase) >= 0 && config.smtp.port == 465)
                {
                    config.smtp.port = 587;
                }
            }
            catch { }
        }

        return config;
    }

    private string GetValue(Dictionary<string, string> dict, string primaryKey, string aliasKey, string fallback)
    {
        if (dict.ContainsKey(primaryKey) && !string.IsNullOrWhiteSpace(dict[primaryKey]))
            return dict[primaryKey].Trim();
        if (dict.ContainsKey(aliasKey) && !string.IsNullOrWhiteSpace(dict[aliasKey]))
            return dict[aliasKey].Trim();
        return fallback;
    }

    private string ExtractSenderEmail(Dictionary<string, string> dict)
    {
        string[] candidates = { "email", "email_address", "sender_email", "user_email", "mail", "e-mail", "Preferred Email Address", "Preferred Business Email" };
        foreach (var c in candidates)
        {
            if (dict.ContainsKey(c) && !string.IsNullOrWhiteSpace(dict[c]))
                return dict[c].Trim();
        }
        foreach (var kvp in dict)
        {
            if (kvp.Key.IndexOf("email", StringComparison.OrdinalIgnoreCase) >= 0 && !string.IsNullOrWhiteSpace(kvp.Value))
                return kvp.Value.Trim();
        }
        return "";
    }

    private string ExtractSenderName(Dictionary<string, string> dict)
    {
        string[] candidates = { "name", "full_name", "fullname", "sender_name", "client_name", "Full Name" };
        foreach (var c in candidates)
        {
            if (dict.ContainsKey(c) && !string.IsNullOrWhiteSpace(dict[c]))
                return dict[c].Trim();
        }
        foreach (var kvp in dict)
        {
            if (kvp.Key.IndexOf("name", StringComparison.OrdinalIgnoreCase) >= 0 && !string.IsNullOrWhiteSpace(kvp.Value))
                return kvp.Value.Trim();
        }
        return "Website Visitor";
    }

    private string FormatKey(string key)
    {
        if (string.IsNullOrEmpty(key)) return key;
        var sb = new StringBuilder();
        for (int i = 0; i < key.Length; i++)
        {
            char c = key[i];
            if (c == '_' || c == '-') { sb.Append(' '); continue; }
            if (i > 0 && char.IsUpper(c) && !char.IsUpper(key[i - 1])) sb.Append(' ');
            sb.Append(i == 0 ? char.ToUpper(c) : c);
        }
        return sb.ToString();
    }

    private void SendJson(HttpContext context, bool success, string message, int statusCode = 200)
    {
        context.Response.StatusCode = statusCode;
        var serializer = new JavaScriptSerializer();
        context.Response.Write(serializer.Serialize(new { success = success, message = message }));
    }

    public bool IsReusable
    {
        get { return false; }
    }
}
