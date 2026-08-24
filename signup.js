const createAccountBtn =
    document.getElementById("createAccountBtn");


if(createAccountBtn){

    createAccountBtn.addEventListener("click", () => {

        const email =
            document.getElementById("email").value.trim();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        const confirm =
            document.getElementById("confirmPassword").value;


        // ===============================
        // Basic Validation
        // ===============================

        if(
            email === "" ||
            username === "" ||
            password === "" ||
            confirm === ""
        ){

            alert("Please fill all fields.");

            return;

        }


        // ===============================
        // Security Validation
        // ===============================

        if(typeof validateEmail === "function"){

            if(!validateEmail(email)){

                alert("❌ Invalid email address.");

                return;

            }

        }


        if(typeof validateUsername === "function"){

            if(!validateUsername(username)){

                alert(
                    "❌ Username must contain only letters, numbers and underscore."
                );

                return;

            }

        }


        if(typeof validatePassword === "function"){

            if(!validatePassword(password)){

                alert(
                    "❌ Password must be at least 8 characters and contain a letter and a number."
                );

                return;

            }

        }


        // ===============================
        // Confirm Password
        // ===============================

        if(password !== confirm){

            alert("Passwords do not match.");

            return;

        }


        // ===============================
        // Account Data
        // ===============================

        const account = {

            email: email,

            username: username

        };


        // ===============================
        // Store NON-SENSITIVE Data Only
        // ===============================

        localStorage.setItem(
            "xlandAccount",
            JSON.stringify(account)
        );


        // ===============================
        // Clear Sensitive Inputs
        // ===============================

        document.getElementById("password").value = "";

        document.getElementById("confirmPassword").value = "";


        alert(
            "Account Created Successfully!"
        );


        window.location.href =
            "xland-script.html";

    });

}


// ===============================
// Disable Image Context Menu
// ===============================

document.querySelectorAll("img").forEach(img => {

    img.addEventListener(
        "contextmenu",
        (e) => {

            e.preventDefault();

        }
    );

});