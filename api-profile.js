// ===============================
// XLAND API Profile System
// ===============================

const accountBtn = document.getElementById("accountBtn");
const profileMenu = document.getElementById("profileMenu");
const logoutBtn = document.getElementById("logoutBtn");

const account = JSON.parse(localStorage.getItem("xlandApiAccount"));
const logged = localStorage.getItem("xlandApiLoggedIn");

// ---------- نمایش دکمه ----------

if(accountBtn){

    if(logged === "true" && account){

        accountBtn.innerHTML = "👤 " + account.username + " ▼";

    }else{

        accountBtn.innerHTML = "👤 Sign In";

    }

}

// ---------- کلیک روی دکمه ----------

if(accountBtn){

    accountBtn.addEventListener("click",()=>{

        if(logged === "true"){

            profileMenu.classList.toggle("show");

        }else{

            window.location.href="api-signin.html";

        }

    });

}

const logoutModal = document.getElementById("logoutModal");
const yesLogout = document.getElementById("yesLogout");
const noLogout = document.getElementById("noLogout");

if(logoutBtn){

    logoutBtn.addEventListener("click",()=>{

        logoutModal.classList.add("show");

    });

}

if(noLogout){

    noLogout.addEventListener("click",()=>{

        logoutModal.classList.remove("show");

    });

}

if(yesLogout){

    yesLogout.addEventListener("click",()=>{

        logoutModal.classList.remove("show");

        localStorage.removeItem("xlandApiLoggedIn");

        window.location.reload();

    });

}