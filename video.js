/* =========================================================
   XLAND SUPPORT 4.1
   VIDEO CENTER
   SEARCH / FILTER / FEATURED / LATEST
   ========================================================= */

document.addEventListener("DOMContentLoaded", loadVideos);


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let allVideos = [];

let currentCategory = "all";

let currentSearch = "";


/* =========================================================
   LOAD VIDEOS
   ========================================================= */

async function loadVideos() {

    const longContainer =
        document.getElementById("long-videos");

    const shortContainer =
        document.getElementById("short-videos");


    try {

        const response =
            await fetch("videos.json");


        if (!response.ok) {

            throw new Error(
                "videos.json پیدا نشد."
            );
        }


        const data =
            await response.json();


        /* -----------------------------------------
           Combine Videos
        ----------------------------------------- */

        const longVideos =
            Array.isArray(data.longVideos)
                ? data.longVideos
                : [];


        const shortVideos =
            Array.isArray(data.shortVideos)
                ? data.shortVideos
                : [];


        allVideos = [

            ...longVideos.map(video => ({
                ...video,
                type: "long"
            })),

            ...shortVideos.map(video => ({
                ...video,
                type: "short"
            }))

        ];


        /* -----------------------------------------
           Sort Newest
        ----------------------------------------- */

        sortVideos();


        /* -----------------------------------------
           Build Controls
        ----------------------------------------- */

        createVideoControls();


        /* -----------------------------------------
           Featured
        ----------------------------------------- */

        createFeaturedVideo();


        /* -----------------------------------------
           Render
        ----------------------------------------- */

        renderVideos();


    }

    catch (error) {

        console.error(
            "Video System Error:",
            error
        );


        if (longContainer) {

            longContainer.innerHTML =
                `<div class="video-error">
                    ❌ خطا در بارگذاری ویدیوها
                </div>`;
        }


        if (shortContainer) {

            shortContainer.innerHTML =
                `<div class="video-error">
                    ❌ خطا در بارگذاری ویدیوها
                </div>`;
        }

    }

}


/* =========================================================
   SORT
   ========================================================= */

function sortVideos() {

    allVideos.sort(
        (a, b) => {

            const dateA =
                new Date(a.date || 0);

            const dateB =
                new Date(b.date || 0);

            return dateB - dateA;
        }
    );

}


/* =========================================================
   CONTROLS
   ========================================================= */

function createVideoControls() {

    const container =
        document.querySelector(
            ".videos-container"
        );


    if (!container)
        return;


    /* جلوگیری از دوباره ساخته شدن */

    if (
        document.getElementById(
            "video-controls"
        )
    ) {
        return;
    }


    const controls =
        document.createElement("div");


    controls.id =
        "video-controls";


    controls.innerHTML = `

        <div class="video-search">

            <input
                id="video-search-input"
                type="search"
                placeholder="جستجوی ویدیو..."
                autocomplete="off"
                aria-label="جستجوی ویدیو"
            >

        </div>


        <div
            id="video-filters"
            class="video-filters"
        ></div>


        <div
            id="video-result-count"
            class="video-result-count"
        ></div>

    `;


    /* Controls را قبل از اولین section قرار بده */

    container.prepend(
        controls
    );


    createFilters();


    const searchInput =
        document.getElementById(
            "video-search-input"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            event => {

                currentSearch =
                    event.target.value
                        .trim()
                        .toLowerCase();

                renderVideos();

            }
        );

    }

}


/* =========================================================
   FILTERS
   ========================================================= */

