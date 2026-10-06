/* =========================================================
        💬 XLAND COMMUNITY COMMENTS 3.0
        Modern Comment System
========================================================= */


/* =========================================================
        STORAGE
========================================================= */

const XLAND_COMMENTS_KEY =
    "xland_community_comments_v2";


/* =========================================================
        DEFAULT COMMENTS
========================================================= */

const defaultXlandComments = [

    {
        id: 1,

        name: "Xland Team",

        role: "Official",

        avatar: "✦",

        text:
            "به بخش Community Comments خوش آمدید! 🚀",

        timestamp:
            Date.now() -
            (2 * 24 * 60 * 60 * 1000),

        pinned:
            true,

        reactions: {

            "👍": 5,

            "🔥": 8,

            "❤️": 3

        }

    },


    {
        id: 2,

        name: "Xlander",

        role: "Member",

        avatar: "👤",

        text:
            "Xland Hub خیلی خفن‌تر شده 🔥",

        timestamp:
            Date.now() -
            (5 * 24 * 60 * 60 * 1000),

        pinned:
            false,

        reactions: {

            "👍": 12,

            "🔥": 6,

            "😂": 2

        }

    }

];


/* =========================================================
        LOAD COMMENTS
========================================================= */

function loadXlandComments() {

    const saved =
        localStorage.getItem(
            XLAND_COMMENTS_KEY
        );


    if (!saved) {

        localStorage.setItem(

            XLAND_COMMENTS_KEY,

            JSON.stringify(
                defaultXlandComments
            )

        );


        return defaultXlandComments;

    }


    try {

        return JSON.parse(saved);

    }

    catch (error) {

        console.error(
            "Xland Comments Error:",
            error
        );

        return defaultXlandComments;

    }

}


/* =========================================================
        SAVE COMMENTS
========================================================= */

function saveXlandComments(comments) {

    localStorage.setItem(

        XLAND_COMMENTS_KEY,

        JSON.stringify(comments)

    );

}


/* =========================================================
        TIME FORMAT
========================================================= */

