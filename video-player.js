/* =========================================================
   XLAND SUPPORT 4.1
   VIDEO PLAYER SYSTEM
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initVideoPlayer
);


/* =========================================================
   GLOBAL
   ========================================================= */

let currentVideo = null;
let allVideos = [];

let likeState = false;


/* =========================================================
   INIT
   ========================================================= */

async function initVideoPlayer() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const videoId =
        params.get("id");


    if (!videoId) {

        showError(
            "شناسه ویدیو پیدا نشد."
        );

        return;
    }


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


        allVideos = [
            ...(data.longVideos || []),
            ...(data.shortVideos || [])
        ];


        currentVideo =
            allVideos.find(
                item =>
                    String(item.id) ===
                    String(videoId)
            );


        if (!currentVideo) {

            showError(
                "ویدیو پیدا نشد."
            );

            return;
        }


        setupVideo(currentVideo);

        setupPlayerEffects(
            currentVideo
        );

        setupBadges(
            currentVideo
        );

        setupLikes(
            currentVideo
        );

        setupComments(
            currentVideo
        );

        setupShare(
            currentVideo
        );

        setupCommentButton();

        setupRelatedVideos(
            currentVideo
        );

        increaseViews(
            currentVideo
        );


    } catch (error) {

        console.error(
            "XLAND VIDEO PLAYER ERROR:",
            error
        );


        showError(
            "خطا در بارگذاری اطلاعات ویدیو."
        );
    }
}


/* =========================================================
   VIDEO SETUP
   ========================================================= */

function setupVideo(video) {

    const player =
        document.getElementById(
            "main-video"
        );


    const title =
        document.getElementById(
            "video-title"
        );


    const wrapper =
        document.getElementById(
            "video-wrapper"
        );


    if (!player) {

        return;
    }


    /*
     * Video source
     */

    player.src =
        video.video;


    player.load();


    /*
     * Thumbnail
     */

    if (video.thumbnail) {

        player.poster =
            video.thumbnail;
    }


    /*
     * Title
     */

    if (title) {

        title.textContent =
            video.title ||
            "بدون عنوان";
    }


    /*
     * Browser title
     */

    document.title =
        `${video.title || "ویدیو"} | Xland Support`;


    /*
     * Short detection
     */

    if (
        wrapper &&
        video.type === "short"
    ) {

        wrapper.classList.add(
            "short-video"
        );

    } else if (wrapper) {

        wrapper.classList.remove(
            "short-video"
        );
    }


    /*
     * Metadata
     */

    updateViewsDisplay(
        video
    );


    updateDateDisplay(
        video
    );


    createCategoryElement(
        video
    );


    /*
     * Loading events
     */

    player.addEventListener(
        "loadedmetadata",
        () => {

            console.log(
                "🎬 Video loaded successfully:",
                video.video
            );

            addPlayerReadyEffect();
        }
    );


    player.addEventListener(
        "error",
        () => {

            console.error(
                "❌ Video could not be loaded:",
                video.video,
                player.error
            );

            showPlayerError();
        }
    );
}


/* =========================================================
   PLAYER EFFECTS
   ========================================================= */

function setupPlayerEffects(video) {

    const wrapper =
        document.getElementById(
            "video-wrapper"
        );


    const player =
        document.getElementById(
            "main-video"
        );


    if (!wrapper || !player) {

        return;
    }


    /*
     * Glow
     */

    wrapper.classList.add(
        "xland-player-ready"
    );


    /*
     * Mouse movement
     */

    wrapper.addEventListener(
        "mousemove",
        event => {

            const rect =
                wrapper.getBoundingClientRect();


            const x =
                ((event.clientX - rect.left) /
                    rect.width) *
                100;


            const y =
                ((event.clientY - rect.top) /
                    rect.height) *
                100;


            wrapper.style.setProperty(
                "--mouse-x",
                `${x}%`
            );


            wrapper.style.setProperty(
                "--mouse-y",
                `${y}%`
            );


            wrapper.classList.add(
                "player-hover"
            );
        }
    );


    wrapper.addEventListener(
        "mouseleave",
        () => {

            wrapper.classList.remove(
                "player-hover"
            );
        }
    );


    /*
     * Play / Pause
     */

    player.addEventListener(
        "play",
        () => {

            wrapper.classList.add(
                "is-playing"
            );
        }
    );


    player.addEventListener(
        "pause",
        () => {

            wrapper.classList.remove(
                "is-playing"
            );
        }
    );
}


