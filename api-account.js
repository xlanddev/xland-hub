// ===============================
// XLAND API Account System v1.1
// ===============================

// ---------- Create Account ----------

const createBtn = document.getElementById("createAccountBtn");

if(createBtn){

    createBtn.addEventListener("click", ()=>{

        const email = sanitizeInput(
            document.getElementById("email").value
        );

        const username = sanitizeInput(
            document.getElementById("username").value
        );

        const password = document.getElementById("password").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        // ---------- Empty Check ----------

        if(
            isEmpty(email) ||
            isEmpty(username) ||
            isEmpty(password) ||
            isEmpty(confirmPassword)
        ){

            alert("Please fill in all fields.");

            return;

        }

        // ---------- Email Validation ----------

        if(!validateEmail(email)){

            alert("Invalid email address.");

            return;

        }

        // ---------- Username Validation ----------

        if(!validateUsername(username)){

            alert("Username must be 3-20 characters and only contain letters, numbers or _");

            return;

        }

        // ---------- Password Validation ----------

        if(!validatePassword(password)){

            alert("Password must be at least 8 characters and contain letters and numbers.");

            return;

        }

        // ---------- Password Match ----------

        if(password !== confirmPassword){

            alert("Passwords do not match.");

            return;

        }

        // ---------- Save Account ----------

        const account = {

            email: email,

            username: username,

            password: password

        };

        localStorage.setItem(
            "xlandApiAccount",
            JSON.stringify(account)
        );

        alert("Account created successfully!");

        window.location.href = "api-signin.html";

    });

}

// ---------- Sign In ----------

const signinBtn = document.getElementById("signinBtn");

if(signinBtn){

    signinBtn.addEventListener("click", ()=>{

        const username = sanitizeInput(
            document.getElementById("username").value
        );

        const password = document.getElementById("password").value;

        // ---------- Empty Check ----------

        if(
            isEmpty(username) ||
            isEmpty(password)
        ){

            alert("Please fill in all fields.");

            return;

        }

        // ---------- Username Validation ----------

        if(!validateUsername(username)){

            alert("Invalid username.");

            return;

        }

        const account = JSON.parse(
            localStorage.getItem("xlandApiAccount")
        );

        if(!account){

            alert("No account found.");

            return;

        }

        if(
            username === account.username &&
            password === account.password
        ){

            localStorage.setItem(
                "xlandApiLoggedIn",
                "true"
            );

            window.location.href = "api.html";

        }

        else{

            alert("Username or Password is incorrect.");

        }

    });

}
