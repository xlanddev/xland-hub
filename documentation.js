const buttons = document.querySelectorAll(".accordion-btn");

buttons.forEach(button => {

    button.addEventListener("click", () => {

        const content = button.nextElementSibling;

        if(content.style.display === "block"){

            content.style.display = "none";

            button.textContent =
            button.textContent.replace("▼","▶");

        }else{

            content.style.display = "block";

            button.textContent =
            button.textContent.replace("▶","▼");

        }

    });

});

// =========================
// Search Documentation
// =========================

const search = document.querySelector(".search");

search.addEventListener("input", () => {

    const value = search.value.toLowerCase();

    const buttons = document.querySelectorAll(".accordion-btn");

    buttons.forEach(button => {

        const content = button.nextElementSibling;

        const title = button.textContent.toLowerCase();

        const body = content.textContent.toLowerCase();

        if(title.includes(value) || body.includes(value)){

            button.style.display = "block";

        }else{

            button.style.display = "none";

            content.style.display = "none";

        }

    });

});