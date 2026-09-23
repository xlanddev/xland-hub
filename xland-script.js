// ================================
// Xland Script
// Version : 3.2
// ================================


// =================================
// DOM ELEMENTS
// =================================

const scriptList =
    document.getElementById("scriptList");

const codeViewer =
    document.getElementById("codeViewer");

const searchInput =
    document.getElementById("search");

const copyBtn =
    document.getElementById("copyBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const favoriteBtn =
    document.getElementById("favoriteBtn");

const shareBtn =
    document.getElementById("shareBtn");

const scriptLanguage =
    document.getElementById("scriptLanguage");

const scriptFile =
    document.getElementById("scriptFile");

const scriptSize =
    document.getElementById("scriptSize");

const scriptLines =
    document.getElementById("scriptLines");

const signInBtn =
    document.getElementById("signInBtn");

const profileMenu =
    document.getElementById("profileMenu");

const profileUsername =
    document.getElementById("profileUsername");

const selectedFileName =
    document.getElementById("selectedFileName");

const selectedFileType =
    document.getElementById("selectedFileType");

const fileIcon =
    document.getElementById("fileIcon");

const languageLabel =
    document.getElementById("languageLabel");

const scriptCount =
    document.getElementById("scriptCount");

const browseScriptsBtn =
    document.getElementById("browseScriptsBtn");


// =================================
// MODALS
// =================================

const downloadModal =
    document.getElementById("downloadModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const confirmDownloadBtn =
    document.getElementById("confirmDownloadBtn");

const logoutModal =
    document.getElementById("logoutModal");

const yesLogout =
    document.getElementById("yesLogout");

const noLogout =
    document.getElementById("noLogout");


// =================================
// PROFILE BUTTONS
// =================================

const aboutBtn =
    document.getElementById("aboutBtn");

const changePasswordBtn =
    document.getElementById("changePasswordBtn");

const logoutBtn =
    document.getElementById("logoutBtn");


// =================================
// DATA
// =================================

let selectedScript = null;

let allScripts = [];


// =================================
// SAFE TEXT LIMIT
// =================================

function safeLimitText(text, maxLength = 500000) {

    if (
        typeof limitText === "function"
    ) {

        return limitText(
            text,
            maxLength
        );

    }


    if (
        text.length <= maxLength
    ) {

        return text;

    }


    return (
        text.slice(0, maxLength) +
        "\n\n// ... code truncated ..."
    );

}


// =================================
// FILE ICON
// =================================

function getFileIcon(file) {

    if (!file) {
        return "&lt;/&gt;";
    }


    const ext =
        file
            .split(".")
            .pop()
            .toLowerCase();


    switch (ext) {

        case "py":
            return "PY";

        case "js":
            return "JS";

        case "ts":
            return "TS";

        case "cs":
            return "C#";

        case "cpp":
            return "C++";

        case "c":
            return "C";

        case "html":
            return "HTML";

        case "css":
            return "CSS";

        case "json":
            return "{}";

        case "java":
            return "JAVA";

        default:
            return "&lt;/&gt;";

    }

}


// =================================
// FILE LANGUAGE
// =================================

function getLanguage(file) {

    if (!file) {
        return "-";
    }


    const ext =
        file
            .split(".")
            .pop()
            .toLowerCase();


    const languages = {

        py: "Python",
        js: "JavaScript",
        ts: "TypeScript",
        cs: "C#",
        cpp: "C++",
        c: "C",
        html: "HTML",
        css: "CSS",
        json: "JSON",
        java: "Java"

    };


    return languages[ext] || ext.toUpperCase();

}


// =================================
// RENDER SCRIPTS
// =================================

function renderScripts(filter = "") {

    scriptList.innerHTML = "";


    const query =
        filter
            .trim()
            .toLowerCase();


    const filtered =
        allScripts.filter(script => {

            const name =
                String(
                    script.name || ""
                ).toLowerCase();

            const file =
                String(
                    script.file || ""
                ).toLowerCase();

            return (
                name.includes(query) ||
                file.includes(query)
            );

        });


    if (scriptCount) {

        scriptCount.textContent =
            filtered.length;

    }


    if (filtered.length === 0) {

        const empty =
            document.createElement("li");

        empty.textContent =
            "🔎 No scripts found.";

        empty.style.cursor =
            "default";

        scriptList.appendChild(empty);

        return;

    }


    filtered.forEach(script => {

        const li =
            document.createElement("li");


        const icon =
            document.createElement("span");

        icon.className =
            "script-item-icon";

        icon.textContent =
            getFileIcon(script.file);


        const name =
            document.createElement("span");

        name.textContent =
            script.name || script.file;


        li.appendChild(icon);
        li.appendChild(name);


        if (
            selectedScript &&
            selectedScript.file === script.file
        ) {

            li.classList.add("active");

        }


        li.addEventListener(
            "click",
            () => {

                openScript(script);

            }
        );


        scriptList.appendChild(li);

    });

}


// =================================
// LOAD SCRIPTS
// =================================

async function loadScripts() {

    try {

        const response =
            await fetch("scripts.json");


        if (!response.ok) {

            throw new Error(
                "Cannot load scripts.json"
            );

        }


        const scripts =
            await response.json();


        if (!Array.isArray(scripts)) {

            throw new Error(
                "Invalid scripts.json format"
            );

        }


        allScripts =
            scripts;


        renderScripts();


    }

    catch (error) {

        console.error(error);


        scriptList.innerHTML = "";


        const errorItem =
            document.createElement("li");

        errorItem.textContent =
            "❌ Cannot load scripts.";

        errorItem.style.cursor =
            "default";

        scriptList.appendChild(
            errorItem
        );

    }

}


// =================================
// OPEN SCRIPT
// =================================

async function openScript(script) {

    if (!script || !script.file) {

        alert("Invalid script.");

        return;

    }


    selectedScript =
        script;


    // -----------------------------
    // Basic Information
    // -----------------------------

    const language =
        getLanguage(
            script.file
        );


    const icon =
        getFileIcon(
            script.file
        );


    scriptFile.textContent =
        script.file;


    scriptLanguage.textContent =
        language;


    languageLabel.textContent =
        language.toUpperCase();


    fileIcon.innerHTML =
        icon;


    selectedFileName.textContent =
        script.name ||
        script.file;


    selectedFileType.textContent =
        language +
        " • Xland Script";


    scriptSize.textContent =
        "Loading...";


    scriptLines.textContent =
        "Loading...";


    codeViewer.textContent =
        "Loading script...";


    codeViewer.classList.remove(
        "code-loading"
    );


    // -----------------------------
    // Load File
    // -----------------------------

    try {

        const response =
            await fetch(
                script.file
            );


        if (!response.ok) {

            throw new Error(
                "Cannot open script."
            );

        }


        const responseClone =
            response.clone();


        const code =
            await response.text();


        const blob =
            await responseClone.blob();


        // -------------------------
        // Size
        // -------------------------

        const sizeKB =
            blob.size / 1024;


        if (sizeKB < 1) {

            scriptSize.textContent =
                blob.size + " B";

        }

        else if (sizeKB < 1024) {

            scriptSize.textContent =
                Math.round(sizeKB) +
                " KB";

        }

        else {

            scriptSize.textContent =
                (
                    sizeKB / 1024
                ).toFixed(2) +
                " MB";

        }


        // -------------------------
        // Lines
        // -------------------------

        const lines =
            code.split("\n").length;


        scriptLines.textContent =
            lines.toLocaleString();


        // -------------------------
        // Code Animation
        // -------------------------

        codeViewer.classList.remove(
            "code-loading"
        );


        setTimeout(() => {

            codeViewer.textContent =
                safeLimitText(
                    code,
                    500000
                );


            codeViewer.classList.add(
                "code-loading"
            );

        }, 40);


        updateFavoriteButton();

        renderScripts(
            searchInput.value
        );

    }

    catch (error) {

        console.error(error);


        codeViewer.textContent =
            "❌ Cannot open script.";

        scriptSize.textContent =
            "-";

        scriptLines.textContent =
            "-";

    }

}


// =================================
// COPY SCRIPT
// =================================

copyBtn.addEventListener(
    "click",
    async () => {

        if (!selectedScript) {

            alert(
                "Please select a script first."
            );

            return;

        }


        const text =
            codeViewer.textContent;


        try {

            await navigator.clipboard.writeText(
                text
            );

        }

        catch {

            const textarea =
                document.createElement(
                    "textarea"
                );


            textarea.value =
                text;


            document.body.appendChild(
                textarea
            );


            textarea.select();

            document.execCommand(
                "copy"
            );

            textarea.remove();

        }


        copyBtn.textContent =
            "✅ Copied!";


        setTimeout(() => {

            copyBtn.textContent =
                "📋 Copy";

        }, 1500);

    }
);


// =================================
// DOWNLOAD
// =================================

downloadBtn.addEventListener(
    "click",
    () => {

        if (
            !selectedScript ||
            !selectedScript.file
        ) {

            alert(
                "Please select a script first."
            );

            return;

        }


        downloadModal.style.display =
            "flex";

    }
);


cancelBtn.addEventListener(
    "click",
    () => {

        downloadModal.style.display =
            "none";

    }
);


confirmDownloadBtn.addEventListener(
    "click",
    () => {

        if (
            !selectedScript ||
            !selectedScript.file
        ) {

            downloadModal.style.display =
                "none";

            return;

        }


        window.location.href =
            "download.html?file=" +
            encodeURIComponent(
                selectedScript.file
            );

    }
);


// =================================
// FAVORITES
// =================================

function getFavorites() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "xlandScriptFavorites"
            )
        ) || [];

    }

    catch {

        return [];

    }

}


