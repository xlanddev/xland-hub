/* =========================================================
   ASK XLAND — FAQ / visitor question assistant
   This version answers from a local knowledge base.
   It does NOT search for pages or pretend to be a live AI.
========================================================= */
(() => {
    "use strict";

    const form = document.getElementById("askXlandForm");
    const input = document.getElementById("askXlandInput");
    const results = document.getElementById("askXlandResults");
    const empty = document.getElementById("askXlandEmpty");
    const promptButtons = document.querySelectorAll(".ask-xland-prompt[data-ask-query]");

    if (!form || !input || !results || !empty) return;

    const normalize = (value) => String(value || "")
        .toLowerCase()
        .replace(/[يى]/g, "ی")
        .replace(/ك/g, "ک")
        .replace(/[\u064B-\u065F\u0670]/g, "")
        .replace(/[؟?!،,.؛:()[\]{}"'`]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    // Each intent contains questions this local assistant can answer reliably.
    const knowledge = [
        {
            id: "about",
            title: "XLAND چیست؟",
            keywords: ["xland چیست", "ایکس لند چیست", "درباره xland", "معرفی xland", "xland چیه", "xland یعنی چی", "what is xland"],
            answer: "XLAND یک اکوسیستم دیجیتال است که پروژه‌ها و سرویس‌های مختلفی را در کنار هم ارائه می‌کند؛ از بازی و ابزارهای نرم‌افزاری گرفته تا خدمات و ابزارهای توسعه‌دهندگان. XLAND HUB نقطه ورود به این مجموعه است."
        },
        {
            id: "projects",
            title: "چه پروژه‌هایی در XLAND وجود دارد؟",
            keywords: ["چه پروژه هایی", "پروژه های xland", "پروژه‌های xland", "سرویس های xland", "خدمات xland", "محصولات xland", "چه چیزهایی در xland"],
            answer: "در اکوسیستم XLAND چند نوع پروژه وجود دارد:\n• بازی‌هایی مثل Xland Game و Endless Road Horror 3D\n• پروژه جهان‌باز Wild Horizon\n• ابزارهایی مثل XLAND WiFi Manager\n• سرویس‌ها و ابزارهای توسعه مانند XLAND API و XLAND Script\nهمچنین می‌توانی بخش پروژه‌های صفحه اصلی XLAND HUB را برای معرفی آن‌ها ببینی."
        },
        {
            id: "games",
            title: "بازی‌های XLAND",
            keywords: ["بازی", "بازی ها", "بازی‌های", "گیم", "گیم ها", "گیمینگ", "game", "games", "بازی xland"],
            answer: "در XLAND HUB می‌توانی با پروژه‌های بازی XLAND آشنا شوی؛ از جمله Xland Game و بازی ترسناک سه‌بعدی Endless Road Horror 3D. پروژه Wild Horizon هم یک بازی جهان‌باز در حال توسعه است."
        },
        {
            id: "wild",
            title: "Wild Horizon چیست؟",
            keywords: ["wild horizon", "وایلد هورایزن", "بازی جهان باز", "جهان باز", "open world"],
            answer: "Wild Horizon پروژه بازی جهان‌باز XLAND است. این پروژه با هدف ساخت دنیایی قابل گشت‌وگذار توسعه داده می‌شود. برای مشاهده معرفی و اطلاعات موجود، صفحه اختصاصی Wild Horizon در XLAND HUB را ببین."
        },
        {
            id: "wifi",
            title: "XLAND WiFi Manager چیست؟",
            keywords: ["wifi manager", "wi fi manager", "وای فای منیجر", "وایفای منیجر", "مدیریت وای فای", "مدیریت وای‌فای", "کیفیت وای فای", "شبکه وای فای"],
            answer: "XLAND WiFi Manager ابزاری برای مدیریت و بررسی وضعیت اتصال وای‌فای و مشاهده اطلاعات و کیفیت شبکه است. صفحه اختصاصی آن در XLAND HUB اطلاعات بیشتری درباره این نرم‌افزار ارائه می‌کند."
        },
        {
            id: "developer",
            title: "ابزارهای توسعه‌دهندگان XLAND",
            keywords: ["توسعه دهنده", "توسعه‌دهنده", "برنامه نویسی", "برنامه‌نویسی", "کدنویسی", "ابزار برنامه نویسی", "developer", "ساخت نرم افزار"],
            answer: "XLAND برای موضوعات توسعه و برنامه‌نویسی بخش‌هایی مانند XLAND Script و XLAND API دارد. این بخش‌ها برای آشنایی با ابزارها و زیرساخت‌های توسعه در اکوسیستم XLAND در نظر گرفته شده‌اند."
        },
        {
            id: "api",
            title: "XLAND API چیست؟",
            keywords: ["xland api", "api چیست", "ای پی آی", "رابط برنامه نویسی", "رابط برنامه‌نویسی"],
            answer: "XLAND API بخشی از زیرساخت توسعه XLAND است که برای ارتباط و یکپارچه‌سازی پروژه‌ها و سرویس‌ها در نظر گرفته شده است. جزئیات و مستندات موجود را می‌توانی در صفحه XLAND API دنبال کنی."
        },
        {
            id: "script",
            title: "XLAND Script چیست؟",
            keywords: ["xland script", "اسکریپت xland", "زبان xland", "زبان برنامه نویسی xland"],
            answer: "XLAND Script یکی از پروژه‌های بخش توسعه‌دهندگان XLAND است. برای آشنایی با وضعیت و اطلاعات منتشرشده درباره آن، صفحه اختصاصی XLAND Script را ببین."
        },
        {
            id: "endless",
            title: "Endless Road Horror 3D چیست؟",
            keywords: ["endless road", "اندلس رود", "بازی ترسناک", "وحشت", "horror"],
            answer: "Endless Road Horror 3D یک بازی ترسناک سه‌بعدی با فضای جاده‌ای تاریک و اتفاقات غیرمنتظره است. صفحه بازی در XLAND HUB اطلاعات و معرفی بیشتری دارد."
        },
        {
            id: "downloads",
            title: "چطور فایل‌ها و نرم‌افزارهای XLAND را دانلود کنم؟",
            keywords: ["دانلود", "دانلودها", "نصب نرم افزار", "دریافت فایل", "فایل ها", "download"],
            answer: "برای فایل‌های منتشرشده، به بخش Downloads در XLAND HUB سر بزن. قبل از نصب هر فایل، توضیحات و شرایط ارائه‌شده در صفحه دانلود را بررسی کن."
        },
        {
            id: "support",
            title: "چطور با پشتیبانی XLAND ارتباط بگیرم؟",
            keywords: ["پشتیبانی", "ارتباط با xland", "تماس", "کمک", "مشکل دارم", "گزارش مشکل", "support", "contact"],
            answer: "اگر درباره یکی از پروژه‌ها یا سرویس‌های XLAND سؤال یا مشکلی داری، از صفحه Xland Support استفاده کن. بهتر است نام سرویس و توضیح کوتاهی از مشکلت را هم بنویسی تا راهنمایی دقیق‌تری دریافت کنی.",
            link: { label: "رفتن به پشتیبانی XLAND", href: "support.html" }
        },
        {
            id: "news",
            title: "از کجا اخبار و به‌روزرسانی‌های XLAND را دنبال کنم؟",
            keywords: ["اخبار", "خبر", "آپدیت", "به روز رسانی", "به‌روزرسانی", "تغییرات جدید", "news", "update"],
            answer: "برای دنبال کردن خبرها و اطلاعیه‌های XLAND می‌توانی بخش News سایت را بررسی کنی. خبرهای مربوط به توسعه‌دهندگان نیز در بخش Xland News قرار می‌گیرند."
        },
        {
            id: "account",
            title: "برای استفاده از XLAND باید حساب بسازم؟",
            keywords: ["ثبت نام", "ثبت‌نام", "حساب کاربری", "اکانت", "ورود", "لاگین", "login", "account"],
            answer: "برای پرسیدن سؤال از همین بخش ASK XLAND نیازی به ورود یا ساخت حساب نیست. شرایط استفاده از هر سرویس یا پروژه ممکن است متفاوت باشد؛ توضیحات همان سرویس را بررسی کن."
        }
    ];

    const stopWords = new Set([
        "از", "به", "در", "با", "برای", "را", "رو", "و", "یا", "که",
        "چی", "چیه", "چه", "چطور", "چگونه", "کجا", "می", "خواهم",
        "دارم", "درباره", "لطفا", "لطفاً", "من", "یک", "این", "آن"
    ]);

    function scoreIntent(query, item) {
        let score = 0;
        const words = query.split(" ").filter(word => word.length > 1 && !stopWords.has(word));

        for (const keyword of item.keywords) {
            const key = normalize(keyword);
            if (!key) continue;
            if (query === key) score += 14;
            else if (query.includes(key)) score += key.includes(" ") ? 10 : 5;
        }

        const title = normalize(item.title);
        if (query.includes(title)) score += 8;

        for (const word of words) {
            if (item.keywords.some(keyword => normalize(keyword).split(" ").includes(word))) {
                score += 2;
            }
        }
        return score;
    }

    function addText(parent, tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        element.textContent = text;
        parent.appendChild(element);
        return element;
    }

    function renderAnswer(item) {
        const card = document.createElement("article");
        card.className = "ask-xland-result-card ask-xland-answer-card";

        const top = document.createElement("div");
        top.className = "ask-xland-result-top";

        const icon = document.createElement("div");
        icon.className = "ask-xland-result-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "✦";

        const titleWrap = document.createElement("div");
        addText(titleWrap, "span", "ask-xland-result-label", "پاسخ ASK XLAND");
        addText(titleWrap, "h3", "", item.title);
        top.append(icon, titleWrap);
        card.appendChild(top);

        const answer = document.createElement("div");
        answer.className = "ask-xland-answer-text";

        item.answer.split("\n").forEach(line => {
            if (line.startsWith("• ")) {
                addText(answer, "p", "ask-xland-answer-bullet", line.slice(2));
            } else if (line.trim()) {
                addText(answer, "p", "", line);
            }
        });
        card.appendChild(answer);

        if (item.link) {
            const link = document.createElement("a");
            link.className = "ask-xland-result-link";
            link.href = item.link.href;
            link.textContent = item.link.label + " ←";
            card.appendChild(link);
        }

        results.replaceChildren(card);
        empty.hidden = true;
        results.hidden = false;
    }

    function renderUnknown() {
        const card = document.createElement("article");
        card.className = "ask-xland-result-card ask-xland-answer-card";
        const top = document.createElement("div");
        top.className = "ask-xland-result-top";

        const icon = document.createElement("div");
        icon.className = "ask-xland-result-icon";
        icon.textContent = "💬";

        const wrap = document.createElement("div");
        addText(wrap, "span", "ask-xland-result-label", "پاسخ ASK XLAND");
        addText(wrap, "h3", "", "برای این سؤال هنوز پاسخ دقیقی ندارم.");

        top.append(icon, wrap);
        card.appendChild(top);
        addText(card, "p", "ask-xland-answer-text", "متأسفم! اطلاعات کافی برای پاسخ مطمئن به این سؤال در پایگاه پاسخ‌های من ثبت نشده. می‌توانی سؤالت را ساده‌تر بنویسی یا از پشتیبانی XLAND کمک بگیری.");

        const link = document.createElement("a");
        link.className = "ask-xland-result-link";
        link.href = "support.html";
        link.textContent = "ارتباط با پشتیبانی XLAND ←";
        card.appendChild(link);

        results.replaceChildren(card);
        empty.hidden = true;
        results.hidden = false;
    }

    function answerQuestion(rawQuestion) {
        const query = normalize(rawQuestion);
        if (!query) {
            input.focus();
            return;
        }

        const ranked = knowledge
            .map(item => ({ item, score: scoreIntent(query, item) }))
            .sort((a, b) => b.score - a.score);

        // Conservative threshold: if no intent is clear, do not guess.
        if (!ranked.length || ranked[0].score < 4) {
            renderUnknown();
            return;
        }

        renderAnswer(ranked[0].item);
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        answerQuestion(input.value);
    });

    promptButtons.forEach(button => {
        button.addEventListener("click", () => {
            const question = button.getAttribute("data-ask-query") || "";
            input.value = question;
            answerQuestion(question);
        });
    });
})();
