document.querySelector("#username").addEventListener("input",checkUsername);
document.querySelector("#signupForm").addEventListener("submit", function (event) {
    validateForm(event);
});

// ensure check on page load
if(document.querySelector("#username").value.length > 0){
    checkUsername();
}

async function checkUsername() {
    let username = document.querySelector("#username").value;
    let url = `/api/usernameAvailable/${username}`;
    let response = await fetch(url);
    let data = await response.json();
    let formError = document.querySelector("#feedback");
    if (data.available) {
        formError.innerHTML = "";
    } else {
        formError.innerHTML = "Username unavailable.";
        formError.style.color = "red";
    }
}

function validateForm(e) {
    let isValid = true;
    let username = document.querySelector("#username").value;
    let formError = document.querySelector("#feedback");

    if (username.length == 0) {
        formError.innerHTML = "Username required.";
        isValid = false;
    } else if (formError.innerHTML == "Username unavailable.") {
        isValid = false;
    }

    if (isValid) {
        let password = document.querySelector("#password").value;
        let retypedPassword = document.querySelector("#retypedPassword").value;
        if (password.length < 6) {
            formError.innerHTML = "Password must have at least six characters.";
            isValid = false;
        } else if (retypedPassword != password) {
    
            formError.innerHTML = "Passwords did not match. Please retype password.";
            isValid = false;
    
        }
    }

    if (!isValid) {
        e.preventDefault();
    }
}