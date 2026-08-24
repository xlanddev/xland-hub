const headers = document.querySelectorAll(".rule-header");

headers.forEach(header => {

    header.addEventListener("click", () => {

        const content = header.nextElementSibling;

        const arrow = header.querySelector(".arrow");

        if (content.style.display === "block") {

            content.style.display = "none";

            arrow.textContent = "▼";

        } else {

            content.style.display = "block";

            arrow.textContent = "▲";

        }

    });

});