function createFilters() {

    const filterContainer =
        document.getElementById(
            "video-filters"
        );


    if (!filterContainer)
        return;


    const categories =
        [
            "all",
            ...new Set(
                allVideos
                    .map(video => video.category)
                    .filter(Boolean)
            )
        ];


    filterContainer.innerHTML = "";


    categories.forEach(
        category => {

            const button =
                document.createElement("button");


            button.className =
                "video-filter";


            if (
                category ===
                currentCategory
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.textContent =
                category === "all"
                    ? "🎬 همه"
                    : `🏷️ ${category}`;


            button.type =
                "button";


            button.addEventListener(
                "click",
                () => {

                    currentCategory =
                        category;


                    document
                        .querySelectorAll(
                            ".video-filter"
                        )
                        .forEach(
                            btn =>
                                btn.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    renderVideos();

                }
            );


            filterContainer.appendChild(
                button
            );

        }
    );

}


/* =========================================================
   FILTER VIDEOS
   ========================================================= */

function getFilteredVideos() {

    return allVideos.filter(
        video => {

            const title =
                (
                    video.title ||
                    ""
                ).toLowerCase();


            const category =
                (
                    video.category ||
                    ""
                ).toLowerCase();


            const matchesSearch =

                !currentSearch ||

                title.includes(
                    currentSearch
                ) ||

                category.includes(
                    currentSearch
                );


            const matchesCategory =

                currentCategory ===
                "all" ||

                video.category ===
                currentCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        }
    );

}


/* =========================================================
   RENDER VIDEOS
   ========================================================= */

function renderVideos() {

    const longContainer =
        document.getElementById(
            "long-videos"
        );


    const shortContainer =
        document.getElementById(
            "short-videos"
        );


    if (!longContainer ||
        !shortContainer) {

        return;
    }


    longContainer.innerHTML = "";
    shortContainer.innerHTML = "";


    const filteredVideos =
        getFilteredVideos();


    const longVideos =
        filteredVideos.filter(
            video =>
                video.type === "long"
        );


    const shortVideos =
        filteredVideos.filter(
            video =>
                video.type === "short"
        );


    /* -----------------------------------------
       Long
    ----------------------------------------- */

    if (longVideos.length > 0) {

        longVideos.forEach(
            video => {

                const card =
                    createVideoCard(
                        video,
                        "long"
                    );


                longContainer.appendChild(
                    card
                );

            }
        );

    }

    else {

        showEmptyMessage(
            longContainer,
            currentSearch ||
            currentCategory !== "all"
                ? "❌ ویدیویی با این جستجو پیدا نشد."
                : "هنوز ویدیوی بلندی منتشر نشده است."
        );

    }


    /* -----------------------------------------
       Shorts
    ----------------------------------------- */

    if (shortVideos.length > 0) {

        shortVideos.forEach(
            video => {

                const card =
                    createVideoCard(
                        video,
                        "short"
                    );


                shortContainer.appendChild(
                    card
                );

            }
        );

    }

    else {

        showEmptyMessage(
            shortContainer,
            currentSearch ||
            currentCategory !== "all"
                ? "❌ شورت موردنظر پیدا نشد."
                : "هنوز ویدیوی شورت منتشر نشده است."
        );

    }


    updateResultCount(
        filteredVideos.length
    );


    /* انیمیشن ورود */

    animateRenderedCards();

}


/* =========================================================
   RESULT COUNT
   ========================================================= */

function updateResultCount(count) {

    const result =
        document.getElementById(
            "video-result-count"
        );


    if (!result)
        return;


    result.innerHTML =
        `📊 ${count} ویدیو پیدا شد`;

}


/* =========================================================
   CARD
   ========================================================= */

function createVideoCard(video, type) {

    const card =
        document.createElement("article");


    card.className =
        "video-card";


    /* Latest */

    if (video.latest) {

        card.classList.add(
            "latest-video"
        );

    }


    /* =========================================
       Preview
    ========================================= */

    const preview =
        document.createElement("div");


    preview.className =
        "video-preview";


    if (video.thumbnail) {

        preview.style.backgroundImage =
            `url("${video.thumbnail}")`;

        preview.style.backgroundSize =
            "cover";

        preview.style.backgroundPosition =
            "center";

    }

    else {

        preview.classList.add(
            "no-thumbnail"
        );

    }


    /* =========================================
       New Badge
    ========================================= */

    if (video.new) {

        const newBadge =
            document.createElement("span");


        newBadge.className =
            "video-badge new";


        newBadge.textContent =
            "🆕 جدید";


        preview.appendChild(
            newBadge
        );

    }


    /* =========================================
       Featured Badge
    ========================================= */

    if (video.featured) {

        const badge =
            document.createElement("span");


        badge.className =
            "video-badge featured";


        badge.textContent =
            "⭐ ویژه";


        preview.appendChild(
            badge
        );

    }


    /* =========================================
       Play
    ========================================= */

    const playButton =
        document.createElement("button");


    playButton.className =
        "video-play-button";


    playButton.innerHTML =
        "▶";


    playButton.setAttribute(
        "aria-label",
        "پخش ویدیو"
    );


    preview.appendChild(
        playButton
    );


    /* =========================================
       Content
    ========================================= */

    const content =
        document.createElement("div");


    content.className =
        "video-card-content";


    /* Category */

    if (video.category) {

        const category =
            document.createElement("div");


        category.className =
            "video-category";


        category.textContent =
            video.category;


        content.appendChild(
            category
        );

    }


    /* Title */

    const title =
        document.createElement("h3");


    title.className =
        "video-card-title";


    title.textContent =
        video.title ||
        "بدون عنوان";


    content.appendChild(
        title
    );


    /* Meta */

    const meta =
        document.createElement("div");


    meta.className =
        "video-meta";


    const views =
        document.createElement("span");


    views.className =
        "video-views";


    views.innerHTML =
        `👁️ ${formatNumber(
            video.views || 0
        )}`;


    const date =
        document.createElement("span");


    date.className =
        "video-date";


    date.innerHTML =
        `📅 ${formatDate(
            video.date
        )}`;


    meta.appendChild(
        views
    );


    meta.appendChild(
        date
    );


    content.appendChild(
        meta
    );


    /* =========================================
       Build
    ========================================= */

    card.appendChild(
        preview
    );


    card.appendChild(
        content
    );


    /* =========================================
       Open
    ========================================= */

    function openVideo() {

        if (!video.id) {

            console.error(
                "Video ID is missing:",
                video
            );

            return;
        }


        window.location.href =
            `video-player.html?id=${
                encodeURIComponent(
                    video.id
                )
            }`;

    }


    preview.addEventListener(
        "click",
        openVideo
    );


    playButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openVideo();

        }
    );


    return card;

}


