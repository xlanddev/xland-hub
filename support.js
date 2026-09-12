/* =========================================================
   XLAND SUPPORT CENTER 5.1
   Ticket / FAQ / Search / Navigation
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const XLAND_SUPPORT_CONFIG = {

    version: "5.1",

    storageKey: "xland_support_tickets",

    api: {

        enabled: false,

        baseURL: "",

        createTicket: "/api/tickets",

        getTickets: "/api/tickets",

        updateTicket: "/api/tickets"

    }

};


/* =========================================================
   DOM
========================================================= */

const modal =
    document.getElementById("supportFormModal");

const supportForm =
    document.getElementById("supportForm");

const formTitle =
    document.getElementById("formTitle");

const supportSubject =
    document.getElementById("supportSubject");

const supportMessage =
    document.getElementById("supportMessage");

const supportSearch =
    document.getElementById("supportSearch");

const gameFields =
    document.getElementById("gameFields");

const bugFields =
    document.getElementById("bugFields");

const toast =
    document.getElementById("toast");


let currentSupportType = "contact";


/* =========================================================
   SUPPORT TITLES
========================================================= */

const SUPPORT_TYPES = {

    bug: {

        title: "گزارش باگ",

        prefix: "BUG",

        placeholder:
            "مراحل بازتولید باگ، خطا، نتیجه مورد انتظار و نتیجه فعلی را توضیح دهید."

    },

    suggestion: {

        title: "پیشنهاد قابلیت جدید",

        prefix: "FEAT",

        placeholder:
            "قابلیت یا ایده پیشنهادی خود را توضیح دهید."

    },

    game: {

        title: "پشتیبانی بازی",

        prefix: "GAME",

        placeholder:
            "مشکل بازی، زمان رخ دادن مشکل و جزئیات آن را توضیح دهید."

    },

    website: {

        title: "گزارش مشکل سایت",

        prefix: "WEB",

        placeholder:
            "آدرس صفحه و مشکل مشاهده‌شده را توضیح دهید."

    },

    account: {

        title: "پشتیبانی حساب کاربری",

        prefix: "ACC",

        placeholder:
            "مشکل مربوط به حساب کاربری خود را توضیح دهید."

    },

    contact: {

        title: "تماس با پشتیبانی",

        prefix: "SUP",

        placeholder:
            "پیام خود را برای تیم Xland بنویسید."

    }

};


/* =========================================================
   NAVIGATION
========================================================= */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".page-section");

    const navButtons =
        document.querySelectorAll(".nav-btn");


    sections.forEach(section => {

        section.classList.remove("active");

    });


    navButtons.forEach(button => {

        button.classList.remove("active");

    });


    const target =
        document.getElementById(sectionId);

    if (target) {

        target.classList.add("active");

    }


    const activeButton =
        document.querySelector(
            `.nav-btn[data-section="${sectionId}"]`
        );

    if (activeButton) {

        activeButton.classList.add("active");

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    if (sectionId === "tickets") {

        renderTickets();

    }

}


/* Navigation click */

document
    .querySelectorAll(".nav-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            showSection(
                button.dataset.section
            );

        });

    });


/* =========================================================
   OPEN SUPPORT FORM
========================================================= */

function openSupportForm(type) {

    currentSupportType =
        SUPPORT_TYPES[type]
            ? type
            : "contact";


    const config =
        SUPPORT_TYPES[currentSupportType];


    formTitle.textContent =
        config.title;


    supportSubject.value =
        config.title;


    supportMessage.placeholder =
        config.placeholder;


    /* Hide dynamic fields */

    gameFields.classList.remove("active");

    bugFields.classList.remove("active");


    /* Game */

    if (currentSupportType === "game") {

        gameFields.classList.add("active");

    }


    /* Bug */

    if (currentSupportType === "bug") {

        bugFields.classList.add("active");

    }


    modal.classList.add("active");

    document.body.style.overflow = "hidden";


    setTimeout(() => {

        document
            .getElementById("supportName")
            .focus();

    }, 150);

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeSupportForm() {

    modal.classList.remove("active");

    document.body.style.overflow = "";

}


document
    .getElementById("closeForm")
    .addEventListener(
        "click",
        closeSupportForm
    );


document
    .querySelector(".modal-backdrop")
    .addEventListener(
        "click",
        closeSupportForm
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {

            closeSupportForm();

        }

    }
);


/* =========================================================
   SMART SEARCH
========================================================= */

function normalizeText(text) {

    return String(text)

        .toLowerCase()

        .replace(/ي/g, "ی")

        .replace(/ك/g, "ک")

        .trim();

}


