// =========================================
// XLAND SUPPORT 4.2
// SUPPORT CENTER
// =========================================


// =========================================
// OPEN SUPPORT FORM
// =========================================

function openSupportForm(type) {

    const section =
        document.getElementById("supportFormSection");

    const title =
        document.getElementById("formTitle");

    const subject =
        document.getElementById("supportSubject");


    const titles = {

        bug:
            "گزارش باگ",

        suggestion:
            "ارسال پیشنهاد",

        game:
            "پشتیبانی بازی",

        website:
            "گزارش مشکل سایت",

        account:
            "پشتیبانی حساب کاربری",

        contact:
            "تماس با پشتیبانی"

    };


    title.textContent =
        titles[type] || "درخواست پشتیبانی";


    subject.value =
        titles[type] || "";


    section.classList.add("active");


    section.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// =========================================
// CLOSE FORM
// =========================================

document
    .getElementById("closeForm")
    .addEventListener("click", () => {

        document
            .getElementById("supportFormSection")
            .classList.remove("active");

    });


// =========================================
// SEARCH SUPPORT
// =========================================

const search =
    document.getElementById("supportSearch");


search.addEventListener("input", () => {

    const value =
        search.value
            .toLowerCase()
            .trim();


    const cards =
        document.querySelectorAll(".support-card");


    cards.forEach(card => {

        const text =
            card.dataset.search
                .toLowerCase();


        if (
            value === "" ||
            text.includes(value)
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

});


// =========================================
// FORM SUBMIT
// =========================================

document
    .getElementById("supportForm")
    .addEventListener("submit", (event) => {

        event.preventDefault();


        const result =
            document.getElementById("supportResult");


        result.textContent =
            "✅ درخواست شما آماده ارسال است. سیستم Ticket در مرحله بعد به Xland API متصل خواهد شد.";


        result.classList.add("success");


        event.target.reset();

    });