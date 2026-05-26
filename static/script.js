let currentUser = "";
let previousPage = "mainMenu";

function el(id){
    return document.getElementById(id);
}

function hideAll(){

    document.querySelectorAll(".container").forEach(x=>{
        x.classList.add("hidden");
    });
}

/* ========= PAGE FUNCTIONS ========= */

function showLogin(){

    hideAll();

    if(el("loginPage")){
        el("loginPage").classList.remove("hidden");
    }
}

function showRegister(){

    hideAll();

    if(el("registerPage")){
        el("registerPage").classList.remove("hidden");
    }
}

function showDashboard(){

    hideAll();

    if(el("dashboard")){
        el("dashboard").classList.remove("hidden");
    }
}

function showBooking(){

    hideAll();

    if(el("bookingPage")){
        el("bookingPage").classList.remove("hidden");
    }
}

function showTickets(){

    hideAll();

    if(el("ticketPage")){
        el("ticketPage").classList.remove("hidden");
    }

    loadTickets();
}

function showPNR(){

    hideAll();

    if(el("pnrPage")){
        el("pnrPage").classList.remove("hidden");
    }
}

function showComplaint(){

    hideAll();

    if(el("complaintPage")){
        el("complaintPage").classList.remove("hidden");
    }
}

/* ========= HELP ========= */

function openHelp(){

    if(el("dashboard") && !el("dashboard").classList.contains("hidden")){
        previousPage = "dashboard";
    }

    else if(el("bookingPage") && !el("bookingPage").classList.contains("hidden")){
        previousPage = "bookingPage";
    }

    else if(el("ticketPage") && !el("ticketPage").classList.contains("hidden")){
        previousPage = "ticketPage";
    }

    else if(el("pnrPage") && !el("pnrPage").classList.contains("hidden")){
        previousPage = "pnrPage";
    }

    else if(el("complaintPage") && !el("complaintPage").classList.contains("hidden")){
        previousPage = "complaintPage";
    }

    else{
        previousPage = "loginPage";
    }

    hideAll();

    if(el("helpPage")){
        el("helpPage").classList.remove("hidden");
    }

    if(el("supportPage")){
        el("supportPage").classList.remove("hidden");
    }
}

function goBack(){

    hideAll();

    if(el(previousPage)){
        el(previousPage).classList.remove("hidden");
    }
}

function backPrevious(){

    goBack();
}

/* ========= REGISTER ========= */

function registerUser(){

    fetch("/register",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username:el("regUser").value,
            password:el("regPass").value
        })
    })

    .then(r=>r.json())

    .then(data=>{

        alert(data.message);

        if(data.success){
            showLogin();
        }
    });
}

/* ========= LOGIN ========= */

function login(){

    fetch("/login",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username:el("loginUser").value,
            password:el("loginPass").value
        })
    })

    .then(r=>r.json())

    .then(data=>{

        if(data.success){

            currentUser = el("loginUser").value;

            showDashboard();
        }

        else{

            alert(data.message);
        }
    });
}

/* ========= FARE CALCULATION ========= */

function calculateFare(){

    let classType = el("classType").value;

    let people = parseInt(el("people").value);

    if(!people || people < 1){
        people = 1;
    }

    let fare = 0;

    if(classType === "General - ₹100"){
        fare = 100;
    }

    else if(classType === "Sleeper - ₹150"){
        fare = 150;
    }

    else if(classType === "AC 3 Tier - ₹200"){
        fare = 200;
    }

    else if(classType === "AC 2 Tier - ₹250"){
        fare = 250;
    }

    else if(classType === "AC 1 Tier - ₹300"){
        fare = 300;
    }

    let total = fare * people;

    if(el("totalFare")){
        el("totalFare").innerHTML =
        "Total Fare: ₹" + total;
    }

    return total;
}

/* ========= BOOK TICKET ========= */

