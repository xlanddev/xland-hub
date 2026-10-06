
/* =========================================================
   XLAND NAVBAR 3.0
   Independent Premium Navbar Controller
   Fixed Dropdown Hover / Click / Keyboard
   ========================================================= */

(function(){

    "use strict";


    /* =====================================================
       ACTIVE PAGE
       ===================================================== */

    function setActivePage(){

        const currentPage =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase() || "index.html";


        const links =
            document.querySelectorAll(
                ".xland-nav-link[data-page], " +
                ".xland-dropdown-item[data-page], " +
                ".xland-mobile-link[data-page]"
            );


        links.forEach(function(link){

            const page =
                (link.dataset.page || "")
                    .toLowerCase();


            if(page === currentPage){

                link.classList.add("active");

            }

        });

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    function setupMobileMenu(){

        const openButton =
           document.getElementById("xlandMobileBtn");
        const closeButton =
            document.getElementById("xlandMobileClose");

        const panel =
            document.getElementById("xlandMobilePanel");

        const backdrop =
            document.getElementById("xlandMobileBackdrop");


        if(
            !openButton ||
            !closeButton ||
            !panel ||
            !backdrop
        ){

            return;

        }


        function openMenu(){

            panel.classList.add("open");

            backdrop.classList.add("show");

            document.body.style.overflow = "hidden";

        }


        function closeMenu(){

            panel.classList.remove("open");

            backdrop.classList.remove("show");

            document.body.style.overflow = "";

        }


        openButton.addEventListener(
            "click",
            openMenu
        );


        closeButton.addEventListener(
            "click",
            closeMenu
        );


        backdrop.addEventListener(
            "click",
            closeMenu
        );


        panel
            .querySelectorAll("a")
            .forEach(function(link){

                link.addEventListener(
                    "click",
                    closeMenu
                );

            });


        document.addEventListener(
            "keydown",
            function(event){

                if(event.key === "Escape"){

                    closeMenu();

                }

            }
        );

    }


    /* =====================================================
       DROPDOWN
       ===================================================== */

    function setupDropdown(){

        const dropdowns =
            document.querySelectorAll(
                ".xland-nav-dropdown"
            );


        dropdowns.forEach(function(dropdown){

            const button =
                dropdown.querySelector(
                    ".xland-nav-dropdown-btn"
                );

            const panel =
                dropdown.querySelector(
                    ".xland-dropdown-panel"
                );


            if(!button || !panel){

                return;

            }


            /* =============================================
               MOUSE ENTER
               ============================================= */

            dropdown.addEventListener(
                "mouseenter",
                function(){

                    dropdown.classList.add(
                        "mouse-open"
                    );

                }
            );


            /* =============================================
               MOUSE LEAVE
               ============================================= */

            dropdown.addEventListener(
                "mouseleave",
                function(){

                    dropdown.classList.remove(
                        "mouse-open"
                    );

                    dropdown.classList.remove(
                        "keyboard-open"
                    );

                }
            );


            /* =============================================
               CLICK ON DEVELOPER BUTTON
               ============================================= */

            button.addEventListener(
                "click",
                function(event){

                    event.preventDefault();

                    dropdown.classList.toggle(
                        "keyboard-open"
                    );

                }
            );


            /* =============================================
               KEYBOARD ACCESS
               ============================================= */

            button.addEventListener(
                "keydown",
                function(event){

                    if(
                        event.key === "Enter" ||
                        event.key === " "
                    ){

                        event.preventDefault();

                        dropdown.classList.toggle(
                            "keyboard-open"
                        );

                    }


                    if(event.key === "Escape"){

                        dropdown.classList.remove(
                            "keyboard-open"
                        );

                    }

                }
            );


            /* =============================================
               KEEP DROPDOWN OPEN WHILE INSIDE PANEL
               ============================================= */

            panel.addEventListener(
                "mouseenter",
                function(){

                    dropdown.classList.add(
                        "mouse-open"
                    );

                }
            );


            panel.addEventListener(
                "mouseleave",
                function(){

                    dropdown.classList.remove(
                        "mouse-open"
                    );

                }
            );


            /* =============================================
               DROPDOWN LINKS
               ============================================= */

            panel
                .querySelectorAll("a")
                .forEach(function(link){

                    link.addEventListener(
                        "click",
                        function(){

                            dropdown.classList.remove(
                                "mouse-open"
                            );

                            dropdown.classList.remove(
                                "keyboard-open"
                            );

                        }
                    );

                });

        });

    }


    /* =====================================================
       KEYBOARD ACCESS
       ===================================================== */

    function setupDropdownKeyboard(){

        const dropdowns =
            document.querySelectorAll(
                ".xland-nav-dropdown"
            );


        dropdowns.forEach(function(dropdown){

            const button =
                dropdown.querySelector(
                    ".xland-nav-dropdown-btn"
                );


            if(!button){

                return;

            }


            button.addEventListener(
                "keydown",
                function(event){

                    if(event.key === "Escape"){

                        dropdown.classList.remove(
                            "keyboard-open"
                        );

                        button.blur();

                    }

                }
            );

        });

    }


    /* =====================================================
       NAVBAR SCROLL EFFECT
       ===================================================== */

    function setupScrollEffect(){

        const navbar =
            document.querySelector(
                ".xland-navbar"
            );


        if(!navbar){

            return;

        }


        function updateNavbar(){

            if(window.scrollY > 20){

                navbar.style.boxShadow =
                    "0 18px 50px rgba(0,0,0,.45), " +
                    "0 0 35px rgba(0,255,136,.10)";

                navbar.style.borderColor =
                    "rgba(0,255,136,.16)";

            }else{

                navbar.style.boxShadow =
                    "0 15px 45px rgba(0,0,0,.35), " +
                    "0 0 35px rgba(0,255,136,.08)";

                navbar.style.borderColor =
                    "rgba(255,255,255,.10)";

            }

        }


        window.addEventListener(
            "scroll",
            updateNavbar,
            {
                passive:true
            }
        );


        updateNavbar();

    }


    /* =====================================================
       INIT
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function(){

            setActivePage();

            setupMobileMenu();

            setupDropdown();

            setupDropdownKeyboard();

            setupScrollEffect();

        }
    );


})();

