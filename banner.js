// ============================
// XLAND Banner Slider v4.2
// Animated Slider
// ============================


const banners = [

    {
        title: "🚀 XLAND Game",
        text: "Download the latest version of XLAND Game.",
        button: "Download",
        link: "xland.html"
    },

    {
        title: "🌍 XLAND api",
        text: "Build powerful applications using XLAND API.",
        button: "Learn More",
        link: "api.html"
    },

    {
        title: "📜 XLAND Script",
        text: "Create scripts quickly with XLAND Script.",
        button: "Open",
        link: "xland-script.html"
    },

    {
        title: "🎮 Endless Road Horror 3D",
        text: "Download the latest version of the horror game.",
        button: "Play",
        link: "endless.html"
    }

];


// ============================
// Current Banner
// ============================

let currentBanner = 0;


// ============================
// Elements
// ============================

const title =
    document.getElementById("banner-title");

const text =
    document.getElementById("banner-text");

const link =
    document.getElementById("banner-link");

const dots =
    document.querySelectorAll(".dot");

const prev =
    document.querySelector(".prev");

const next =
    document.querySelector(".next");

const bannerContent =
    document.querySelector(".banner-content");


// ============================
// Show Banner
// ============================

function showBanner(index) {

    title.textContent =
        banners[index].title;

    text.textContent =
        banners[index].text;

    link.textContent =
        banners[index].button;

    link.href =
        banners[index].link;


    // Update dots

    dots.forEach(dot => {

        dot.classList.remove("active");

    });


    if (dots[index]) {

        dots[index].classList.add("active");

    }

}


// ============================
// Animate Banner
// ============================

function animateBanner(direction) {

    if (!bannerContent) {

        changeBanner(direction);

        return;

    }


    // جلوگیری از کلیک سریع
    if (bannerContent.dataset.animating === "true") {

        return;

    }


    bannerContent.dataset.animating = "true";


    // ============================
    // Exit Animation
    // ============================

    if (direction === "next") {

        bannerContent.classList.add(
            "slide-out-left"
        );

    } else {

        bannerContent.classList.add(
            "slide-out-right"
        );

    }


    // ============================
    // Change Banner
    // ============================

    setTimeout(() => {

        changeBanner(direction);


        // حذف انیمیشن خروج

        bannerContent.classList.remove(
            "slide-out-left",
            "slide-out-right"
        );


        // جلوگیری از باقی ماندن animation

        void bannerContent.offsetWidth;


        // ============================
        // Enter Animation
        // ============================

        if (direction === "next") {

            bannerContent.classList.add(
                "slide-in-right"
            );

        } else {

            bannerContent.classList.add(
                "slide-in-left"
            );

        }


        // ============================
        // Finish Animation
        // ============================

        setTimeout(() => {

            bannerContent.classList.remove(
                "slide-in-right",
                "slide-in-left"
            );

            bannerContent.dataset.animating =
                "false";

        }, 450);


    }, 350);

}


// ============================
// Change Banner
// ============================

function changeBanner(direction) {

    if (direction === "next") {

        currentBanner++;

        if (
            currentBanner >=
            banners.length
        ) {

            currentBanner = 0;

        }

    } else {

        currentBanner--;

        if (currentBanner < 0) {

            currentBanner =
                banners.length - 1;

        }

    }


    showBanner(currentBanner);

}


// ============================
// Next Button
// ============================

if (next) {

    next.addEventListener(
        "click",
        () => {

            animateBanner("next");

        }
    );

}


// ============================
// Previous Button
// ============================

if (prev) {

    prev.addEventListener(
        "click",
        () => {

            animateBanner("prev");

        }
    );

}


// ============================
// Initial Banner
// ============================

showBanner(currentBanner);


// ============================
// Auto Slider
// Every 5 Seconds
// ============================

setInterval(() => {

    animateBanner("next");

}, 5000);