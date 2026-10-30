# Universal Reusable Windows IIS Email Service

A zero-maintenance, drop-in email module for static or dynamic websites hosted on **Windows Server (IIS)**.

---

## 🌟 Why This Module Is Reusable (Build Once, Use Everywhere)

* **No Node.js / Python / PHP needed**: Executes natively on Windows Server through ASP.NET / IIS (`.ashx`).
* **Same Port & Domain**: Runs directly on port `80` or `443` — zero CORS or SSL mismatch issues.
* **Zero Backend Code Changes**: You **never** need to recompile or edit `send-email.ashx` when adding new fields or using it on another client's website.
* **100% Dynamic Templates**:
  * Drop any HTML template into `templates/` (e.g. `templates/contact.html`).
  * Use `{{placeholder}}` anywhere in the template — the module auto-discovers and fills it from the form!
* **Safety Fallback**: If you don't even create a template, the module automatically formats all submitted fields into an elegant HTML table.
* **Spam Protection**: Built-in honeypot field (`_gotcha`) to discard bots silently.
* **Automatic Thank-You Email**: Automatically sends a confirmation email to the user if enabled.
* **Supports Both JSON and Standard Form POST**: Compatible with `FormData`, traditional HTML form submits, and `fetch(..., { headers: { 'Content-Type': 'application/json' } })`.

---

## 📁 Module Structure

```text
emailmodule/
├── config.json          <-- The ONLY file you update per website/client
├── send-email.ashx      <-- The universal engine (Never edit this)
├── email-client.js      <-- Optional 1-line drop-in JS helper for forms
├── web.config           <-- IIS configuration for ASP.NET handlers
└── templates/           <-- Drop your HTML templates here!
    ├── contact.html     <-- Starter contact form template
    └── quote.html       <-- Starter quote request template
```

---

## 🚀 Quick Setup on Any Website (3 Steps)

### Step 1: Copy `emailmodule/` to your website
Drop this entire `emailmodule/` folder into your website root directory on Windows Server (e.g., `C:\inetpub\wwwroot\emailmodule\`).

### Step 2: Configure `config.json`
Open `config.json` and enter your SMTP credentials and recipient email:

```json
{
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 587,
    "enableSsl": true,
    "user": "your-smtp-email@gmail.com",
    "pass": "your-16-char-app-password",
    "fromName": "My Company"
  },
  "defaultReceiver": "inquiries@mycompany.com",
  "websiteName": "My Website",
  "sendAutoReply": true,
  "honeypotField": "_gotcha"
}
```

### Step 3: Add to Your Static HTML Page

Include the helper script:
```html
<script src="/emailmodule/email-client.js"></script>
```

Add `data-email-module` to **any** form:
```html
<form data-email-module>
  <!-- Which template to use (corresponds to templates/contact.html) -->
  <input type="hidden" name="_template" value="contact" />
  
  <!-- Custom Subject -->
  <input type="hidden" name="_subject" value="New Contact Us Message" />

  <!-- Hidden Spam Trap (invisible to real users, catches bots) -->
  <input type="text" name="_gotcha" style="display:none !important;" tabindex="-1" autocomplete="off" />

  <!-- Your Form Fields (names match {{placeholders}} in contact.html) -->
  <input type="text" name="name" placeholder="Full Name" required />
  <input type="email" name="email" placeholder="Email Address" required />
  <input type="tel" name="phone" placeholder="Phone Number" />
  <textarea name="message" placeholder="Your Message" required></textarea>

  <button type="submit">Send Message</button>
</form>
```

---

## 🎨 How Dynamic Templates Work

When you want a new design or layout:
1. Create a new `.html` file inside `emailmodule/templates/` (e.g. `service-inquiry.html`).
2. Add your HTML with any `{{placeholders}}`:
   ```html
   <h2>Inquiry from {{name}}</h2>
   <p>Company: {{company}}</p>
   <p>Budget: {{budget}}</p>
   <p>Selected Service: {{selected_service}}</p>
   ```
3. In your HTML form, set `<input type="hidden" name="_template" value="service-inquiry" />`.
4. Ensure your input elements have matching `name` attributes (`name="company"`, `name="budget"`, etc.).
5. The handler will automatically replace every matching placeholder with the user's submitted value!

### Built-in System Placeholders
You can use these in any template without sending them from the form:
* `{{submission_date}}`: Date & time of the submission (e.g., `28-Oct-2026 12:45 PM`).
* `{{client_ip}}`: The user's IP address.
* `{{page_url}}`: The webpage where the form was submitted.
* `{{website_name}}`: Value from `config.json`.
* `{{year}}`: Current year (e.g., `2026`).

---

## 🩺 Health Check
To verify your IIS server is correctly handling `.ashx`, navigate to:
`https://yourdomain.com/emailmodule/send-email.ashx`

Expected JSON response:
```json
{"status":"ok","service":"Universal IIS Email Service","dynamic":true}
```
