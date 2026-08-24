const banner = document.getElementById("statusBanner");

fetch("status.json")

.then(res=>res.json())

.then(data=>{

    if(!data.enabled){

        return;

    }

    // ---------------------
    // آیا این نسخه قبلاً بسته شده؟
    // ---------------------

    const closedVersion =
    localStorage.getItem("xland-status-version");

    if(closedVersion == data.version){

        return;

    }

    document.getElementById("statusTitle").textContent =
    data.title;

    document.getElementById("statusMessage").textContent =
    data.message;

    document.getElementById("statusUpdated").textContent =
    "Updated: " + data.updated;

    document.getElementById("statusButton").textContent =
    data.button;

    document.getElementById("statusButton").href =
    data.link;

    const icons={

        success:"🟢",

        warning:"🟡",

        error:"🔴",

        info:"🔵"

    };

    document.getElementById("statusIcon").textContent=
    icons[data.status] || "ℹ️";

    banner.classList.add("status-"+data.status);

    banner.style.display="flex";



    // ---------------------
    // Close Button
    // ---------------------

    document.getElementById("closeStatus").onclick=()=>{

        localStorage.setItem(

            "xland-status-version",

            data.version

        );

        banner.style.display="none";

    };

});