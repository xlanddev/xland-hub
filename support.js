/* =========================================================
   XLAND SUPPORT CENTER 5.3
   Ticket / FAQ / Search / Navigation
   Local Ticket System
========================================================= */

/* =========================================================
   CONFIG
========================================================= */

const XLAND_SUPPORT_CONFIG = {
    version: "5.3",

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

const modal = document.getElementById("supportFormModal");
const supportForm = document.getElementById("supportForm");
const formTitle = document.getElementById("formTitle");
const supportSubject = document.getElementById("supportSubject");
const supportMessage = document.getElementById("supportMessage");
const supportSearch = document.getElementById("supportSearch");
const gameFields = document.getElementById("gameFields");
const bugFields = document.getElementById("bugFields");
const toast = document.getElementById("toast");

let currentSupportType = "contact";
let toastTimer = null;

/* =========================================================
   SUPPORT TYPES
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
    const sections = document.querySelectorAll(".page-section");
    const navButtons = document.querySelectorAll(".nav-btn");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    const target = document.getElementById(sectionId);

    if (!target) {
        console.error(
            "Xland Support: Section not found:",
            sectionId
        );
        return;
    }

    target.classList.add("active");

    const activeButton = document.querySelector(
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

/* =========================================================
   NAV BUTTONS
========================================================= */

document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", event => {
        event.preventDefault();

        showSection(button.dataset.section);
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

    if (!modal || !supportForm) {
        console.error(
            "Xland Support: Support form elements not found."
        );
        return;
    }

    formTitle.textContent = config.title;

    supportSubject.value = config.title;

    supportMessage.placeholder =
        config.placeholder;

    if (gameFields) {
        gameFields.classList.remove("active");
    }

    if (bugFields) {
        bugFields.classList.remove("active");
    }

    if (
        currentSupportType === "game" &&
        gameFields
    ) {
        gameFields.classList.add("active");
    }

    if (
        currentSupportType === "bug" &&
        bugFields
    ) {
        bugFields.classList.add("active");
    }

    modal.classList.add("active");

    document.body.style.overflow = "hidden";

    setTimeout(() => {
        const nameInput =
            document.getElementById("supportName");

        if (nameInput) {
            nameInput.focus();
        }
    }, 150);
}

/* =========================================================
   CLOSE MODAL
========================================================= */

function closeSupportForm() {
    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    document.body.style.overflow = "";
}

/* =========================================================
   CLOSE BUTTON
========================================================= */

const closeFormButton =
    document.getElementById("closeForm");

if (closeFormButton) {
    closeFormButton.addEventListener(
        "click",
        event => {
            event.preventDefault();
            closeSupportForm();
        }
    );
}

/* =========================================================
   MODAL BACKDROP
========================================================= */

const modalBackdrop =
    document.querySelector(".modal-backdrop");

if (modalBackdrop) {
    modalBackdrop.addEventListener(
        "click",
        event => {
            event.preventDefault();
            closeSupportForm();
        }
    );
}

/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Escape" &&
            modal &&
            modal.classList.contains("active")
        ) {
            closeSupportForm();
        }
    }
);

/* =========================================================
   NORMALIZE TEXT
========================================================= */

function normalizeText(text) {
    return String(text)
        .toLowerCase()
        .replace(/ي/g, "ی")
        .replace(/ك/g, "ک")
        .trim();
}

/* =========================================================
   SEARCH
========================================================= */

function performSearch() {
    if (!supportSearch) {
        return;
    }

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

    if (!status) {
        return;
    }

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

if (supportSearch) {
    supportSearch.addEventListener(
        "input",
        performSearch
    );
}

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

            if (supportSearch) {
                supportSearch.focus();
            }
        }
    }
);

/* =========================================================
   FAQ
========================================================= */

document
    .querySelectorAll(".faq-question")
    .forEach(question => {
        question.addEventListener(
            "click",
            event => {
                event.preventDefault();

                const item =
                    question.parentElement;

                if (!item) {
                    return;
                }

                const answer =
                    item.querySelector(
                        ".faq-answer"
                    );

                if (!answer) {
                    return;
                }

                const isActive =
                    item.classList.contains(
                        "active"
                    );

                document
                    .querySelectorAll(
                        ".faq-item"
                    )
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

                if (!isActive) {
                    item.classList.add(
                        "active"
                    );

                    answer.style.maxHeight =
                        answer.scrollHeight +
                        "px";
                }
            }
        );
    });