/* =========================================================
   FEATURED
   ========================================================= */

function createFeaturedVideo() {

    const featured =
        allVideos.find(
            video =>
                video.featured === true
        );


    if (!featured)
        return;


    const container =
        document.querySelector(
            ".videos-container"
        );


    if (!container)
        return;


    const section =
        document.createElement("section");


    section.className =
        "featured-video-section";


    const title =
        document.createElement("div");


    title.className =
        "section-title";


    title.innerHTML = `

        <h2>⭐ ویدیوی ویژه</h2>

        <p>
            پیشنهاد ویژه Xland
        </p>

    `;


    section.appendChild(
        title
    );


    const card =
        createVideoCard(
            featured,
            featured.type
        );


    card.classList.add(
        "featured-video"
    );


    section.appendChild(
        card
    );


    container.prepend(
        section
    );

}


/* =========================================================
   NUMBER FORMAT
   ========================================================= */

function formatNumber(number) {

    return Number(
        number || 0
    ).toLocaleString(
        "fa-IR"
    );

}


/* =========================================================
   DATE
   ========================================================= */

function formatDate(date) {

    if (!date)
        return "بدون تاریخ";


    const parsed =
        new Date(date);


    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {

        return date;

    }


    return parsed.toLocaleDateString(
        "fa-IR"
    );

}


/* =========================================================
   EMPTY
   ========================================================= */

function showEmptyMessage(
    container,
    message
) {

    container.innerHTML = `

        <div class="empty-videos">

            ${message}

        </div>

    `;

}


/* =========================================================
   CARD ANIMATION
   ========================================================= */

function animateRenderedCards() {

    const cards =
        document.querySelectorAll(
            ".video-card"
        );


    cards.forEach(
        (card, index) => {

            card.style.animationDelay =
                `${index * 0.06}s`;

        }
    );

}