/* =========================================================
   PLAYER READY EFFECT
   ========================================================= */

function addPlayerReadyEffect() {

    const wrapper =
        document.getElementById(
            "video-wrapper"
        );


    if (!wrapper) {

        return;
    }


    wrapper.classList.add(
        "player-loaded"
    );
}


/* =========================================================
   VIEWS
   ========================================================= */

function getViews(video) {

    return Number(
        localStorage.getItem(
            `xland_views_${video.id}`
        )
    ) || Number(video.views) || 0;
}


function increaseViews(video) {

    const key =
        `xland_viewed_${video.id}`;


    if (
        !sessionStorage.getItem(
            key
        )
    ) {

        const views =
            getViews(video) + 1;


        localStorage.setItem(
            `xland_views_${video.id}`,
            views
        );


        sessionStorage.setItem(
            key,
            "true"
        );
    }


    updateViewsDisplay(
        video
    );
}


function updateViewsDisplay(video) {

    const element =
        document.getElementById(
            "video-views"
        );


    if (!element) {

        return;
    }


    const views =
        getViews(video);


    element.textContent =
        `👁 ${views.toLocaleString("fa-IR")} بازدید`;
}


/* =========================================================
   DATE
   ========================================================= */

function updateDateDisplay(video) {

    const element =
        document.getElementById(
            "video-date"
        );


    if (!element) {

        return;
    }


    if (!video.date) {

        element.textContent =
            "📅 تاریخ انتشار ثبت نشده";

        return;
    }


    let formattedDate =
        video.date;


    const parsed =
        new Date(video.date);


    if (
        !Number.isNaN(
            parsed.getTime()
        )
    ) {

        formattedDate =
            parsed.toLocaleDateString(
                "fa-IR",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );
    }


    element.textContent =
        `📅 ${formattedDate}`;
}


/* =========================================================
   CATEGORY
   ========================================================= */

function createCategoryElement(video) {

    const information =
        document.querySelector(
            ".video-information"
        );


    if (!information) {

        return;
    }


    let category =
        document.getElementById(
            "video-category"
        );


    if (!category) {

        category =
            document.createElement(
                "span"
            );


        category.id =
            "video-category";


        category.className =
            "player-category";


        const meta =
            document.querySelector(
                ".video-meta"
            );


        if (meta) {

            meta.appendChild(
                category
            );

        } else {

            information.appendChild(
                category
            );
        }
    }


    const value =
        video.category ||
        (
            video.type === "short"
                ? "Shorts"
                : "Xland"
        );


    category.textContent =
        `🏷️ ${value}`;
}


/* =========================================================
   BADGES
   ========================================================= */

function setupBadges(video) {

    const wrapper =
        document.getElementById(
            "video-wrapper"
        );


    if (!wrapper) {

        return;
    }


    let container =
        document.getElementById(
            "player-badges"
        );


    if (!container) {

        container =
            document.createElement(
                "div"
            );


        container.id =
            "player-badges";


        container.className =
            "player-badges";


        wrapper.appendChild(
            container
        );
    }


    container.innerHTML = "";


    /*
     * Featured
     */

    if (video.featured === true) {

        createBadge(
            container,
            "⭐ ویژه",
            "featured-badge"
        );
    }


    /*
     * New
     */

    if (
        video.new === true ||
        isNewVideo(video)
    ) {

        createBadge(
            container,
            "🆕 جدید",
            "new-badge"
        );
    }


    /*
     * Short
     */

    if (video.type === "short") {

        createBadge(
            container,
            "📱 SHORT",
            "short-badge"
        );
    }
}