function saveFavorites(favorites) {

    localStorage.setItem(
        "xlandScriptFavorites",
        JSON.stringify(
            favorites
        )
    );

}


function updateFavoriteButton() {

    if (!selectedScript) {

        favoriteBtn.textContent =
            "⭐ Favorite";

        return;

    }


    const favorites =
        getFavorites();


    const exists =
        favorites.includes(
            selectedScript.file
        );


    favoriteBtn.textContent =
        exists
            ? "⭐ Favorited"
            : "⭐ Favorite";

}


favoriteBtn.addEventListener(
    "click",
    () => {

        if (!selectedScript) {

            alert(
                "Select a script first."
            );

            return;

        }


        let favorites =
            getFavorites();


        const index =
            favorites.indexOf(
                selectedScript.file
            );


        if (index === -1) {

            favorites.push(
                selectedScript.file
            );

        }

        else {

            favorites.splice(
                index,
                1
            );

        }


        saveFavorites(
            favorites
        );


        updateFavoriteButton();

    }
);


// =================================
// SHARE
// =================================

shareBtn.addEventListener(
    "click",
    async () => {

        if (!selectedScript) {

            alert(
                "Select a script first."
            );

            return;

        }


        const shareData = {

            title:
                selectedScript.name ||
                "Xland Script",

            text:
                "Check out this Xland Script",

            url:
                window.location.href

        };


        try {

            if (
                navigator.share
            ) {

                await navigator.share(
                    shareData
                );

                shareBtn.textContent =
                    "✅ Shared";

            }

            else {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                shareBtn.textContent =
                    "✅ Link Copied";

            }

        }

        catch (error) {

            if (
                error.name !==
                "AbortError"
            ) {

                try {

                    await navigator.clipboard.writeText(
                        window.location.href
                    );

                    shareBtn.textContent =
                        "✅ Link Copied";

                }

                catch {

                    alert(
                        "Unable to share this script."
                    );

                }

            }

        }


        setTimeout(() => {

            shareBtn.textContent =
                "🔗 Share";

        }, 1600);

    }
);