function performSearch() {

    const query =
        normalizeText(
            supportSearch.value
        );


    const cards =
        document.querySelectorAll(
            ".support-card"
        );


    let visible = 0;


    cards.forEach(card => {

        const searchable =
            normalizeText(
                card.dataset.search || ""
            );


        const title =
            normalizeText(
                card.querySelector("h3")
                    ?.textContent || ""
            );


        const description =
            normalizeText(
                card.querySelector("p")
                    ?.textContent || ""
            );


        const text =
            `${searchable} ${title} ${description}`;


        const matches =
            query === "" ||
            text.includes(query);


        if (matches) {

            card.classList.remove(
                "search-hidden"
            );

            visible++;

        } else {

            card.classList.add(
                "search-hidden"
            );

        }

    });


    const status =
        document.getElementById(
            "searchStatus"
        );


    if (query === "") {

        status.textContent = "";

        return;

    }


    if (visible === 0) {

        status.textContent =
            "❌ نتیجه‌ای برای جستجوی شما پیدا نشد.";

    } else {

        status.textContent =
            `🔎 ${visible} نتیجه پیدا شد.`;

    }

}


supportSearch.addEventListener(
    "input",
    performSearch
);


/* =========================================================
   CTRL + K
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            showSection("support");

            supportSearch.focus();

        }

    }
);


/* =========================================================
   FAQ ACCORDION
========================================================= */

document
    .querySelectorAll(".faq-question")
    .forEach(question => {

        question.addEventListener(
            "click",
            () => {

                const item =
                    question.parentElement;

                const answer =
                    item.querySelector(
                        ".faq-answer"
                    );


                const isActive =
                    item.classList.contains(
                        "active"
                    );


                /* Close all */

                document
                    .querySelectorAll(".faq-item")
                    .forEach(other => {

                        other.classList.remove(
                            "active"
                        );

                        const otherAnswer =
                            other.querySelector(
                                ".faq-answer"
                            );

                        if (otherAnswer) {

                            otherAnswer.style.maxHeight =
                                null;

                        }

                    });


                /* Open selected */

                if (!isActive) {

                    item.classList.add(
                        "active"
                    );

                    answer.style.maxHeight =
                        answer.scrollHeight + "px";

                }

            }
        );

    });


/* =========================================================
   LOCAL STORAGE
========================================================= */

function getTickets() {

    try {

        const raw =
            localStorage.getItem(
                XLAND_SUPPORT_CONFIG.storageKey
            );


        if (!raw) {

            return [];

        }


        const parsed =
            JSON.parse(raw);


        return Array.isArray(parsed)
            ? parsed
            : [];

    }

    catch (error) {

        console.error(
            "Xland Ticket Storage Error:",
            error
        );

        return [];

    }

}


function saveTickets(tickets) {

    localStorage.setItem(

        XLAND_SUPPORT_CONFIG.storageKey,

        JSON.stringify(tickets)

    );

}


/* =========================================================
   TICKET ID
========================================================= */

function generateTicketId(type) {

    const prefix =
        SUPPORT_TYPES[type]?.prefix ||
        "SUP";


    const timestamp =
        Date.now()
            .toString(36)
            .toUpperCase();


    const random =
        Math.random()
            .toString(36)
            .substring(2, 7)
            .toUpperCase();


    return `XL-${prefix}-${timestamp}-${random}`;

}


/* =========================================================
   DATE
========================================================= */

function formatDate(date) {

    try {

        return new Intl.DateTimeFormat(
            "fa-IR",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        ).format(
            new Date(date)
        );

    }

    catch {

        return new Date(date)
            .toLocaleString();

    }

}


/* =========================================================
   CREATE TICKET OBJECT
========================================================= */

function buildTicket() {

    const name =
        document
            .getElementById("supportName")
            .value
            .trim();


    const email =
        document
            .getElementById("supportEmail")
            .value
            .trim();


    const subject =
        supportSubject
            .value
            .trim();


    const message =
        supportMessage
            .value
            .trim();


    const ticket = {

        id:
            generateTicketId(
                currentSupportType
            ),

        type:
            currentSupportType,

        status:
            "Open",

        name,

        email,

        subject,

        message,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString(),

        game:
            currentSupportType === "game"
                ? {
                    name:
                        document
                            .getElementById("gameName")
                            .value,

                    version:
                        document
                            .getElementById("gameVersion")
                            .value
                }
                : null,

        bug:
            currentSupportType === "bug"
                ? {
                    priority:
                        document
                            .getElementById("bugPriority")
                            .value,

                    platform:
                        document
                            .getElementById("platform")
                            .value
                }
                : null,

        backend:

            XLAND_SUPPORT_CONFIG
                .api
                .enabled
                ? "api"
                : "localStorage"

    };


    return ticket;

}


/* =========================================================
   API READY LAYER
========================================================= */

async function sendTicketToBackend(ticket) {

    const config =
        XLAND_SUPPORT_CONFIG.api;


    if (!config.enabled) {

        return {

            success: false,

            mode: "localStorage",

            message:
                "Backend is currently disabled."

        };

    }


    const response =
        await fetch(

            config.baseURL +
            config.createTicket,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(ticket)

            }

        );


    if (!response.ok) {

        throw new Error(
            `API Error: ${response.status}`
        );

    }


    return await response.json();

}


/* =========================================================
   FORM SUBMIT
========================================================= */

supportForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const submitButton =
            supportForm.querySelector(
                ".submit-support"
            );


        submitButton.disabled = true;

        submitButton.textContent =
            "⏳ در حال ایجاد Ticket...";


        try {

            const ticket =
                buildTicket();


            /* =====================================
               LOCAL STORAGE
            ====================================== */

            const tickets =
                getTickets();


            tickets.unshift(ticket);


            saveTickets(tickets);


            /* =====================================
               FUTURE BACKEND
            ====================================== */

            if (
                XLAND_SUPPORT_CONFIG
                    .api
                    .enabled
            ) {

                try {

                    await sendTicketToBackend(
                        ticket
                    );

                }

                catch (apiError) {

                    console.warn(
                        "Xland API unavailable:",
                        apiError
                    );

                }

            }


            /* =====================================
               SUCCESS
            ====================================== */

            closeSupportForm();


            supportForm.reset();


            gameFields.classList.remove(
                "active"
            );


            bugFields.classList.remove(
                "active"
            );


            showToast(
                `✅ Ticket با موفقیت ایجاد شد — ${ticket.id}`
            );


            showSection("tickets");


            renderTickets();

        }

        catch (error) {

            console.error(
                "Ticket creation error:",
                error
            );


            showToast(
                "❌ ایجاد Ticket با خطا مواجه شد."
            );

        }

        finally {

            submitButton.disabled = false;

            submitButton.textContent =
                "🚀 ایجاد Ticket";

        }

    }
);


/* =========================================================
   RENDER TICKETS
========================================================= */

function renderTickets() {

    const tickets =
        getTickets();


    const list =
        document.getElementById(
            "ticketsList"
        );


    const empty =
        document.getElementById(
            "emptyTickets"
        );


    /* Stats */

    const open =
        tickets.filter(
            ticket =>
                ticket.status === "Open"
        ).length;


    const pending =
        tickets.filter(
            ticket =>
                ticket.status === "Pending"
        ).length;


    const solved =
        tickets.filter(
            ticket =>
                ticket.status === "Solved"
        ).length;


    document.getElementById(
        "openCount"
    ).textContent = open;


    document.getElementById(
        "pendingCount"
    ).textContent = pending;


    document.getElementById(
        "solvedCount"
    ).textContent = solved;


    document.getElementById(
        "totalCount"
    ).textContent =
        tickets.length;


    if (tickets.length === 0) {

        list.innerHTML = "";

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";


    list.innerHTML =
        tickets
            .map(renderTicketCard)
            .join("");

}


/* =========================================================
   TICKET CARD
========================================================= */

function renderTicketCard(ticket) {

    const statusClass = {

        Open:
            "status-open",

        Pending:
            "status-pending",

        Solved:
            "status-solved"

    }[ticket.status] ||
        "status-open";


    const statusIcon = {

        Open: "📂",

        Pending: "⏳",

        Solved: "✅"

    }[ticket.status] ||
        "📂";


    const typeName =
        SUPPORT_TYPES[
            ticket.type
        ]?.title ||
        "Support";


    let extraTags = "";


    if (
        ticket.type === "game" &&
        ticket.game
    ) {

        extraTags += `
            <span class="ticket-tag">
                🎮 ${escapeHTML(ticket.game.name || "Unknown")}
            </span>

            <span class="ticket-tag">
                Version:
                ${escapeHTML(ticket.game.version || "Unknown")}
            </span>
        `;

    }


    if (
        ticket.type === "bug" &&
        ticket.bug
    ) {

        extraTags += `
            <span class="ticket-tag">
                Priority:
                ${escapeHTML(ticket.bug.priority || "Normal")}
            </span>

            <span class="ticket-tag">
                💻 ${escapeHTML(ticket.bug.platform || "Unknown")}
            </span>
        `;

    }


    return `

        <article class="ticket-card">

            <div class="ticket-top">

                <div>

                    <div class="ticket-id">
                        ${escapeHTML(ticket.id)}
                    </div>

                    <h3 class="ticket-subject">
                        ${escapeHTML(ticket.subject)}
                    </h3>

                    <div class="ticket-date">
                        ${formatDate(ticket.createdAt)}
                    </div>

                </div>


                <span class="status ${statusClass}">

                    ${statusIcon}

                    ${escapeHTML(ticket.status)}

                </span>

            </div>


            <div class="ticket-message">

                ${escapeHTML(ticket.message)}

            </div>


            <div class="ticket-meta">

                <span class="ticket-tag">
                    ${escapeHTML(typeName)}
                </span>

                <span class="ticket-tag">
                    👤 ${escapeHTML(ticket.name)}
                </span>

                ${extraTags}

            </div>

        </article>

    `;

}


/* =========================================================
   HTML SECURITY
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

    clearTimeout(toastTimer);


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 4500);

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderTickets();

    }
);


/* =========================================================
   DEBUG / FUTURE API
========================================================= */

window.XlandSupport = {

    version:
        XLAND_SUPPORT_CONFIG.version,

    getTickets,

    saveTickets,

    createTicket:
        buildTicket,

    renderTickets,

    openSupportForm,

    showSection

};