function createBadge(
    container,
    text,
    className
) {

    const badge =
        document.createElement(
            "span"
        );


    badge.className =
        `player-badge ${className}`;


    badge.textContent =
        text;


    container.appendChild(
        badge
    );
}


/* =========================================================
   NEW VIDEO DETECTOR
   ========================================================= */

function isNewVideo(video) {

    if (!video.date) {

        return false;
    }


    const date =
        new Date(video.date);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return false;
    }


    const difference =
        Date.now() -
        date.getTime();


    const sevenDays =
        7 *
        24 *
        60 *
        60 *
        1000;


    return (
        difference >= 0 &&
        difference <= sevenDays
    );
}


/* =========================================================
   LIKE
   ========================================================= */

function getLikes(video) {

    return Number(
        localStorage.getItem(
            `xland_likes_${video.id}`
        )
    ) || Number(video.likes) || 0;
}


function setupLikes(video) {

    const button =
        document.getElementById(
            "like-button"
        );


    const count =
        document.getElementById(
            "like-count"
        );


    if (!button || !count) {

        return;
    }


    const likedKey =
        `xland_liked_${video.id}`;


    let likes =
        getLikes(video);


    count.textContent =
        likes.toLocaleString(
            "fa-IR"
        );


    /*
     * Previous state
     */

    if (
        localStorage.getItem(
            likedKey
        )
    ) {

        likeState = true;

        button.classList.add(
            "liked"
        );
    }


    button.addEventListener(
        "click",
        () => {

            if (
                localStorage.getItem(
                    likedKey
                )
            ) {

                localStorage.removeItem(
                    likedKey
                );


                likes =
                    Math.max(
                        0,
                        likes - 1
                    );


                likeState = false;


                button.classList.remove(
                    "liked"
                );

            } else {

                localStorage.setItem(
                    likedKey,
                    "true"
                );


                likes++;

                likeState = true;


                button.classList.add(
                    "liked"
                );
            }


            localStorage.setItem(
                `xland_likes_${video.id}`,
                likes
            );


            count.textContent =
                likes.toLocaleString(
                    "fa-IR"
                );


            /*
             * Like animation
             */

            button.classList.remove(
                "like-pop"
            );


            void button.offsetWidth;


            button.classList.add(
                "like-pop"
            );


            setTimeout(
                () => {

                    button.classList.remove(
                        "like-pop"
                    );

                },
                450
            );
        }
    );
}


/* =========================================================
   COMMENTS
   ========================================================= */

function getComments(video) {

    try {

        return JSON.parse(
            localStorage.getItem(
                `xland_comments_${video.id}`
            )
        ) || [];

    } catch {

        return [];
    }
}


function saveComments(
    video,
    comments
) {

    localStorage.setItem(
        `xland_comments_${video.id}`,
        JSON.stringify(
            comments
        )
    );
}


function setupComments(video) {

    const input =
        document.getElementById(
            "comment-input"
        );


    const submit =
        document.getElementById(
            "submit-comment"
        );


    if (!input || !submit) {

        return;
    }


    /*
     * Max length
     */

    input.maxLength =
        1000;


    /*
     * Character counter
     */

    createCommentCounter(
        input
    );


    submit.addEventListener(
        "click",
        () => {

            const text =
                input.value.trim();


            if (!text) {

                showToast(
                    "✍️ اول نظر خود را بنویس داش 😎"
                );


                input.focus();

                return;
            }


            const comments =
                getComments(video);


            comments.unshift({

                text: text,

                date:
                    new Date()
                        .toLocaleString(
                            "fa-IR"
                        )
            });


            saveComments(
                video,
                comments
            );


            input.value = "";


            renderComments(
                video
            );


            showToast(
                "💬 نظر شما ثبت شد!"
            );
        }
    );


    /*
     * Ctrl + Enter
     */

    input.addEventListener(
        "keydown",
        event => {

            if (
                event.ctrlKey &&
                event.key === "Enter"
            ) {

                submit.click();
            }
        }
    );


    renderComments(
        video
    );
}


