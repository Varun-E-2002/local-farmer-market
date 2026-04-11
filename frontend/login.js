function showLogin(){
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("loginBox").style.display = "flex";
}

function showRegister(){
    document.getElementById("registerBox").style.display = "block";
    document.getElementById("loginBox").style.display = "none";
}

function registerUser(){
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const role = document.getElementById("regRole").value;

    if(!name || !email || !password || !role){
        alert("All register fields are required");
        return;
    }

    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);

    alert("Register success! Please login now");
    showLogin();
}

function loginUser(){
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const savedEmail = localStorage.getItem("userEmail");
    const savedPassword = localStorage.getItem("userPassword");

    if(!email || !password){
        alert("Email and password required");
        return;
    }

    if(email === savedEmail && password === savedPassword){
        alert("Login successful");
        window.location.href = "index.html";
    } else {
        alert("Invalid email or password");
    }
}