function bookTicket(){

    let totalFare = calculateFare();

    fetch("/book",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username: currentUser,

            train: el("train").value,

            source: el("source").value,

            destination: el("destination").value,

            classType: el("classType").value,

            people: el("people").value,

            fare: totalFare
        })
    })

    .then(r=>r.json())

    .then(data=>{

        alert(
            "Ticket Booked Successfully\n\n" +
            "PNR: " + data.pnr +
            "\nFare: ₹" + totalFare
        );

        showDashboard();
    });
}

/* ========= LOAD TICKETS ========= */

function loadTickets(){

    fetch("/tickets/" + currentUser)

    .then(r=>r.json())

    .then(data=>{

        let html = "";

        data.forEach(t=>{

            html += `

            <tr>

                <td>${t.pnr}</td>

                <td>${t.train}</td>

                <td>${t.classType}</td>

                <td>${t.people || 1}</td>

                <td>₹${t.fare || 0}</td>

                <td>${t.status}</td>

                <td>
                    <button class="cancelBtn"
                    onclick="cancelTicketDirect('${t.pnr}')">
                    Cancel
                    </button>
                </td>

            </tr>
            `;
        });

        if(el("ticketData")){
            el("ticketData").innerHTML = html;
        }
    });
}

/* ========= CANCEL ========= */

function cancelTicketDirect(pnr){

    fetch("/cancel/" + pnr,{

        method:"POST"
    })

    .then(r=>r.json())

    .then(data=>{

        alert(data.message);

        loadTickets();
    });
}

function cancelTicket(){

    let pnr = el("cancelPNR").value;

    fetch("/cancel/" + pnr,{

        method:"POST"
    })

    .then(r=>r.json())

    .then(data=>{

        alert(data.message);
    });
}

/* ========= PNR ========= */

function checkPNR(){

    let pnr = el("pnrInput").value;

    fetch("/pnr/" + pnr)

    .then(r=>r.json())

    .then(data=>{

        if(data.message){

            el("pnrResult").innerHTML =
            data.message;
        }

        else{

            el("pnrResult").innerHTML =

            `
            Train: ${data.train}<br><br>

            From: ${data.source}<br><br>

            To: ${data.destination}<br><br>

            Class: ${data.classType}<br><br>

            People: ${data.people || 1}<br><br>

            Fare: ₹${data.fare || 0}<br><br>

            Status: ${data.status}
            `;
        }
    });
}

/* ========= COMPLAINT ========= */

function submitComplaint(){

    fetch("/support",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username: currentUser,

            message: el("description")
            ? el("description").value
            : "Help Request"
        })
    })

    .then(r=>r.json())

    .then(data=>{

        if(el("complaintMsg")){
            el("complaintMsg").innerHTML =
            data.message;
        }

        alert(data.message);
    });
}

/* ========= HELP ========= */

function submitHelp(){

    fetch("/support",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            username: currentUser,

            message: el("helpText").value
        })
    })

    .then(r=>r.json())

    .then(data=>{

        if(el("helpMsg")){
            el("helpMsg").innerHTML =
            data.message;
        }

        alert(data.message);
    });
}

/* ========= LOGOUT ========= */

function logout(){

    currentUser = "";

    showLogin();
}

/* ========= CLOCK ========= */

setInterval(()=>{

    if(el("time")){

        el("time").innerHTML =

        "Current Time: " +

        new Date().toLocaleString();
    }

},1000);

/* ========= LANGUAGE ========= */

function changeLanguage(lang){

    if(lang === "es"){

        if(el("mainTitle")){
            el("mainTitle").innerHTML =
            "🚆 Sistema Ferroviario";
        }

        if(el("loginTitle")){
            el("loginTitle").innerHTML =
            "Iniciar Sesión";
        }

        if(el("loginBtn")){
            el("loginBtn").innerHTML =
            "Entrar";
        }
    }

    else{

        location.reload();
    }
}

/* ========= EXTRA PAGE ========= */

function goExtraPage(){
    window.location.href="/extra";
}

function goMainPage(){
    window.location.href="/";
}