/* =========================================================
   COMMENT COUNTER
   ========================================================= */

function createCommentCounter(input) {

    let counter =
        document.getElementById(
            "comment-counter"
        );


    if (!counter) {

        counter =
            document.createElement(
                "div"
            );


        counter.id =
            "comment-counter";


        counter.className =
            "comment-counter";


        input.parentElement.appendChild(
            counter
        );
    }


    function update() {

        counter.textContent =
            `${input.value.length.toLocaleString("fa-IR")} / ۱۰۰۰`;
    }


    input.addEventListener(
        "input",
        update
    );


    update();
}


/* =========================================================
   RENDER COMMENTS
   ========================================================= */

function renderComments(video) {

    const container =
        document.getElementById(
            "comments-list"
        );


    if (!container) {

        return;
    }


    const comments =
        getComments(video);


    const commentCount =
        document.getElementById(
            "comment-count"
        );


    const commentsNumber =
        document.getElementById(
            "comments-number"
        );


    if (commentCount) {

        commentCount.textContent =
            comments.length.toLocaleString(
                "fa-IR"
            );
    }


    if (commentsNumber) {

        commentsNumber.textContent =
            `${comments.length.toLocaleString(
                "fa-IR"
            )} نظر`;
    }


    container.innerHTML =
        "";


    if (!comments.length) {

        container.innerHTML = `
            <div class="no-comments">
                💬 هنوز نظری ثبت نشده است.
                <br>
                اولین نفری باش که نظر میده 😎
            </div>
        `;

        return;
    }


    comments.forEach(
        (comment, index) => {

            const element =
                document.createElement(
                    "article"
                );


            element.className =
                "comment";


            element.style.animationDelay =
                `${index * 70}ms`;


            element.innerHTML = `

                <div class="comment-header">

                    <span class="comment-user">
                        👤 کاربر Xland
                    </span>

                    <span class="comment-date">
                        ${escapeHTML(
                            comment.date || "-"
                        )}
                    </span>

                </div>

                <div class="comment-text">
                    ${escapeHTML(
                        comment.text
                    )}
                </div>

            `;


            container.appendChild(
                element
            );
        }
    );
}


/* =========================================================
   SHARE
   ========================================================= */

function setupShare(video) {

    const button =
        document.getElementById(
            "share-button"
        );


    if (!button) {

        return;
    }


    button.addEventListener(
        "click",
        async () => {

            const url =
                window.location.href;


            /*
             * Native Share
             */

            if (
                navigator.share
            ) {

                try {

                    await navigator.share({

                        title:
                            video.title ||
                            "Xland Video",

                        text:
                            "🎬 این ویدیو را در Xland Support ببین!",

                        url: url
                    });


                    showToast(
                        "🔗 ویدیو به اشتراک گذاشته شد!"
                    );


                    return;

                } catch (error) {

                    if (
                        error.name ===
                        "AbortError"
                    ) {

                        return;
                    }
                }
            }


            /*
             * Clipboard
             */

            try {

                await navigator.clipboard.writeText(
                    url
                );


                showToast(
                    "🔗 لینک ویدیو کپی شد!"
                );

            } catch {

                showToast(
                    "لینک ویدیو را از نوار مرورگر کپی کن."
                );
            }
        }
    );
}


/* =========================================================
   COMMENT BUTTON
   ========================================================= */

function setupCommentButton() {

    const button =
        document.getElementById(
            "comment-button"
        );


    if (!button) {

        return;
    }


    button.addEventListener(
        "click",
        () => {

            const section =
                document.querySelector(
                    ".comments-section"
                );


            const input =
                document.getElementById(
                    "comment-input"
                );


            if (section) {

                section.scrollIntoView({

                    behavior: "smooth",

                    block: "start"
                });
            }


            setTimeout(
                () => {

                    if (input) {

                        input.focus();
                    }

                },
                500
            );
        }
    );
}


