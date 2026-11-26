
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("newsSearch");
    const newsGrid = document.querySelector(".latest-news .news-grid");

    if (!newsGrid) {
        console.error("XLAND News: news-grid not found.");
        return;
    }

    const cards = Array.from(
        newsGrid.querySelectorAll(".article-card")
    );

    let activeCategory = "all";

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function filterNews() {

        const searchTerm = normalize(searchInput?.value);
        let visibleCount = 0;

        cards.forEach(card => {

            const title =
                card.querySelector("h3")?.textContent || "";

            const tag =
                card.querySelector(".article-tag")?.textContent || "";

            const description =
                card.querySelector(".article-content p")?.textContent || "";

            const date =
                card.querySelector(".article-info")?.textContent || "";

            const searchableText = normalize(
                `${title} ${tag} ${description} ${date}`
            );

            const matchesSearch =
                searchableText.includes(searchTerm);

            const matchesCategory =
                activeCategory === "all" ||
                normalize(tag).includes(activeCategory);

            const visible =
                matchesSearch && matchesCategory;

            card.hidden = !visible;

            if (visible) visibleCount++;
        });

        let emptyMessage =
            newsGrid.querySelector(".news-empty");

        if (visibleCount === 0) {

            if (!emptyMessage) {
                emptyMessage = document.createElement("div");
                emptyMessage.className = "news-empty";
                emptyMessage.textContent = "No news found.";
                newsGrid.appendChild(emptyMessage);
            }

        } else if (emptyMessage) {
            emptyMessage.remove();
        }
    }

    // Category buttons
    const categoryButtons = document.querySelectorAll(
        ".news-categories button"
    );

    categoryButtons.forEach(button => {

        button.addEventListener("click", () => {

            categoryButtons.forEach(btn => {
                btn.classList.remove("active");
                btn.setAttribute("aria-pressed", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");

            activeCategory = normalize(button.textContent);

            if (activeCategory === "all") {
                activeCategory = "all";
            }

            filterNews();
        });
    });

    // Search
    if (searchInput) {
        searchInput.addEventListener("input", filterNews);
    }

    // Initial state
    filterNews();

    console.log(
        `XLAND News: ${cards.length} articles loaded.`
    );

});
