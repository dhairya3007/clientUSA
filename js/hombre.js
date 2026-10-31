/*
1. preloader
2. fadeIn
  2-1. fadeIn.element
  2-2. fadeIn.borders
  2-3. fadeIn.hero
3. countdown SETUP
4. menu active state
5. wordRotator
6. facts counter
7. skills bar
8. forms
  8-1. contact form
  8-2. newsletter form
9. signup form
  9-1. signup form additional CLOSER
10. slick slider
  10-1. slick fullscreen
  10-2. slick fullscreen SPLIT
11. YTPlayer
12. MOBILE DETECT
13. snow
14. Vimeo player
*/


$(function() {
    "use strict";
	
	
    // 1. & 2. fadeIn (instant on load, preloader removed)
    function initPageAppearance() {
        $(".fadeIn-element").fadeIn(600);
        $(".fadeIn-element-2").fadeIn(600);
        $(".border-left").removeClass("left-position");
        $(".border-right").removeClass("right-position");
        $(".border-top").removeClass("top-position");
        $(".border-bottom").removeClass("bottom-position");
        $(".hero-bg").addClass("hero-bg-show");
    }
    initPageAppearance();
    $(window).on("load", function() {
        initPageAppearance();
    });
	
    // 3. countdown SETUP
    $("#countdown").countdown({
        date: "05 May 2028 12:00:00", // countdown target date settings
        format: "on"
    }, function() {});
	
    // 4. menu active state
    $("a.menu-state").on("click", function() {
        $("a.menu-state").removeClass("active");
        $(this).addClass("active");
    });
	
    // 5. wordRotator (content removed per instruction, box preserved in DOM)
    /*
    if ($("#wordrotator").length) {
        $("#wordrotator").wordsrotator({
            autoLoop: true,
            randomize: false,
            stopOnHover: false,
            changeOnClick: false,
            animationIn: "fadeInLeft",
            animationOut: "fadeOutRight",
            speed: 4000,
            words: ['ZEROPOINT', 'STILLNESS IN MOTION']
        });
    }
    */
	
    // 6. facts counter
    $(".facts-counter-number").appear(function() {
        var count = $(this);
        count.countTo({
            from: 0,
            to: count.html(),
            speed: 1200,
            refreshInterval: 60
        });
    });
	
    // 6-1. About Year Counter Animation (2006)
    function runAboutYearCounter() {
        var $counter = $(".about-year-counter");
        if (!$counter.length) return;
        var targetYear = parseInt($counter.attr("data-target"), 10) || 2006;
        var startYear = 1990;
        var duration = 1600;
        var startTimestamp = null;

        function animateCount(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            var progress = Math.min((timestamp - startTimestamp) / duration, 1);
            var ease = 1 - Math.pow(1 - progress, 3);
            var currentVal = Math.floor(startYear + (targetYear - startYear) * ease);
            $counter.text(currentVal);
            if (progress < 1) {
                window.requestAnimationFrame(animateCount);
            } else {
                $counter.text(targetYear);
            }
        }
        window.requestAnimationFrame(animateCount);
    }

    // 6-2. Navigation transitions - show logo in low visibility on inner pages
    $("#fire-about, #fire-services, #fire-contact").on("click", function() {
        $("body").addClass("inner-page-active");
        $("#hero-bg, #hero-fullscreen-iframe").addClass("hero-bg-low-vis");
    });

    $("#fire-home").on("click", function() {
        $("body").removeClass("inner-page-active");
        $("#hero-bg, #hero-fullscreen-iframe").removeClass("hero-bg-low-vis");
    });

    $("#fire-about").on("click", function() {
        setTimeout(function() {
            runAboutYearCounter();
        }, 500);
    });

    $(".about-year-counter").appear(function() {
        runAboutYearCounter();
    });
    if ($(".about-year-counter").length) {
        setTimeout(function() {
            runAboutYearCounter();
        }, 300);
    }
	
    // 7. skills bar
    $(".show-skillbar").appear(function() {
        $(".skillbar").skillBars({
            from: 0,
            speed: 4000,
            interval: 100,
            decimals: 0
        });
    });
	
    // 8. forms
    // 8-1. contact form
    $("form#form").on("submit", function() {
        $("form#form .error").remove();
        var s = !1;
        if ($(".requiredField").each(function() {
                if ("" === jQuery.trim($(this).val())) $(this).prev("label").text(), $(this).parent().append('<span class="error">This field is required</span>'), $(this).addClass(
                    "inputError"), s = !0;
                else if ($(this).hasClass("email")) {
                    var r = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    r.test(jQuery.trim($(this).val())) || ($(this).prev("label").text(), $(this).parent().append('<span class="error">Invalid email address</span>'), $(this).addClass(
                        "inputError"), s = !0);
                }
            }), !s) {
            $("form#form input.submit").fadeOut("normal", function() {
                $(this).parent().append("");
            });
            var r = $(this).serialize();
            $.post($(this).attr("action"), r, function() {
                $("form#form").slideUp("fast", function() {
                    $(this).before('<div class="success">Your email was sent successfully.</div>');
                });
            });
        }
        return !1;
    });
    // 8-2. newsletter form
    $("form#subscribe").on("submit", function() {
        $("form#subscribe .subscribe-error").remove();
        var s = !1;
        if ($(".subscribe-requiredField").each(function() {
                if ("" === jQuery.trim($(this).val())) $(this).prev("label").text(), $(this).parent().append('<span class="subscribe-error">Please enter your Email</span>'),
                    $(this).addClass("inputError"), s = !0;
                else if ($(this).hasClass("subscribe-email")) {
                    var r = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    r.test(jQuery.trim($(this).val())) || ($(this).prev("label").text(), $(this).parent().append('<span class="subscribe-error">Please enter a valid Email</span>'),
                        $(this).addClass("inputError"), s = !0);
                }
            }), !s) {
            $("form#subscribe input.submit").fadeOut("normal", function() {
                $(this).parent().append("");
            });
            var r = $(this).serialize();
            $.post($(this).attr("action"), r, function() {
                $("form#subscribe").slideUp("fast", function() {
                    $(this).before('<div class="subscribe-success">Thank you for subscribing.</div>');
                });
            });
        }
        return !1;
    });
	
    // 9. signup form
    $(".ex-modal-launcher, .ex-modal-closer").on("click", function() {
        if ($(".ex-modal").hasClass("open")) {
            $(".ex-modal").removeClass("open");
            $(".ex-modal").addClass("close");
        } else {
            $(".ex-modal").removeClass("close");
            $(".ex-modal").addClass("open");
        }
    });
    // 9-1. signup form additional CLOSER
    $(".menu-toggle").on("click", function() {
        $(".ex-modal").removeClass("open");
        $(".ex-modal").addClass("close");
    });
	
	// 10. slick slider
    // 10-1. slick fullscreen
    $(".slick-fullscreen").slick({
        arrows: false,
        initialSlide: 0,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: "<i class='slick-prev icon ion-chevron-left'></i>",
        nextArrow: "<i class='slick-next icon ion-chevron-right'></i>",
        fade: false,
        autoplay: true,
        autoplaySpeed: 4000,
        cssEase: "ease",
        speed: 800,
        draggable: true,
        dots: false,
        pauseOnDotsHover: true,
        pauseOnFocus: false,
        pauseOnHover: false
    });
    // 10-2. slick fullscreen SPLIT
    $(".slick-fullscreen-split").slick({
        arrows: true,
        initialSlide: 0,
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        prevArrow: "<i class='slick-prev icon ion-chevron-left'></i>",
        nextArrow: "<i class='slick-next icon ion-chevron-right'></i>",
        fade: false,
        autoplay: true,
        autoplaySpeed: 4000,
        cssEase: "ease",
        speed: 800,
        draggable: true,
        dots: false,
        pauseOnDotsHover: true,
        pauseOnFocus: false,
        pauseOnHover: false
    });
	

	
    // 12. MOBILE DETECT
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
	
	// 13. snow
    $("#snow").each(function() {
        snowBind();
    });
	
	// 14. Vimeo player
    $("#vimeo-video").vimeofy({
        "url": "https://vimeo.com/98929509", // Vimeo VIDEO URL
        "color": "#fff",
        "autoplay": true,
        "loop": true,
        "delay": 1200
    });

    // 15. ZEROPOINT SERVICES POP-UP MODAL CONTROLLER
    function openServiceModal(modalId) {
        if (!modalId) return;
        var $modal = $("#" + modalId);
        if ($modal.length) {
            $(".service-modal-overlay").removeClass("active").attr("aria-hidden", "true");
            $modal.addClass("active").attr("aria-hidden", "false");
            $("body").addClass("modal-open").css("overflow", "hidden");
            setTimeout(function() {
                $modal.find(".service-modal-close").focus();
            }, 100);
        }
    }

    function closeServiceModals() {
        $(".service-modal-overlay").removeClass("active").attr("aria-hidden", "true");
        $("body").removeClass("modal-open").css("overflow", "");
    }

    // Navigate to dedicated service page on service card click
    $(document).on("click", ".service-card", function(e) {
        if ($(e.target).closest("a").length) {
            return;
        }
        var serviceUrl = $(this).attr("data-service-url");
        if (serviceUrl) {
            window.location.href = serviceUrl;
        }
    });

    // Sub-menu toggle in navigation
    $(document).on("click", ".sub-menu-toggle", function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $item = $(this).closest(".menu-has-children");
        $item.toggleClass("is-open");
    });

    // Legal links handler: smooth handling for in-page anchors
    $(document).on("click", ".footer-legal-links a.legal-link", function(e) {
        var href = $(this).attr("href");
        if (href && href.charAt(0) === "#") {
            e.preventDefault();
        }
    });

    // Close on X button, close button, or backdrop click
    $(document).on("click", ".service-modal-close, .service-modal-closer-btn, .service-modal-backdrop", function(e) {
        e.preventDefault();
        closeServiceModals();
    });

    // Prevent backdrop close when clicking inside the modal dialog
    $(document).on("click", ".service-modal-dialog", function(e) {
        e.stopPropagation();
    });

    // Close on Escape key press
    $(document).on("keydown", function(e) {
        if (e.key === "Escape" || e.keyCode === 27) {
            closeServiceModals();
        }
    });

    // Modal Inquire Button action -> Takes to contact page with preselected service
    $(document).on("click", ".c-btn-modal-inquire", function(e) {
        var serviceKey = $(this).attr("data-service-key");
        var serviceName = $(this).attr("data-service-name") || "Private Dance Engagement";
        closeServiceModals();

        var targetParam = serviceKey || encodeURIComponent(serviceName);
        if ($("#zeropoint-request-form").length) {
            e.preventDefault();
            var $target = $("#zeropoint-request-form");
            $target[0].scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
            window.location.href = "contact.html?service=" + targetParam;
            e.preventDefault();
        }
    });


    // Sticky header background color change on scroll (#d9d4ca)
    var $zpHeader = $(".zp-site-header");
    function updateZpHeaderOnScroll() {
        var scroller = document.querySelector(".ui-layer-inner");
        var st = (scroller ? scroller.scrollTop : 0) || window.pageYOffset || document.documentElement.scrollTop || 0;
        if (st > 10) {
            $zpHeader.addClass("zp-scrolled zp-header-scrolled");
        } else {
            $zpHeader.removeClass("zp-scrolled zp-header-scrolled");
        }
    }
    $(".ui-layer-inner").on("scroll", updateZpHeaderOnScroll);
    $(window).on("scroll", updateZpHeaderOnScroll);
    updateZpHeaderOnScroll();
});