/* =========================================================
   RELATED VIDEOS
   ========================================================= */

function setupRelatedVideos(
    current
) {

    let section =
        document.getElementById(
            "related-videos-section"
        );


    /*
     * اگر HTML هنوز بخش Related ندارد،
     * خودمان می‌سازیم.
     */

    if (!section) {

        section =
            document.createElement(
                "section"
            );


        section.id =
            "related-videos-section";


        section.className =
            "related-videos-section";


        section.innerHTML = `

            <div class="related-title">
                <h2>🔥 ویدیوهای مرتبط</h2>
                <p>
                    شاید این ویدیوها هم برات جالب باشن
                </p>
            </div>

            <div
                id="related-videos"
                class="related-videos-grid">
            </div>

        `;


        const main =
            document.querySelector(
                ".player-container"
            );


        if (main) {

            main.appendChild(
                section
            );
        }
    }


    const container =
        document.getElementById(
            "related-videos"
        );


    if (!container) {

        return;
    }


    const related =
        allVideos
            .filter(
                video =>
                    video.id !==
                    current.id
            )
            .slice(0, 6);


    if (!related.length) {

        section.style.display =
            "none";

        return;
    }


    container.innerHTML =
        "";


    related.forEach(
        (video, index) => {

            const card =
                createRelatedCard(
                    video
                );


            card.style.animationDelay =
                `${index * 80}ms`;


            container.appendChild(
                card
            );
        }
    );
}


/* =========================================================
   RELATED CARD
   ========================================================= */

function createRelatedCard(
    video
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "related-video-card";


    const thumbnail =
        document.createElement(
            "div"
        );


    thumbnail.className =
        "related-thumbnail";


    if (video.thumbnail) {

        thumbnail.style.backgroundImage =
            `url("${video.thumbnail}")`;
    }


    const play =
        document.createElement(
            "span"
        );


    play.className =
        "related-play";


    play.textContent =
        "▶";


    thumbnail.appendChild(
        play
    );


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "related-content";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        video.title ||
        "بدون عنوان";


    const meta =
        document.createElement(
            "span"
        );


    meta.textContent =
        `👁 ${(
            Number(
                localStorage.getItem(
                    `xland_views_${video.id}`
                )
            ) ||
            Number(video.views) ||
            0
        ).toLocaleString("fa-IR")}`;


    content.appendChild(
        title
    );


    content.appendChild(
        meta
    );


    card.appendChild(
        thumbnail
    );


    card.appendChild(
        content
    );


    card.addEventListener(
        "click",
        () => {

            if (!video.id) {

                return;
            }


            window.location.href =
                `video-player.html?id=${encodeURIComponent(
                    video.id
                )}`;
        }
    );


    return card;
}


/* =========================================================
   SECURITY
   ========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;
}


/* =========================================================
   ERROR
   ========================================================= */

function showError(message) {

    const container =
        document.querySelector(
            ".player-container"
        );


    if (!container) {

        return;
    }


    container.innerHTML = `

        <div class="video-error">

            ❌ ${escapeHTML(message)}

            <br><br>

            <a href="videos.html">
                ← بازگشت به ویدیوها
            </a>

        </div>

    `;
}


/* =========================================================
   PLAYER ERROR
   ========================================================= */

function showPlayerError() {

    const wrapper =
        document.getElementById(
            "video-wrapper"
        );


    if (!wrapper) {

        return;
    }


    const oldError =
        wrapper.querySelector(
            ".player-error-message"
        );


    if (oldError) {

        return;
    }


    const error =
        document.createElement(
            "div"
        );


    error.className =
        "player-error-message";


    error.innerHTML = `
        ❌
        <span>
            خطا در بارگذاری ویدیو
        </span>
    `;


    wrapper.appendChild(
        error
    );
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        return;
    }


    toast.textContent =
        message;


    toast.classList.remove(
        "show"
    );


    void toast.offsetWidth;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.xlandToastTimer
    );


    window.xlandToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );
}