/* =========================================================
   GET TICKETS
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

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed;
    } catch (error) {
        console.error(
            "Xland Ticket Storage Error:",
            error
        );

        return [];
    }
}

/* =========================================================
   SAVE TICKETS
========================================================= */

function saveTickets(tickets) {
    try {
        localStorage.setItem(
            XLAND_SUPPORT_CONFIG.storageKey,
            JSON.stringify(tickets)
        );

        return true;
    } catch (error) {
        console.error(
            "Xland Ticket Save Error:",
            error
        );

        showToast(
            "❌ ذخیره Ticket امکان‌پذیر نیست."
        );

        return false;
    }
}

/* =========================================================
   GENERATE TICKET ID
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
   FORMAT DATE
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
    } catch {
        return new Date(date)
            .toLocaleString();
    }
}

/* =========================================================
   BUILD TICKET
========================================================= */

function buildTicket() {
    const nameInput =
        document.getElementById(
            "supportName"
        );

    const emailInput =
        document.getElementById(
            "supportEmail"
        );

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    const email =
        emailInput
            ? emailInput.value.trim()
            : "";

    const subject =
        supportSubject
            ? supportSubject.value.trim()
            : "";

    const message =
        supportMessage
            ? supportMessage.value.trim()
            : "";

    const now =
        new Date().toISOString();

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
            now,

        updatedAt:
            now,

        game:
            currentSupportType === "game"
                ? {
                    name:
                        document
                            .getElementById(
                                "gameName"
                            )
                            ?.value
                            .trim() || "",

                    version:
                        document
                            .getElementById(
                                "gameVersion"
                            )
                            ?.value
                            .trim() || ""
                }
                : null,

        bug:
            currentSupportType === "bug"
                ? {
                    priority:
                        document
                            .getElementById(
                                "bugPriority"
                            )
                            ?.value || "Normal",

                    platform:
                        document
                            .getElementById(
                                "platform"
                            )
                            ?.value
                            .trim() || ""
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
   BACKEND READY LAYER
========================================================= */

async function sendTicketToBackend(ticket) {
    const config =
        XLAND_SUPPORT_CONFIG.api;

    if (!config.enabled) {
        return {
            success: false,
            mode: "localStorage",
            message:
                "Backend is disabled."
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
   CREATE TICKET
========================================================= */

async function createTicket() {
    const ticket =
        buildTicket();

    /* Validate */

    if (!ticket.name) {
        throw new Error(
            "Name is required."
        );
    }

    if (!ticket.email) {
        throw new Error(
            "Email is required."
        );
    }

    if (!ticket.subject) {
        throw new Error(
            "Subject is required."
        );
    }

    if (!ticket.message) {
        throw new Error(
            "Message is required."
        );
    }

    /* Get current tickets */

    const tickets =
        getTickets();

    /* Add newest ticket */

    tickets.unshift(ticket);

    /* Save locally */

    const saved =
        saveTickets(tickets);

    if (!saved) {
        throw new Error(
            "Ticket could not be saved."
        );
    }

    /* Optional backend */

    if (
        XLAND_SUPPORT_CONFIG
            .api
            .enabled
    ) {
        try {
            await sendTicketToBackend(
                ticket
            );
        } catch (apiError) {
            console.warn(
                "Xland API unavailable:",
                apiError
            );
        }
    }

    return ticket;
}

/* =========================================================
   FORM SUBMIT
========================================================= */

if (supportForm) {
    supportForm.addEventListener(
        "submit",
        async event => {

            /*
             * بسیار مهم:
             * جلوگیری از Submit پیش‌فرض مرورگر
             * و جلوگیری از Navigation
             */

            event.preventDefault();
            event.stopPropagation();

            const submitButton =
                supportForm.querySelector(
                    ".submit-support"
                );

            if (submitButton) {
                submitButton.disabled = true;

                submitButton.textContent =
                    "⏳ در حال ایجاد Ticket...";
            }

            try {
                /*
                 * Create Ticket
                 */

                const ticket =
                    await createTicket();

                /*
                 * Close Modal
                 */

                closeSupportForm();

                /*
                 * Reset Form
                 */

                supportForm.reset();

                if (gameFields) {
                    gameFields.classList.remove(
                        "active"
                    );
                }

                if (bugFields) {
                    bugFields.classList.remove(
                        "active"
                    );
                }

                /*
                 * Success
                 */

                showToast(
                    `✅ Ticket ساخته شد — ${ticket.id}`
                );

                /*
                 * Open Ticket Center
                 * بدون redirect
                 */

                showSection("tickets");

                /*
                 * Render
                 */

                renderTickets();

            } catch (error) {
                console.error(
                    "Xland Ticket Creation Error:",
                    error
                );

                showToast(
                    "❌ ایجاد Ticket با خطا مواجه شد."
                );

            } finally {
                if (submitButton) {
                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "🚀 ایجاد Ticket";
                }
            }
        },
        true
    );
}

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

    if (!list || !empty) {
        return;
    }

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

    const openCount =
        document.getElementById(
            "openCount"
        );

    const pendingCount =
        document.getElementById(
            "pendingCount"
        );

    const solvedCount =
        document.getElementById(
            "solvedCount"
        );

    const totalCount =
        document.getElementById(
            "totalCount"
        );

    if (openCount) {
        openCount.textContent =
            open;
    }

    if (pendingCount) {
        pendingCount.textContent =
            pending;
    }

    if (solvedCount) {
        solvedCount.textContent =
            solved;
    }

    if (totalCount) {
        totalCount.textContent =
            tickets.length;
    }

    /* Empty state */

    if (tickets.length === 0) {
        list.innerHTML = "";

        empty.style.display =
            "block";

        return;
    }

    empty.style.display =
        "none";

    /* Render */

    list.innerHTML =
        tickets
            .map(ticket =>
                renderTicketCard(ticket)
            )
            .join("");
}

/* =========================================================
   TICKET CARD
========================================================= */

function renderTicketCard(ticket) {
    const statusClass = {
        Open: "status-open",
        Pending: "status-pending",
        Solved: "status-solved"
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

    /* Game */

    if (
        ticket.type === "game" &&
        ticket.game
    ) {
        extraTags += `
            <span class="ticket-tag">
                🎮
                ${escapeHTML(
                    ticket.game.name ||
                    "Unknown"
                )}
            </span>

            <span class="ticket-tag">
                Version:
                ${escapeHTML(
                    ticket.game.version ||
                    "Unknown"
                )}
            </span>
        `;
    }

    /* Bug */

    if (
        ticket.type === "bug" &&
        ticket.bug
    ) {
        extraTags += `
            <span class="ticket-tag">
                Priority:
                ${escapeHTML(
                    ticket.bug.priority ||
                    "Normal"
                )}
            </span>

            <span class="ticket-tag">
                💻
                ${escapeHTML(
                    ticket.bug.platform ||
                    "Unknown"
                )}
            </span>
        `;
    }

    return `
        <article class="ticket-card">

            <div class="ticket-top">

                <div>

                    <div class="ticket-id">
                        ${escapeHTML(
                            ticket.id
                        )}
                    </div>

                    <h3 class="ticket-subject">
                        ${escapeHTML(
                            ticket.subject
                        )}
                    </h3>

                    <div class="ticket-date">
                        ${formatDate(
                            ticket.createdAt
                        )}
                    </div>

                </div>

                <span
                    class="status ${statusClass}"
                >
                    ${statusIcon}
                    ${escapeHTML(
                        ticket.status
                    )}
                </span>

            </div>

            <div class="ticket-message">
                ${escapeHTML(
                    ticket.message
                )}
            </div>

            <div class="ticket-meta">

                <span class="ticket-tag">
                    ${escapeHTML(
                        typeName
                    )}
                </span>

                <span class="ticket-tag">
                    👤
                    ${escapeHTML(
                        ticket.name
                    )}
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

function showToast(message) {
    if (!toast) {
        return;
    }

    clearTimeout(
        toastTimer
    );

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    toastTimer =
        setTimeout(
            () => {
                toast.classList.remove(
                    "show"
                );
            },
            4500
        );
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
   PUBLIC API
========================================================= */

window.XlandSupport = {
    version:
        XLAND_SUPPORT_CONFIG.version,

    getTickets,

    saveTickets,

    createTicket,

    buildTicket,

    renderTickets,

    openSupportForm,

    showSection,

    showToast
};