function getXlandRelativeTime(timestamp) {

    const now =
        Date.now();


    const difference =
        now - timestamp;


    const seconds =
        Math.floor(
            difference / 1000
        );


    if (seconds < 10) {

        return "همین الان";

    }


    if (seconds < 60) {

        return `${seconds} ثانیه پیش`;

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (minutes < 60) {

        return `${minutes} دقیقه پیش`;

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return `${hours} ساعت پیش`;

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days < 7) {

        return `${days} روز پیش`;

    }


    const weeks =
        Math.floor(
            days / 7
        );


    if (weeks < 4) {

        return `${weeks} هفته پیش`;

    }


    const months =
        Math.floor(
            days / 30
        );


    if (months < 12) {

        return `${months} ماه پیش`;

    }


    const years =
        Math.floor(
            days / 365
        );


    return `${years} سال پیش`;

}


/* =========================================================
        EXACT DATE
========================================================= */

function getXlandExactDate(timestamp) {

    return new Date(timestamp)

        .toLocaleString(

            "fa-IR",

            {

                dateStyle:
                    "medium",

                timeStyle:
                    "short"

            }

        );

}


/* =========================================================
        ESCAPE HTML
========================================================= */

function escapeXlandHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
        RENDER COMMENTS
========================================================= */

function renderXlandComments() {

    const container =
        document.getElementById(
            "xlandCommentsList"
        );


    const count =
        document.getElementById(
            "xlandCommentsCount"
        );


    const search =
        document.getElementById(
            "xlandCommentsSearch"
        );


    if (!container) return;


    let comments =
        loadXlandComments();


    const searchText =
        search
            ? search.value.trim().toLowerCase()
            : "";


    if (searchText) {

        comments =
            comments.filter(
                comment =>

                    comment.text
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                    ||

                    comment.name
                        .toLowerCase()
                        .includes(
                            searchText
                        )

            );

    }


    comments.sort(
        (a, b) => {

            if (
                a.pinned &&
                !b.pinned
            ) {

                return -1;

            }


            if (
                !a.pinned &&
                b.pinned
            ) {

                return 1;

            }


            return (
                b.timestamp -
                a.timestamp
            );

        }
    );


    if (count) {

        count.textContent =
            comments.length;

    }


    if (!comments.length) {

        container.innerHTML = `

            <div class="xland-comments-empty">

                <div class="xland-comments-empty-icon">
                    🔎
                </div>

                <h3>
                    نظری پیدا نشد
                </h3>

                <p>
                    عبارت دیگری را امتحان کنید.
                </p>

            </div>

        `;


        return;

    }


    container.innerHTML =

        comments

            .map(comment => {

                const reactions =
                    comment.reactions || {};


                return `

                    <article
                        class="xland-comment-card ${

                            comment.pinned
                                ? "pinned"
                                : ""

                        }"
                    >

                        ${

                            comment.pinned

                            ?

                            `

                            <div
                                class="xland-pinned-label"
                            >

                                📌 PINNED COMMENT

                            </div>

                            `

                            :

                            ""

                        }


                        <div
                            class="xland-comment-user"
                        >

                            <div
                                class="xland-comment-avatar"
                            >

                                ${

                                    escapeXlandHTML(
                                        comment.avatar
                                    )

                                }

                            </div>


                            <div
                                class="xland-comment-user-info"
                            >

                                <div
                                    class="xland-comment-name"
                                >

                                    ${

                                        escapeXlandHTML(
                                            comment.name
                                        )

                                    }

                                </div>


                                <div
                                    class="xland-comment-role"
                                >

                                    ${

                                        escapeXlandHTML(
                                            comment.role
                                        )

                                    }

                                </div>

                            </div>

                        </div>


                        <p
                            class="xland-comment-content"
                        >

                            ${

                                escapeXlandHTML(
                                    comment.text
                                )

                            }

                        </p>


                        <div
                            class="xland-comment-meta"
                        >

                            <span
                                class="xland-comment-time"
                                title="${

                                    getXlandExactDate(
                                        comment.timestamp
                                    )

                                }"
                            >

                                🕒

                                ${

                                    getXlandRelativeTime(
                                        comment.timestamp
                                    )

                                }

                            </span>


                            <div
                                class="xland-comment-reactions"
                            >

                                ${

                                    Object
                                        .entries(
                                            reactions
                                        )

                                        .map(
                                            ([emoji, amount]) => `

                                                <button
                                                    class="xland-reaction"
                                                    type="button"
                                                    onclick="reactToXlandComment(${comment.id}, '${emoji}')"
                                                >

                                                    ${emoji}

                                                    ${amount}

                                                </button>

                                            `
                                        )

                                        .join("")

                                }

                            </div>

                        </div>

                    </article>

                `;

            })

            .join("");

}


/* =========================================================
        ADD COMMENT
========================================================= */

function addXlandComment() {

    const input =
        document.getElementById(
            "xlandCommentInput"
        );


    const submitButton =
        document.querySelector(
            ".xland-comment-submit"
        );


    if (!input) return;


    const text =
        input.value.trim();


    /* -----------------------------------------------------
            EMPTY COMMENT
    ----------------------------------------------------- */

    if (!text) {

        input.focus();

        input.style.borderColor =
            "rgba(248, 113, 113, 0.55)";


        setTimeout(() => {

            input.style.borderColor = "";

        }, 700);


        return;

    }


    /* -----------------------------------------------------
            CHARACTER LIMIT
    ----------------------------------------------------- */

    if (text.length > 500) {

        input.focus();

        return;

    }


    /* -----------------------------------------------------
            LOADING STATE
    ----------------------------------------------------- */

    if (submitButton) {

        submitButton.classList.add(
            "loading"
        );

        submitButton.disabled =
            true;

    }


    const comments =
        loadXlandComments();


    const newComment = {

        id:
            Date.now(),

        name:
            "Xlander",

        role:
            "Member",

        avatar:
            "👤",

        text:
            text,

        timestamp:
            Date.now(),

        pinned:
            false,

        reactions: {

            "👍": 0,

            "🔥": 0,

            "❤️": 0

        }

    };


    comments.unshift(
        newComment
    );


    saveXlandComments(
        comments
    );


    input.value = "";


    updateXlandCharacterCount();


    renderXlandComments();


    /* -----------------------------------------------------
            REMOVE LOADING
    ----------------------------------------------------- */

    setTimeout(() => {

        if (submitButton) {

            submitButton.classList.remove(
                "loading"
            );

            submitButton.disabled =
                false;

        }

    }, 300);

}


/* =========================================================
        REACTION
========================================================= */

function reactToXlandComment(
    commentId,
    emoji
) {

    const comments =
        loadXlandComments();


    const comment =
        comments.find(
            item =>
                item.id === commentId
        );


    if (!comment) return;


    if (!comment.reactions) {

        comment.reactions = {};

    }


    if (!comment.reactions[emoji]) {

        comment.reactions[emoji] =
            0;

    }


    comment.reactions[emoji]++;


    saveXlandComments(
        comments
    );


    renderXlandComments();

}


/* =========================================================
        CHARACTER COUNTER
========================================================= */

function updateXlandCharacterCount() {

    const input =
        document.getElementById(
            "xlandCommentInput"
        );


    const counter =
        document.getElementById(
            "xlandCommentCounter"
        );


    if (!input || !counter) return;


    const length =
        input.value.length;


    counter.textContent =
        `${length} / 500`;


    /* -----------------------------------------------------
            COUNTER COLOR
    ----------------------------------------------------- */

    if (length >= 450) {

        counter.style.color =
            "#fbbf24";

    }

    else if (length >= 500) {

        counter.style.color =
            "#f87171";

    }

    else {

        counter.style.color =
            "";

    }

}


/* =========================================================
        COMMENT INPUT LIMIT
========================================================= */

function setupXlandCommentInput() {

    const input =
        document.getElementById(
            "xlandCommentInput"
        );


    if (!input) return;


    input.setAttribute(
        "maxlength",
        "500"
    );


    input.addEventListener(
        "input",
        updateXlandCharacterCount
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                event.ctrlKey
            ) {

                event.preventDefault();

                addXlandComment();

            }

        }
    );

}


/* =========================================================
        SEARCH EVENT
========================================================= */

function setupXlandCommentSearch() {

    const search =
        document.getElementById(
            "xlandCommentsSearch"
        );


    if (!search) return;


    search.addEventListener(
        "input",
        renderXlandComments
    );

}


/* =========================================================
        INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupXlandCommentInput();

        setupXlandCommentSearch();

        updateXlandCharacterCount();

        renderXlandComments();

    }
);