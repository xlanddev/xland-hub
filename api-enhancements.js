// ==========================================
// XLAND API Enhancements v1.0
// ==========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // Safe Helper
    // ==========================================

    function get(id){
        return document.getElementById(id);
    }

    // ==========================================
    // API Metrics
    // ==========================================

    let requestCount = 0;
    let responseCount = 0;
    let startTime = Date.now();

    const requestElement = get("apiRequests");
    const responseElement = get("apiResponses");
    const uptimeElement = get("apiUptime");

    function updateMetrics(){

        if(requestElement){
            requestElement.textContent = requestCount;
        }

        if(responseElement){
            responseElement.textContent = responseCount;
        }

        if(uptimeElement){

            const seconds = Math.floor(
                (Date.now() - startTime) / 1000
            );

            const hours = Math.floor(seconds / 3600);

            const minutes = Math.floor(
                (seconds % 3600) / 60
            );

            const secs = seconds % 60;

            uptimeElement.textContent =
                `${hours}h ${minutes}m ${secs}s`;
        }
    }

    setInterval(updateMetrics, 1000);

    // ==========================================
    // Live API Status
    // ==========================================

    const statusElement = get("liveApiStatus");
    const statusText = get("liveStatusText");

    function setOnlineStatus(){

        if(statusElement){

            statusElement.classList.remove("offline");

            statusElement.classList.add("online");
        }

        if(statusText){

            statusText.textContent = "ONLINE";
        }
    }

    function setOfflineStatus(){

        if(statusElement){

            statusElement.classList.remove("online");

            statusElement.classList.add("offline");
        }

        if(statusText){

            statusText.textContent = "OFFLINE";
        }
    }

    // ==========================================
    // API Health Check
    // ==========================================

    async function checkAPI(){

        try{

            requestCount++;

            /*
             * فقط در صورتی که endpoint واقعی health
             * داشته باشیم این قسمت می‌تواند به API وصل شود.
             *
             * فعلاً وضعیت صفحه را خراب نمی‌کنیم.
             */

            setOnlineStatus();

            responseCount++;

        }

        catch(error){

            setOfflineStatus();

            console.warn(
                "XLAND API health check failed:",
                error
            );

        }

        updateMetrics();
    }

    checkAPI();

    // ==========================================
    // Copy Endpoint
    // ==========================================

    const copyButtons =
        document.querySelectorAll("[data-copy]");

    copyButtons.forEach(button => {

        button.addEventListener("click", async () => {

            const text = button.dataset.copy;

            if(!text){
                return;
            }

            try{

                await navigator.clipboard.writeText(text);

                const oldText =
                    button.textContent;

                button.textContent = "✓ Copied!";

                button.classList.add("copied");

                setTimeout(() => {

                    button.textContent = oldText;

                    button.classList.remove("copied");

                }, 1500);

            }

            catch(error){

                console.warn(
                    "Copy failed:",
                    error
                );

            }

        });

    });

    // ==========================================
    // Automatic Copy Buttons
    // ==========================================

    const codeBlocks =
        document.querySelectorAll(
            ".endpoint-block"
        );

    codeBlocks.forEach(block => {

        if(
            block.querySelector(".copy-btn")
        ){
            return;
        }

        const code =
            block.querySelector("code");

        if(!code){
            return;
        }

        const button =
            document.createElement("button");

        button.className = "copy-btn";

        button.type = "button";

        button.textContent = "📋 Copy";

        button.addEventListener(
            "click",
            async () => {

                try{

                    await navigator.clipboard.writeText(
                        code.textContent
                    );

                    button.textContent =
                        "✓ Copied!";

                    setTimeout(() => {

                        button.textContent =
                            "📋 Copy";

                    }, 1500);

                }

                catch(error){

                    console.warn(
                        "Copy failed:",
                        error
                    );

                }

            }
        );

        block.appendChild(button);

    });

    // ==========================================
    // Documentation Toggle
    // ==========================================

    const docsButton =
        get("docsBtn");

    const docsContent =
        get("documentationContent");

    if(
        docsButton &&
        docsContent
    ){

        docsButton.addEventListener(
            "click",
            () => {

                const hidden =
                    docsContent.classList.toggle(
                        "hidden"
                    );

                docsButton.textContent =
                    hidden
                    ? "📚 Read Documentation"
                    : "📕 Hide Documentation";

            }
        );

    }

    // ==========================================
    // Smooth Scroll
    // ==========================================

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetID =
                        link.getAttribute("href");

                    if(
                        !targetID ||
                        targetID === "#"
                    ){
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetID
                        );

                    if(!target){
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });

    // ==========================================
    // Scroll Reveal
    // ==========================================

    const revealElements =
        document.querySelectorAll(
            ".card, .plan, .status-card, " +
            ".security-card, .metric-card, " +
            ".endpoint-block, .docs-box"
        );

    if("IntersectionObserver" in window){

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if(entry.isIntersecting){

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );

        revealElements.forEach(element => {

            element.classList.add(
                "reveal"
            );

            observer.observe(element);

        });

    }
    else{

        revealElements.forEach(element => {

            element.classList.add(
                "visible"
            );

        });

    }

    // ==========================================
    // API Key Button
    // ==========================================

    const apiKeyButtons =
        document.querySelectorAll(
            ".api-key-btn"
        );

    apiKeyButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                window.location.href =
                    "apikey.html";

            }
        );

    });

    // ==========================================
    // Pricing Button Protection
    // ==========================================

    const comingSoonButtons =
        document.querySelectorAll(
            ".coming-soon"
        );

    comingSoonButtons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const original =
                    button.textContent;

                button.textContent =
                    "🚀 Coming Soon";

                setTimeout(() => {

                    button.textContent =
                        original;

                }, 1600);

            }
        );

    });

    // ==========================================
    // Feature Card Animation
    // ==========================================

    document
        .querySelectorAll(".card")
        .forEach(card => {

            card.addEventListener(
                "mouseenter",
                () => {

                    card.classList.add(
                        "feature-active"
                    );

                }
            );

            card.addEventListener(
                "mouseleave",
                () => {

                    card.classList.remove(
                        "feature-active"
                    );

                }
            );

        });

    // ==========================================
    // Security Badge
    // ==========================================

    const securityBadge =
        get("securityStatus");

    if(securityBadge){

        securityBadge.textContent =
            "🛡️ Protected";

        securityBadge.classList.add(
            "security-active"
        );

    }

    // ==========================================
    // API Version
    // ==========================================

    const versionElement =
        get("apiVersion");

    if(versionElement){

        versionElement.textContent =
            "v1.0";

    }

    // ==========================================
    // Initial Update
    // ==========================================

    updateMetrics();

    console.log(
        "🚀 XLAND API Enhancements v1.0 loaded"
    );

});