const loginBtn = document.getElementById("loginBtn");

const createBtn = document.getElementById("createBtn");


if(loginBtn){

    loginBtn.addEventListener("click", () => {

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;


        // ===============================
        // Security Validation
        // ===============================

        if(!validateUsername(username)){

            alert("❌ Invalid username.");

            return;

        }


        if(!validatePassword(password)){

            alert(
                "❌ Password must contain at least 8 characters, including a letter and a number."
            );

            return;

        }


        // ===============================
        // Login Placeholder
        // ===============================

        alert("Login System Coming Soon...");


        // پاکسازی اطلاعات حساس موقت
        clearLoginSensitiveData();

    });

}


if(createBtn){

    createBtn.addEventListener("click", () => {

        window.location.href = "signup.html";

    });

}