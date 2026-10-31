/**
 * ZEROPOINT Dynamic Service Request Forms
 * Vanilla JavaScript / jQuery architecture matching master specification
 */

(function($) {
    "use strict";

    // 1. Service Definitions & Form Schemas
    var SERVICES = {
        "wedding": {
            id: "wedding-first-dance",
            key: "wedding",
            name: "Wedding / First Dance",
            badge: "Bespoke Couple Choreography",
            description: "A personalized ZEROPOINT wedding choreography engagement for couples.",
            disclaimer: "Submitting a request does not constitute a confirmed booking. Each wedding engagement is reviewed individually based on timing, location, requested experience, and availability.",
            fields: [
                {
                    name: "couple_full_names",
                    type: "text",
                    label: "Couple's Full Names",
                    placeholder: "Enter both full names",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "email",
                    type: "email",
                    label: "Preferred Email Address",
                    placeholder: "you@example.com",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "phone",
                    type: "tel",
                    label: "Preferred Phone Number",
                    placeholder: "Enter your phone number",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "wedding_date",
                    type: "date",
                    label: "Date of Wedding",
                    required: true,
                    futureOnly: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "wedding_location",
                    type: "text",
                    label: "Where Will the Wedding Take Place?",
                    placeholder: "Venue / City / State",
                    required: true,
                    col: "col-xs-12"
                },
                {
                    name: "chosen_song_status",
                    type: "radio",
                    label: "Have You Selected Your Song?",
                    required: true,
                    col: "col-xs-12",
                    options: [
                        { value: "selected", label: "Yes" },
                        { value: "not-selected", label: "Not yet" }
                    ]
                },
                {
                    name: "song_title_artist",
                    type: "text",
                    label: "Chosen Song",
                    placeholder: "Song title and artist",
                    required: false,
                    conditionalOn: { field: "chosen_song_status", value: "selected" },
                    col: "col-xs-12"
                },
                {
                    name: "first_dance_feeling",
                    type: "textarea",
                    label: "What Would You Like the First Dance to Feel Like?",
                    placeholder: "Describe your desired feeling, style, level of movement, or anything particularly important.",
                    required: true,
                    col: "col-xs-12"
                },
                {
                    name: "choreography_confirmation",
                    type: "checkbox",
                    label: "We understand that ZEROPOINT wedding choreography is designed for a maximum performance length of 90 seconds.",
                    required: true,
                    col: "col-xs-12"
                }
            ]
        },
        "private-social": {
            id: "private-social-ensemble",
            key: "private-social",
            name: "Private Social Ensemble",
            badge: "Intimate Group Occasion",
            description: "A private ensemble experience for a group or social occasion.",
            disclaimer: "Submitting a request does not constitute a confirmed booking. Participant capacity, location, schedule, environment, and overall fit are reviewed before acceptance.",
            fields: [
                {
                    name: "full_name",
                    type: "text",
                    label: "Full Name",
                    placeholder: "Enter your full name",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "email",
                    type: "email",
                    label: "Preferred Email Address",
                    placeholder: "you@example.com",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "phone",
                    type: "tel",
                    label: "Preferred Phone Number",
                    placeholder: "Enter your phone number",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "event_location",
                    type: "text",
                    label: "Where Would the Experience Take Place?",
                    placeholder: "City / Town, State",
                    helpText: "Exact address can be provided after acceptance.",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "participant_count",
                    type: "number",
                    label: "Expected Number of Participants",
                    placeholder: "Enter participant count",
                    helpText: "Maximum: 20 participants.",
                    min: 1,
                    max: 20,
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "occasion_purpose",
                    type: "textarea",
                    label: "Occasion / Purpose",
                    placeholder: "What is the occasion or reason for the private ensemble?",
                    required: true,
                    col: "col-xs-12"
                },
                {
                    name: "preferred_date",
                    type: "date",
                    label: "Preferred Date",
                    required: true,
                    futureOnly: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "preferred_time_window",
                    type: "text",
                    label: "Preferred General Time Window",
                    placeholder: "For example, morning or afternoon",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "additional_information",
                    type: "textarea",
                    label: "Anything Else We Should Know?",
                    placeholder: "Share anything relevant to the group, environment, occasion, or desired experience.",
                    required: false,
                    col: "col-xs-12"
                }
            ]
        },
        "corporate": {
            id: "corporate",
            key: "corporate",
            name: "Corporate",
            badge: "Executive & Team Connection",
            description: "A tailored ZEROPOINT engagement for an organization or corporate group.",
            disclaimer: "Submitting a request does not constitute a confirmed booking. Corporate engagements are reviewed individually based on objectives, participant capacity, location, schedule, environment, and overall fit.",
            fields: [
                {
                    name: "organization_name",
                    type: "text",
                    label: "Company / Organization Name",
                    placeholder: "Enter organization name",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "primary_contact",
                    type: "text",
                    label: "Primary Contact",
                    placeholder: "Full name and title",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "email",
                    type: "email",
                    label: "Preferred Business Email",
                    placeholder: "name@company.com",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "phone",
                    type: "tel",
                    label: "Preferred Business Phone Number",
                    placeholder: "Enter business phone number",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "objective",
                    type: "textarea",
                    label: "What Is the Objective?",
                    placeholder: "Describe what you would like the ZEROPOINT experience to accomplish for your organization.",
                    required: true,
                    col: "col-xs-12"
                },
                {
                    name: "participant_count",
                    type: "number",
                    label: "Expected Number of Participants",
                    placeholder: "Enter anticipated participant count",
                    min: 1,
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "engagement_location",
                    type: "text",
                    label: "Where Would the Engagement Take Place?",
                    placeholder: "City / Town, State",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "venue_setting",
                    type: "text",
                    label: "Venue or Setting",
                    placeholder: "Enter venue or setting, if known",
                    required: false,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "preferred_timeframe",
                    type: "text",
                    label: "Preferred Date / Timeframe",
                    placeholder: "Preferred date, timeframe, or target period",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "additional_information",
                    type: "textarea",
                    label: "Anything Else We Should Know?",
                    placeholder: "Share relevant organizational, venue, scheduling, privacy, or program considerations.",
                    required: false,
                    col: "col-xs-12"
                }
            ]
        },
        "solo-duo": {
            id: "solo-duo",
            key: "solo-duo",
            name: "Solo / Duo",
            badge: "Executive Mastery & Partnership",
            description: "An Individual Executive Program or Private Partnership Program.",
            disclaimer: "Submitting a request does not constitute a confirmed booking. Each engagement is reviewed individually for location, availability, requested experience, and overall fit.",
            fields: [
                {
                    name: "engagement_type",
                    type: "radio",
                    label: "Engagement Type",
                    required: true,
                    col: "col-xs-12",
                    options: [
                        { value: "solo", label: "Individual Executive Program — SOLO" },
                        { value: "duo", label: "Private Partnership Program — DUO" }
                    ]
                },
                {
                    name: "full_name",
                    type: "text",
                    label: "Full Name",
                    placeholder: "Enter your full name",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "email",
                    type: "email",
                    label: "Preferred Email Address",
                    placeholder: "you@example.com",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "phone",
                    type: "tel",
                    label: "Preferred Phone Number",
                    placeholder: "Enter your phone number",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "engagement_location",
                    type: "text",
                    label: "Where Would the Engagement Take Place?",
                    placeholder: "City / Town, State",
                    helpText: "Exact address can be provided after acceptance.",
                    required: true,
                    col: "col-sm-6 col-xs-12"
                },
                {
                    name: "desired_outcome",
                    type: "textarea",
                    label: "What Are You Looking to Achieve?",
                    placeholder: "Describe what you would like ZEROPOINT to help you accomplish.",
                    required: true,
                    col: "col-xs-12"
                },
                {
                    name: "preferred_timing",
                    type: "text",
                    label: "Preferred Timing",
                    placeholder: "Preferred days, general time window, or target date",
                    required: true,
                    col: "col-xs-12"
                },
                {
                    name: "additional_information",
                    type: "textarea",
                    label: "Anything Else We Should Know?",
                    placeholder: "Share anything relevant to your requested experience, environment, or objective.",
                    required: false,
                    col: "col-xs-12"
                }
            ]
        }
    };

    // 2. Safe mapping helper for incoming query parameters / button data attributes
    function resolveServiceKey(rawParam) {
        if (!rawParam) return "wedding";
        var cleaned = String(rawParam).toLowerCase().trim();

        if (cleaned === "wedding" || cleaned === "wedding-first-dance" || cleaned.indexOf("first dance") !== -1 || cleaned.indexOf("wedding") !== -1) {
            return "wedding";
        }
        if (cleaned === "private-social" || cleaned === "private-social-ensemble" || cleaned.indexOf("soiree") !== -1 || cleaned.indexOf("soirée") !== -1 || cleaned.indexOf("social") !== -1) {
            return "private-social";
        }
        if (cleaned === "corporate" || cleaned.indexOf("corporate") !== -1) {
            return "corporate";
        }
        if (cleaned === "solo-duo" || cleaned === "solo" || cleaned === "duo" || cleaned.indexOf("introduction") !== -1 || cleaned.indexOf("mastery") !== -1 || cleaned.indexOf("solo") !== -1 || cleaned.indexOf("duo") !== -1) {
            return "solo-duo";
        }
        return "wedding";
    }

    // Get today's ISO date string (YYYY-MM-DD) for min date attributes
    function getTodayString() {
        var today = new Date();
        var yyyy = today.getFullYear();
        var mm = String(today.getMonth() + 1);
        if (mm.length < 2) mm = "0" + mm;
        var dd = String(today.getDate());
        if (dd.length < 2) dd = "0" + dd;
        return yyyy + "-" + mm + "-" + dd;
    }

    // HTML escape helper
    function escapeHtml(str) {
        if (!str) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 3. Dynamic Form Generator
    function ZeroPointRequestManager($container) {
        this.$container = $container;
        this.currentServiceKey = "wedding";
        this.init();
    }

    ZeroPointRequestManager.prototype.init = function() {
        var self = this;

        // Parse query parameter
        var urlParams = new URLSearchParams(window.location.search);
        var initialService = resolveServiceKey(urlParams.get("service") || urlParams.get("offering"));

        // Render base shell
        this.renderShell();

        // Activate initial service
        this.switchService(initialService, false);

        // Bind global service selector tabs
        this.$container.on("click", ".zp-service-pill", function(e) {
            e.preventDefault();
            var targetKey = $(this).attr("data-service-key");
            self.switchService(targetKey, true);
        });

        // Bind conditional field listeners (e.g., song selected -> show title/artist)
        this.$container.on("change", 'input[name="chosen_song_status"]', function() {
            self.updateConditionals();
        });

        // Bind form submission
        this.$container.on("submit", "#zp-dynamic-form", function(e) {
            e.preventDefault();
            self.submitForm($(this));
        });

        // Listen for browser popstate
        window.addEventListener("popstate", function(e) {
            if (e.state && e.state.serviceKey) {
                self.switchService(e.state.serviceKey, false);
            }
        });
    };

    ZeroPointRequestManager.prototype.renderShell = function() {
        var html = '';
        html += '<div class="zp-request-shell">';
        
        // Header
        html += '  <div class="zp-request-header text-center">';
        html += '    <h3 class="zp-request-title">Request an Engagement</h3>';
        html += '    <p class="zp-request-desc">Tell us about your requested ZEROPOINT experience. Each request is reviewed individually before acceptance.</p>';
        html += '  </div>';

        // Service Selector Cards / Pills
        html += '  <div class="zp-service-selector-wrap" role="tablist" aria-label="Select Service">';
        html += '    <div class="zp-service-selector-grid">';
        
        var serviceKeys = ["wedding", "private-social", "corporate", "solo-duo"];
        for (var i = 0; i < serviceKeys.length; i++) {
            var s = SERVICES[serviceKeys[i]];
            html += '      <button type="button" class="zp-service-pill" data-service-key="' + s.key + '" role="tab" id="tab-' + s.key + '" aria-selected="false" aria-controls="panel-' + s.key + '">';
            html += '        <span class="zp-pill-badge">' + escapeHtml(s.badge) + '</span>';
            html += '        <span class="zp-pill-name">' + escapeHtml(s.name) + '</span>';
            html += '      </button>';
        }
        
        html += '    </div>';
        html += '  </div>';

        // Dynamic Form Form-Element Container
        html += '  <div class="zp-dynamic-form-wrap">';
        html += '    <form id="zp-dynamic-form" class="zp-form" novalidate>';
        html += '      <div id="zp-form-fields-target" class="row"></div>';
        html += '      <div id="zp-form-disclaimer-target"></div>';
        html += '      <div id="zp-form-status-target" role="alert" aria-live="polite"></div>';
        html += '      <div class="zp-form-submit-wrap text-center">';
        html += '        <button type="submit" class="c-btn zp-btn-submit" id="zp-submit-button">';
        html += '          <span>SUBMIT REQUEST &rarr;</span>';
        html += '        </button>';
        html += '      </div>';
        html += '    </form>';
        html += '  </div>';

        html += '</div>';

        this.$container.html(html);
    };

    ZeroPointRequestManager.prototype.switchService = function(serviceKey, updateHistory) {
        var resolvedKey = resolveServiceKey(serviceKey);
        this.currentServiceKey = resolvedKey;

        // Update Pill States
        this.$container.find(".zp-service-pill").each(function() {
            var $pill = $(this);
            var isCurrent = ($pill.attr("data-service-key") === resolvedKey);
            $pill.toggleClass("active", isCurrent);
            $pill.attr("aria-selected", isCurrent ? "true" : "false");
        });

        // Update URL query parameter without full reload if requested
        if (updateHistory && window.history && window.history.replaceState) {
            var newUrl = window.location.pathname + "?service=" + encodeURIComponent(resolvedKey);
            window.history.replaceState({ serviceKey: resolvedKey }, "", newUrl);
        }

        // Render fields for current service
        this.renderServiceFields(resolvedKey);

        // Clear previous alerts
        this.$container.find("#zp-form-status-target").empty();
    };

    ZeroPointRequestManager.prototype.renderServiceFields = function(serviceKey) {
        var service = SERVICES[serviceKey];
        if (!service) return;

        var $fieldsTarget = this.$container.find("#zp-form-fields-target");
        var $disclaimerTarget = this.$container.find("#zp-form-disclaimer-target");
        var today = getTodayString();
        var html = '';

        for (var i = 0; i < service.fields.length; i++) {
            var f = service.fields[i];
            var colClass = f.col || "col-xs-12";
            var isConditional = Boolean(f.conditionalOn);
            var condAttr = isConditional ? ' data-conditional-parent="' + f.conditionalOn.field + '" data-conditional-value="' + f.conditionalOn.value + '" style="display: none;"' : '';

            html += '<div class="' + colClass + ' zp-field-col" id="wrap-' + f.name + '"' + condAttr + '>';
            html += '  <div class="zp-field-group">';

            // Label
            if (f.type !== "checkbox") {
                html += '    <label class="zp-field-label" for="zp-input-' + f.name + '">';
                html += escapeHtml(f.label);
                if (f.required) {
                    html += ' <span class="zp-required" aria-hidden="true">*</span>';
                }
                html += '    </label>';
            }

            // Input Control by Type
            if (f.type === "text" || f.type === "email" || f.type === "tel") {
                html += '    <input type="' + f.type + '" id="zp-input-' + f.name + '" name="' + f.name + '" class="zp-input" placeholder="' + escapeHtml(f.placeholder || "") + '"';
                if (f.required) html += ' required aria-required="true"';
                html += ' autocomplete="off">';
            } else if (f.type === "date") {
                html += '    <input type="date" id="zp-input-' + f.name + '" name="' + f.name + '" class="zp-input zp-date-input"';
                if (f.futureOnly) {
                    html += ' min="' + today + '"';
                }
                if (f.required) html += ' required aria-required="true"';
                html += '>';
            } else if (f.type === "number") {
                html += '    <input type="number" id="zp-input-' + f.name + '" name="' + f.name + '" class="zp-input" placeholder="' + escapeHtml(f.placeholder || "") + '"';
                if (typeof f.min !== "undefined") html += ' min="' + f.min + '"';
                if (typeof f.max !== "undefined") html += ' max="' + f.max + '"';
                if (f.required) html += ' required aria-required="true"';
                html += '>';
            } else if (f.type === "textarea") {
                html += '    <textarea id="zp-input-' + f.name + '" name="' + f.name + '" class="zp-input zp-textarea" rows="4" placeholder="' + escapeHtml(f.placeholder || "") + '"';
                if (f.required) html += ' required aria-required="true"';
                html += '></textarea>';
            } else if (f.type === "radio") {
                html += '    <div class="zp-radio-group" role="radiogroup" aria-label="' + escapeHtml(f.label) + '">';
                for (var optIdx = 0; optIdx < f.options.length; optIdx++) {
                    var opt = f.options[optIdx];
                    var radioId = 'zp-radio-' + f.name + '-' + optIdx;
                    html += '      <label class="zp-radio-item" for="' + radioId + '">';
                    html += '        <input type="radio" id="' + radioId + '" name="' + f.name + '" value="' + escapeHtml(opt.value) + '" class="zp-radio-input"';
                    if (f.required) html += ' required';
                    html += '>';
                    html += '        <span class="zp-radio-custom"></span>';
                    html += '        <span class="zp-radio-text">' + escapeHtml(opt.label) + '</span>';
                    html += '      </label>';
                }
                html += '    </div>';
            } else if (f.type === "checkbox") {
                var checkId = 'zp-check-' + f.name;
                html += '    <div class="zp-checkbox-group">';
                html += '      <label class="zp-checkbox-item" for="' + checkId + '">';
                html += '        <input type="checkbox" id="' + checkId + '" name="' + f.name + '" value="confirmed" class="zp-checkbox-input"';
                if (f.required) html += ' required aria-required="true"';
                html += '>';
                html += '        <span class="zp-checkbox-custom"></span>';
                html += '        <span class="zp-checkbox-text">' + escapeHtml(f.label);
                if (f.required) html += ' <span class="zp-required" aria-hidden="true">*</span>';
                html += '        </span>';
                html += '      </label>';
                html += '    </div>';
            }

            // Help text if specified
            if (f.helpText) {
                html += '    <small class="zp-field-help">' + escapeHtml(f.helpText) + '</small>';
            }

            // Error container
            html += '    <div class="zp-field-error" id="err-' + f.name + '" aria-live="polite"></div>';

            html += '  </div>';
            html += '</div>';
        }

        $fieldsTarget.html(html);

        // Render Disclaimer
        var discHtml = '';
        discHtml += '<div class="zp-disclaimer-box">';
        discHtml += '  <i class="ion-ios-information-outline zp-disclaimer-icon"></i>';
        discHtml += '  <p class="zp-disclaimer-text">' + escapeHtml(service.disclaimer) + '</p>';
        discHtml += '</div>';
        $disclaimerTarget.html(discHtml);

        // Update conditional visibility immediately
        this.updateConditionals();
    };

    ZeroPointRequestManager.prototype.updateConditionals = function() {
        var self = this;
        this.$container.find('[data-conditional-parent]').each(function() {
            var $col = $(this);
            var parentName = $col.attr("data-conditional-parent");
            var reqValue = $col.attr("data-conditional-value");
            var currentVal = self.$container.find('input[name="' + parentName + '"]:checked').val();

            if (currentVal === reqValue) {
                $col.slideDown(200);
            } else {
                $col.slideUp(200);
                // Clear hidden conditional field value
                $col.find(".zp-input").val("");
                $col.find(".zp-field-error").empty();
                $col.find(".zp-input").removeClass("has-error");
            }
        });
    };

    ZeroPointRequestManager.prototype.validate = function() {
        var service = SERVICES[this.currentServiceKey];
        if (!service) return { isValid: false, data: {} };

        var isValid = true;
        var data = {};
        var self = this;

        // Clear previous error styles
        this.$container.find(".zp-field-error").empty();
        this.$container.find(".zp-input, .zp-radio-group, .zp-checkbox-group").removeClass("has-error");

        for (var i = 0; i < service.fields.length; i++) {
            var f = service.fields[i];
            var $col = this.$container.find('#wrap-' + f.name);

            // Skip conditional fields that are currently hidden
            if (f.conditionalOn) {
                var parentVal = this.$container.find('input[name="' + f.conditionalOn.field + '"]:checked').val();
                if (parentVal !== f.conditionalOn.value) {
                    continue;
                }
            }

            var $err = this.$container.find('#err-' + f.name);
            var fieldVal = "";

            if (f.type === "radio") {
                var $checked = this.$container.find('input[name="' + f.name + '"]:checked');
                fieldVal = $checked.val() || "";
                if (f.required && !fieldVal) {
                    isValid = false;
                    $err.text("Please select an option.");
                    this.$container.find('input[name="' + f.name + '"]').closest(".zp-radio-group").addClass("has-error");
                } else {
                    data[f.name] = fieldVal;
                }
            } else if (f.type === "checkbox") {
                var isChecked = this.$container.find('#zp-check-' + f.name).is(":checked");
                if (f.required && !isChecked) {
                    isValid = false;
                    $err.text("Confirmation is required to proceed.");
                    this.$container.find('#zp-check-' + f.name).closest(".zp-checkbox-group").addClass("has-error");
                } else {
                    data[f.name] = isChecked;
                }
            } else {
                var $input = this.$container.find('#zp-input-' + f.name);
                fieldVal = $.trim($input.val() || "");

                // Required check
                if (f.required && fieldVal.length === 0) {
                    isValid = false;
                    $err.text("This field is required.");
                    $input.addClass("has-error");
                    continue;
                }

                // Wedding conditional song title validation
                if (f.name === "song_title_artist") {
                    var songSelected = (this.$container.find('input[name="chosen_song_status"]:checked').val() === "selected");
                    if (songSelected && fieldVal.length === 0) {
                        isValid = false;
                        $err.text("Please enter your chosen song title and artist.");
                        $input.addClass("has-error");
                        continue;
                    }
                }

                // Email validation
                if (f.type === "email" && fieldVal.length > 0) {
                    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                    if (!emailRegex.test(fieldVal)) {
                        isValid = false;
                        $err.text("Please enter a valid email address.");
                        $input.addClass("has-error");
                        continue;
                    }
                }

                // Phone validation (flexible international without single-country bias)
                if (f.type === "tel" && fieldVal.length > 0) {
                    var cleanedPhone = fieldVal.replace(/[\s\-\(\)\+\.]/g, "");
                    if (cleanedPhone.length < 7 || !/^[0-9]+$/.test(cleanedPhone)) {
                        isValid = false;
                        $err.text("Please enter a plausible contact phone number.");
                        $input.addClass("has-error");
                        continue;
                    }
                }

                // Date validation (must not be in the past)
                if (f.type === "date" && fieldVal.length > 0 && f.futureOnly) {
                    var selDate = new Date(fieldVal + "T00:00:00");
                    var now = new Date();
                    now.setHours(0, 0, 0, 0);
                    if (isNaN(selDate.getTime()) || selDate < now) {
                        isValid = false;
                        $err.text("Date cannot be in the past. Please select an upcoming date.");
                        $input.addClass("has-error");
                        continue;
                    }
                }

                // Number validation (participant counts)
                if (f.type === "number" && fieldVal.length > 0) {
                    var numVal = parseInt(fieldVal, 10);
                    if (isNaN(numVal) || String(numVal) !== fieldVal) {
                        isValid = false;
                        $err.text("Please enter a valid whole number.");
                        $input.addClass("has-error");
                        continue;
                    }
                    if (typeof f.min !== "undefined" && numVal < f.min) {
                        isValid = false;
                        $err.text("Minimum participant count is " + f.min + ".");
                        $input.addClass("has-error");
                        continue;
                    }
                    if (typeof f.max !== "undefined" && numVal > f.max) {
                        isValid = false;
                        $err.text("Maximum participant count for this ensemble is " + f.max + ".");
                        $input.addClass("has-error");
                        continue;
                    }
                    data[f.name] = numVal;
                    continue;
                }

                data[f.name] = fieldVal;
            }
        }

        return { isValid: isValid, data: data };
    };

    ZeroPointRequestManager.prototype.submitForm = function($form) {
        var self = this;
        var validation = this.validate();
        var $status = this.$container.find("#zp-form-status-target");
        var $submitBtn = this.$container.find("#zp-submit-button");

        if (!validation.isValid) {
            $status.html('<div class="zp-alert zp-alert-error"><i class="ion-alert-circled"></i> Please complete the highlighted required fields before submitting.</div>');
            
            // Scroll to first error
            var $firstError = this.$container.find(".has-error").first();
            if ($firstError.length) {
                $('html, body').animate({
                    scrollTop: $firstError.offset().top - 120
                }, 300);
            }
            return;
        }

        // Prepare structured submission object
        var submissionPayload = {
            serviceKey: this.currentServiceKey,
            serviceName: SERVICES[this.currentServiceKey].name,
            submittedAt: new Date().toISOString(),
            formData: validation.data
        };

        // Loading state
        $submitBtn.prop("disabled", true).addClass("zp-btn-loading");
        $status.html('<div class="zp-alert zp-alert-info"><i class="ion-load-c fa-spin"></i> Processing your confidential engagement request...</div>');

        // Store latest submission locally for reference
        try {
            var pastSubmissions = JSON.parse(localStorage.getItem("zeropoint_requests") || "[]");
            pastSubmissions.push(submissionPayload);
            localStorage.setItem("zeropoint_requests", JSON.stringify(pastSubmissions));
        } catch (e) {
            // Safe fallback if storage unavailable
        }

        // Prepare flattened payload for Universal Email Service (Option A: Auto-Discovery Table)
        var postData = {
            "_subject": "ZEROPOINT Engagement Request: " + submissionPayload.serviceName,
            "Service Requested": submissionPayload.serviceName,
            "Service Category": submissionPayload.serviceKey
        };
        for (var fKey in validation.data) {
            if (validation.data.hasOwnProperty(fKey)) {
                postData[fKey] = validation.data[fKey];
            }
        }

        // Determine handler endpoint: if tested on Live Server (port 5500), forward to local IIS Express (port 8088)
        var handlerUrl = "../emailmodule/send-email.ashx";
        if (window.location.port === "5500" || window.location.port === "3000") {
            handlerUrl = "http://localhost:8088/emailmodule/send-email.ashx";
        }

        // Post to backend adapter (Universal IIS handler)
        var jqXHR = $.ajax({
            url: handlerUrl,
            type: "POST",
            data: postData,
            dataType: "json",
            timeout: 25000
        });

        jqXHR.done(function(resp) {
            $submitBtn.prop("disabled", false).removeClass("zp-btn-loading");
            // Check if backend indicates success
            var isSuccess = (resp && (resp.success === true || resp.status === "ok"));

            if (!isSuccess) {
                var errTxt = (resp && (resp.message || resp.error)) ? (resp.message || resp.error) : "The server could not process the request. Your details remain preserved below.";
                $status.html('<div class="zp-alert zp-alert-error"><i class="ion-alert-circled"></i> ' + escapeHtml(errTxt) + '</div>');
                return;
            }

            $form.slideUp(300, function() {
                var successHtml = '';
                successHtml += '<div class="zp-success-card text-center">';
                successHtml += '  <div class="zp-success-ring"><i class="ion-ios-checkmark-empty"></i></div>';
                successHtml += '  <h4>Engagement Request Received</h4>';
                successHtml += '  <p class="zp-success-lead">Thank you. Your request for <strong>' + escapeHtml(submissionPayload.serviceName) + '</strong> has been submitted to the ZEROPOINT principal concierge.</p>';
                successHtml += '  <p class="zp-success-sub">Every engagement is reviewed individually with strict confidentiality. You will be contacted via your preferred details within 24 to 48 hours.</p>';
                successHtml += '  <div class="zp-success-actions">';
                successHtml += '    <a href="services.html" class="c-btn"><span>Explore Offerings</span></a>';
                successHtml += '  </div>';
                successHtml += '</div>';
                $status.html(successHtml);
            });
        });

        jqXHR.fail(function(xhr, statusText) {
            $submitBtn.prop("disabled", false).removeClass("zp-btn-loading");
            
            var errMessage = '';
            if (xhr.responseJSON && (xhr.responseJSON.error || xhr.responseJSON.message)) {
                errMessage = xhr.responseJSON.error || xhr.responseJSON.message;
            } else {
                errMessage = "The request could not be dispatched to the email handler. Please ensure your Windows IIS web server with ASP.NET is running on this port.";
            }

            var errorMessage = '';
            errorMessage += '<div class="zp-alert zp-alert-error" style="text-align: left; margin-bottom: 25px; padding: 16px 20px;">';
            errorMessage += '  <div style="display: flex; align-items: flex-start; gap: 14px;">';
            errorMessage += '    <i class="ion-alert-circled" style="font-size: 22px; line-height: 1.2; color: #c9302c; flex-shrink: 0; margin-top: 1px;"></i>';
            errorMessage += '    <div>';
            errorMessage += '      <strong style="color: #58151c; display: block; margin-bottom: 6px; font-size: 14px; font-weight: 700;">Submission Notice</strong>';
            errorMessage += '      <p style="margin: 0 0 10px 0; color: #721c24; font-size: 13px; line-height: 1.5; font-weight: 500;">' + escapeHtml(errMessage) + '</p>';
            errorMessage += '      <p style="margin: 0; color: #721c24; font-size: 12px; letter-spacing: 0.02em;">For immediate assistance, please reach the concierge directly at <a href="mailto:zeropoint.dance@proton.me" style="color: #58151c; font-weight: 700; text-decoration: underline;">zeropoint.dance@proton.me</a>.</p>';
            errorMessage += '    </div>';
            errorMessage += '  </div>';
            errorMessage += '</div>';

            $status.html(errorMessage);
            $('html, body').animate({
                scrollTop: $status.offset().top - 120
            }, 300);
        });
    };

    // Auto-initialize on ready
    $(function() {
        var $requestContainer = $("#zeropoint-request-form");
        if ($requestContainer.length) {
            new ZeroPointRequestManager($requestContainer);
        }
    });

})(jQuery);
