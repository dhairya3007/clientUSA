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
	
	
    $(window).on("load", function() {
        // 1. preloader
        $("#preloader").fadeOut(600);
        $(".preloader-bg").delay(400).fadeOut(600);
		
        // 2. fadeIn
        // 2-1. fadeIn.element
        setTimeout(function() {
            $(".fadeIn-element").delay(1200).css({
                display: "none"
            }).fadeIn(2400);
        }, 0);
        setTimeout(function() {
            $(".fadeIn-element-2").delay(1200).css({
                display: "none"
            }).fadeIn(1200);
        }, 0);
        // 2-2. fadeIn.borders
        setTimeout(function() {
            $(".border-left").removeClass("left-position");
        }, 800);
        setTimeout(function() {
            $(".border-right").removeClass("right-position");
        }, 800);
        setTimeout(function() {
            $(".border-top").removeClass("top-position");
        }, 800);
        setTimeout(function() {
            $(".border-bottom").removeClass("bottom-position");
        }, 800);
        // 2-3. fadeIn.hero
        setTimeout(function() {
            $(".hero-bg").addClass("hero-bg-show");
        }, 400);
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
	
    // 5. wordRotator
    $("#wordrotator").wordsrotator({
        autoLoop: true,
        randomize: false,
        stopOnHover: false,
        changeOnClick: false,
        animationIn: "fadeInLeft",
        animationOut: "fadeOutRight",
        speed: 4000,
        words: ['this is<br><span class="highlighter">Hombre</span>', 'Hombre<br><span class="highlighter">means man</span>']
    });
	
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
	
	// 11. YTPlayer
    $("#background-video").YTPlayer({
        videoId: "9ZfN87gSjvI", // DEMO URL is: https://www.youtube.com/watch?v=9ZfN87gSjvI
        mute: true,             // options: true, false
        pauseOnScroll: false,
        repeat: true,
        fitToBackground: true,
        playerVars: {
            modestbranding: 0,
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            wmode: "transparent",
            branding: 0,
            rel: 0,
            autohide: 0
        }
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


});