// =================================
// SEARCH
// =================================

searchInput.addEventListener(
    "input",
    () => {

        renderScripts(
            searchInput.value
        );

    }
);


// =================================
// BROWSE BUTTON
// =================================

browseScriptsBtn.addEventListener(
    "click",
    () => {

        document
            .getElementById(
                "scriptExplorer"
            )
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// =================================
// PROFILE / SIGN IN
// =================================

if (signInBtn) {

    let account = null;


    try {

        account =
            JSON.parse(
                localStorage.getItem(
                    "xlandAccount"
                )
            );

    }

    catch {

        account = null;

    }


    if (account) {

        const username =
            account.username ||
            "Account";


        signInBtn.textContent =
            "👤 " + username;


        profileUsername.textContent =
            username;


        signInBtn.onclick =
            () => {

                profileMenu.style.display =
                    profileMenu.style.display ===
                    "block"
                        ? "none"
                        : "block";

            };

    }

    else {

        signInBtn.onclick =
            () => {

                window.location.href =
                    "signin.html";

            };

    }

}


// =================================
// CLICK OUTSIDE PROFILE
// =================================

document.addEventListener(
    "click",
    (event) => {

        if (
            profileMenu &&
            signInBtn &&
            !profileMenu.contains(
                event.target
            ) &&
            !signInBtn.contains(
                event.target
            )
        ) {

            profileMenu.style.display =
                "none";

        }

    }
);


// =================================
// ABOUT
// =================================

aboutBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "about.html";

    }
);


// =================================
// CHANGE PASSWORD
// =================================

changePasswordBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "change-password.html";

    }
);


// =================================
// LOGOUT
// =================================

logoutBtn.addEventListener(
    "click",
    () => {

        profileMenu.style.display =
            "none";

        logoutModal.style.display =
            "flex";

    }
);


noLogout.addEventListener(
    "click",
    () => {

        logoutModal.style.display =
            "none";

    }
);


yesLogout.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "xlandAccount"
        );


        window.location.href =
            "xland-script.html";

    }
);


// =================================
// CLOSE MODALS BY BACKDROP
// =================================

downloadModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            downloadModal
        ) {

            downloadModal.style.display =
                "none";

        }

    }
);


logoutModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            logoutModal
        ) {

            logoutModal.style.display =
                "none";

        }

    }
);


// =================================
// ESCAPE KEY
// =================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Escape"
        ) {

            profileMenu.style.display =
                "none";

            downloadModal.style.display =
                "none";

            logoutModal.style.display =
                "none";

        }

    }
);


// =================================
// START
// =================================

loadScripts();