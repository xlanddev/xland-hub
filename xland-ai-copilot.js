/* =========================================================
   XLAND AI COPILOT
   Xland Hub 5.2
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("copilotSearch");
    const searchButton = document.getElementById("copilotSearchButton");

    const resultBox = document.getElementById("copilotResult");
    const noResultBox = document.getElementById("copilotNoResult");

    const resultIcon = document.getElementById("copilotResultIcon");
    const resultTitle = document.getElementById("copilotResultTitle");
    const resultDescription = document.getElementById("copilotResultDescription");
    const resultLink = document.getElementById("copilotResultLink");

    const suggestions = document.querySelectorAll(".copilot-suggestion");


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (!searchInput || !searchButton) {
        console.warn("Xland AI Copilot: required elements not found.");
        return;
    }


    /* =====================================================
       XLAND DESTINATIONS
    ===================================================== */

    const destinations = [

        {
            keywords: [
                "game",
                "games",
                "بازی",
                "بازی ها",
                "بازی‌ها",
                "xland game"
            ],

            icon: "🎮",

            title: "Xland Game",

            description:
                "بازی اصلی Xland با دنیایی اختصاصی و تجربه‌ای متفاوت برای بازیکنان.",

            link: "xland.html"
        },


        {
            keywords: [
                "endless",
                "road",
                "horror",
                "ترس",
                "ترسناک",
                "جاده",
                "endless road"
            ],

            icon: "👻",

            title: "Endless Road Horror 3D",

            description:
                "یک بازی ترسناک سه‌بعدی با جاده‌ای بی‌پایان و اتفاقات غیرمنتظره.",

            link: "endless.html"
        },


        {
            keywords: [
                "script",
                "xland script",
                "developer",
                "developers",
                "dev",
                "کدنویسی",
                "برنامه نویسی",
                "برنامه‌نویسی",
                "توسعه دهنده",
                "توسعه‌دهنده"
            ],

            icon: "📜",

            title: "Xland Script",

            description:
                "مرکز توسعه‌دهندگان Xland برای اسکریپت‌ها، ابزارها و منابع برنامه‌نویسی.",

            link: "xland-script.html"
        },


        {
            keywords: [
                "api",
                "apis",
                "xland api",
                "رابط برنامه نویسی",
                "رابط برنامه‌نویسی"
            ],

            icon: "🌍",

            title: "Xland API",

            description:
                "زیرساخت API برای اتصال پروژه‌ها و سرویس‌های مختلف Xland.",

            link: "api.html"
        },


        {
            keywords: [
                "news",
                "news xland",
                "اخبار",
                "خبر",
                "اخبار xland"
            ],

            icon: "📰",

            title: "Xland News",

            description:
                "آخرین اخبار، تغییرات و اتفاقات مربوط به اکوسیستم Xland.",

            link: "news.html"
        },


        {
            keywords: [
                "support",
                "help",
                "problem",
                "ticket",
                "پشتیبانی",
                "کمک",
                "مشکل",
                "تیکت"
            ],

            icon: "🛠️",

            title: "Xland Support",

            description:
                "مرکز پشتیبانی Xland برای دریافت راهنمایی و ارسال تیکت.",

            link: "support.html"
        },


        {
            keywords: [
                "map",
                "xland map",
                "minecraft map",
                "مپ",
                "نقشه",
                "مپ xland",
                "ماینکرفت"
            ],

            icon: "🗺️",

            title: "Xland Map",

            description:
                "صفحه دانلود و اطلاعات مربوط به مپ Xland.",

            link: "xland-map.html"
        },


        {
            keywords: [
                "video",
                "videos",
                "ویدیو",
                "ویدئو",
                "فیلم"
            ],

            icon: "🎬",

            title: "Xland Videos",

            description:
                "ویدیوها و محتوای ویدیویی Xland.",

            link: "videos.html"
        },


        {
            keywords: [
                "wild horizon",
                "wild",
                "horizon"
            ],

            icon: "🌄",

            title: "Wild Horizon Game",

            description:
                "پروژه بازی Wild Horizon در اکوسیستم Xland.",

            link: "open-world-game.html"
        },


        {
            keywords: [
                "about",
                "who are you",
                "who is xland",
                "درباره",
                "درباره ما",
                "xland چیست"
            ],

            icon: "ℹ️",

            title: "About Xland",

            description:
                "با Xland، پروژه‌ها و مسیر شکل‌گیری این اکوسیستم بیشتر آشنا شوید.",

            link: "about.html"
        },


        {
            keywords: [
                "rules",
                "rule",
                "قوانین",
                "قانون"
            ],

            icon: "📋",

            title: "Xland Rules",

            description:
                "قوانین و مقررات Xland Hub.",

            link: "rules.html"
        },


        {
            keywords: [
                "ai",
                "xland ai",
                "copilot",
                "هوش مصنوعی",
                "هوش مصنوعی xland"
            ],

            icon: "🤖",

            title: "Xland AI",

            description:
                "ورود به Xland AI برای استفاده از دستیار هوش مصنوعی Xland.",

            link: "https://xland-ai-web.onrender.com/"
        }

    ];


    /* =====================================================
       NORMALIZE TEXT
    ===================================================== */

    function normalizeText(text) {

        return text
            .toLowerCase()
            .trim()
            .replace(/ي/g, "ی")
            .replace(/ك/g, "ک")
            .replace(/[ًٌٍَُِّْ]/g, "")
            .replace(/\s+/g, " ");

    }


    /* =====================================================
       FIND DESTINATION
    ===================================================== */

    function findDestination(query) {

        const normalizedQuery = normalizeText(query);

        if (!normalizedQuery) {
            return null;
        }


        /* Exact / phrase match */

        for (const destination of destinations) {

            for (const keyword of destination.keywords) {

                const normalizedKeyword =
                    normalizeText(keyword);

                if (
                    normalizedQuery === normalizedKeyword ||
                    normalizedQuery.includes(normalizedKeyword)
                ) {

                    return destination;

                }

            }

        }


        /* Word-based match */

        const queryWords =
            normalizedQuery.split(" ");

        let bestMatch = null;
        let bestScore = 0;


        for (const destination of destinations) {

            let score = 0;

            for (const keyword of destination.keywords) {

                const normalizedKeyword =
                    normalizeText(keyword);

                const keywordWords =
                    normalizedKeyword.split(" ");


                for (const queryWord of queryWords) {

                    for (const keywordWord of keywordWords) {

                        if (
                            queryWord.length >= 3 &&
                            keywordWord.length >= 3 &&
                            (
                                queryWord === keywordWord ||
                                queryWord.includes(keywordWord) ||
                                keywordWord.includes(queryWord)
                            )
                        ) {

                            score++;

                        }

                    }

                }

            }


            if (score > bestScore) {

                bestScore = score;

                bestMatch = destination;

            }

        }


        return bestMatch;

    }


    /* =====================================================
       SHOW RESULT
    ===================================================== */

    function showResult(destination) {

        if (!destination) {

            resultBox.classList.remove("show");

            noResultBox.classList.add("show");

            return;

        }


        noResultBox.classList.remove("show");


        resultIcon.textContent =
            destination.icon;


        resultTitle.textContent =
            destination.title;


        resultDescription.textContent =
            destination.description;


        resultLink.href =
            destination.link;


        resultBox.classList.remove("show");


        /*
         * Force animation restart
         */

        void resultBox.offsetWidth;


        resultBox.classList.add("show");

    }


    /* =====================================================
       SEARCH
    ===================================================== */

    function performSearch() {

        const query =
            searchInput.value;

        if (!query.trim()) {

            resultBox.classList.remove("show");

            noResultBox.classList.remove("show");

            return;

        }


        const destination =
            findDestination(query);


        showResult(destination);

    }


    /* =====================================================
       BUTTON
    ===================================================== */

    searchButton.addEventListener(
        "click",
        performSearch
    );


    /* =====================================================
       ENTER KEY
    ===================================================== */

    searchInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                event.preventDefault();

                performSearch();

            }

        }
    );


    /* =====================================================
       QUICK SUGGESTIONS
    ===================================================== */

    suggestions.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const query =
                        button.dataset.query ||
                        button.textContent;

                    searchInput.value =
                        query.trim();

                    performSearch();

                    searchInput.focus();

                }
            );

        }
    );


    /* =====================================================
       INITIAL STATE
    ===================================================== */

    resultBox.classList.remove("show");
    noResultBox.classList.remove("show");

});