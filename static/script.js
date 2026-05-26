// =============================================
//  RAILBOOK — MAIN SCRIPT
// =============================================

// ======= STATE =======
let currentUser = "";
let selectedTrain = null;
let selectedClass = null;
let passengerCount = 1;
let journeyDate = "";
let lastSearchFrom = "";
let lastSearchTo = "";

// ======= TRAIN DATABASE =======
const TRAINS = [
  {
    number: "12951", name: "Mumbai Rajdhani Express",
    source: "Mumbai Central", destination: "New Delhi",
    departure: "16:35", arrival: "08:35", duration: "16h 00m",
    runDays: "Daily",
    classes: {
      "SL": { fare: 755,  seats: "AVL 82",  type: "avl" },
      "3A": { fare: 1990, seats: "AVL 24",  type: "avl" },
      "2A": { fare: 2855, seats: "AVL 8",   type: "avl" },
      "1A": { fare: 4840, seats: "AVL 2",   type: "avl" }
    }
  },
  {
    number: "12952", name: "New Delhi Rajdhani Express",
    source: "New Delhi", destination: "Mumbai Central",
    departure: "16:25", arrival: "08:15", duration: "15h 50m",
    runDays: "Daily",
    classes: {
      "SL": { fare: 755,  seats: "AVL 45",  type: "avl" },
      "3A": { fare: 1990, seats: "RAC 3",   type: "rac" },
      "2A": { fare: 2855, seats: "AVL 10",  type: "avl" },
      "1A": { fare: 4840, seats: "AVL 4",   type: "avl" }
    }
  },
  {
    number: "12001", name: "Bhopal Shatabdi Express",
    source: "New Delhi", destination: "Bhopal",
    departure: "06:00", arrival: "14:00", duration: "8h 00m",
    runDays: "Mon–Sat",
    classes: {
      "CC": { fare: 880,  seats: "AVL 55",  type: "avl" },
      "EC": { fare: 1740, seats: "AVL 12",  type: "avl" }
    }
  },
  {
    number: "22435", name: "Vande Bharat Express",
    source: "New Delhi", destination: "Varanasi",
    departure: "06:00", arrival: "14:00", duration: "8h 00m",
    runDays: "Daily",
    classes: {
      "CC": { fare: 1385, seats: "AVL 40",  type: "avl" },
      "EC": { fare: 2560, seats: "AVL 8",   type: "avl" }
    }
  },
  {
    number: "12213", name: "Patna Duronto Express",
    source: "Patna", destination: "New Delhi",
    departure: "18:25", arrival: "10:25", duration: "16h 00m",
    runDays: "Wed, Fri, Sun",
    classes: {
      "SL": { fare: 640,  seats: "AVL 120", type: "avl" },
      "3A": { fare: 1680, seats: "AVL 30",  type: "avl" },
      "2A": { fare: 2500, seats: "WL 5",    type: "wl"  }
    }
  },
  {
    number: "12909", name: "Garib Rath Express",
    source: "Mumbai Central", destination: "New Delhi",
    departure: "17:00", arrival: "12:55", duration: "19h 55m",
    runDays: "Tue, Fri",
    classes: {
      "3A": { fare: 1045, seats: "AVL 200", type: "avl" }
    }
  },
  {
    number: "22109", name: "Humsafar Express",
    source: "Pune", destination: "New Delhi",
    departure: "10:50", arrival: "14:00", duration: "27h 10m",
    runDays: "Mon, Thu",
    classes: {
      "3A": { fare: 1555, seats: "AVL 60",  type: "avl" }
    }
  },
  {
    number: "12051", name: "Jan Shatabdi Express",
    source: "Mumbai Central", destination: "Pune",
    departure: "06:10", arrival: "09:55", duration: "3h 45m",
    runDays: "Daily",
    classes: {
      "CC": { fare: 285, seats: "AVL 80",  type: "avl" },
      "SL": { fare: 145, seats: "RAC 2",  type: "rac" }
    }
  },
  {
    number: "82501", name: "Tejas Express",
    source: "Lucknow", destination: "New Delhi",
    departure: "06:10", arrival: "12:25", duration: "6h 15m",
    runDays: "Daily",
    classes: {
      "CC": { fare: 890,  seats: "AVL 35",  type: "avl" },
      "EC": { fare: 1675, seats: "AVL 8",   type: "avl" }
    }
  },
  {
    number: "12449", name: "Sampark Kranti Express",
    source: "Chandigarh", destination: "New Delhi",
    departure: "05:55", arrival: "09:10", duration: "3h 15m",
    runDays: "Daily",
    classes: {
      "SL": { fare: 190, seats: "AVL 150", type: "avl" },
      "3A": { fare: 495, seats: "AVL 40",  type: "avl" },
      "2A": { fare: 720, seats: "AVL 12",  type: "avl" }
    }
  },
  {
    number: "12155", name: "Bhopal Intercity Express",
    source: "Bhopal", destination: "Indore",
    departure: "07:15", arrival: "11:15", duration: "4h 00m",
    runDays: "Daily",
    classes: {
      "SL": { fare: 185, seats: "AVL 60",  type: "avl" },
      "CC": { fare: 375, seats: "AVL 25",  type: "avl" }
    }
  },
  {
    number: "12627", name: "Karnataka Express",
    source: "New Delhi", destination: "Bangalore City",
    departure: "22:30", arrival: "06:45", duration: "32h 15m",
    runDays: "Daily",
    classes: {
      "SL": { fare: 825,  seats: "AVL 90",  type: "avl" },
      "3A": { fare: 2180, seats: "AVL 20",  type: "avl" },
      "2A": { fare: 3120, seats: "WL 2",    type: "wl"  },
      "1A": { fare: 5250, seats: "AVL 3",   type: "avl" }
    }
  },
  {
    number: "12842", name: "Coromandel Express",
    source: "Howrah", destination: "Chennai Central",
    departure: "14:25", arrival: "05:00", duration: "14h 35m",
    runDays: "Daily",
    classes: {
      "SL": { fare: 620,  seats: "AVL 110", type: "avl" },
      "3A": { fare: 1640, seats: "AVL 35",  type: "avl" },
      "2A": { fare: 2400, seats: "RAC 1",   type: "rac" }
    }
  },
  {
    number: "12723", name: "Telangana Express",
    source: "New Delhi", destination: "Hyderabad",
    departure: "06:25", arrival: "09:10", duration: "26h 45m",
    runDays: "Daily",
    classes: {
      "SL": { fare: 710,  seats: "AVL 75",  type: "avl" },
      "3A": { fare: 1880, seats: "AVL 22",  type: "avl" },
      "2A": { fare: 2720, seats: "AVL 6",   type: "avl" }
    }
  },
  {
    number: "12958", name: "Swarna Jayanti Rajdhani",
    source: "New Delhi", destination: "Ahmedabad",
    departure: "19:40", arrival: "10:05", duration: "14h 25m",
    runDays: "Daily",
    classes: {
      "3A": { fare: 1780, seats: "AVL 40",  type: "avl" },
      "2A": { fare: 2580, seats: "AVL 8",   type: "avl" },
      "1A": { fare: 4400, seats: "AVL 2",   type: "avl" }
    }
  },
  {
    number: "12311", name: "Howrah Rajdhani Express",
    source: "Howrah", destination: "New Delhi",
    departure: "13:55", arrival: "10:00", duration: "20h 05m",
    runDays: "Daily",
    classes: {
      "3A": { fare: 2010, seats: "AVL 30",  type: "avl" },
      "2A": { fare: 2890, seats: "AVL 10",  type: "avl" },
      "1A": { fare: 4960, seats: "AVL 3",   type: "avl" }
    }
  },
  {
    number: "12301", name: "Howrah Mail",
    source: "Howrah", destination: "New Delhi",
    departure: "19:55", arrival: "09:45", duration: "13h 50m",
    runDays: "Daily",
    classes: {
      "SL": { fare: 680,  seats: "AVL 90",  type: "avl" },
      "3A": { fare: 1760, seats: "AVL 28",  type: "avl" },
      "2A": { fare: 2560, seats: "AVL 8",   type: "avl" }
    }
  },
  {
    number: "12619", name: "Matsyagandha Express",
    source: "Mumbai Central", destination: "Mangaluru",
    departure: "07:10", arrival: "05:00", duration: "21h 50m",
    runDays: "Daily",
    classes: {
      "SL": { fare: 540,  seats: "AVL 60",  type: "avl" },
      "3A": { fare: 1420, seats: "AVL 18",  type: "avl" }
    }
  },
  {
    number: "12643", name: "Nagercoil Express",
    source: "Chennai Central", destination: "Hyderabad",
    departure: "06:00", arrival: "16:30", duration: "10h 30m",
    runDays: "Tue, Fri, Sun",
    classes: {
      "SL": { fare: 290,  seats: "AVL 70",  type: "avl" },
      "3A": { fare: 760,  seats: "AVL 22",  type: "avl" },
      "2A": { fare: 1090, seats: "RAC 1",   type: "rac" }
    }
  },
  {
    number: "12626", name: "Kerala Express",
    source: "New Delhi", destination: "Thiruvananthapuram",
    departure: "11:20", arrival: "13:45", duration: "26h 25m",
    runDays: "Daily",
    classes: {
      "SL": { fare: 980,  seats: "AVL 100", type: "avl" },
      "3A": { fare: 2590, seats: "AVL 24",  type: "avl" },
      "2A": { fare: 3720, seats: "AVL 6",   type: "avl" }
    }
  }
];

// ======= UTILITY =======
function el(id) { return document.getElementById(id); }

function showToast(msg, type = "info") {
  const c = el("toastContainer");
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  t.innerHTML = `<span>${icons[type] || "ℹ️"}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => {
    t.classList.add("out");
    setTimeout(() => t.remove(), 320);
  }, 3200);
}

function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function setActiveNav(id) {
  document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
  const link = el(id);
  if (link) link.classList.add("active");
}

// ======= PAGE NAVIGATION =======
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  const page = el(id);
  if (page) {
    page.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function showHome() {
  showPage("homePage");
  setActiveNav("navHome");
}

function showSearchPage() {
  showPage("searchPage");
}

function showBookingPage() {
  showPage("bookingPage");
  setActiveNav(null);
  renderFareSummary();
}

function showMyTickets() {
  if (!currentUser) { openLoginModal(); return; }
  showPage("myTicketsPage");
  setActiveNav("navTickets");
  loadTickets();
}

function showPNRPage() {
  showPage("pnrPage");
  setActiveNav("navPNR");
  el("pnrResult").classList.add("hidden");
  el("pnrInput").value = "";
}

function showSupportPage() {
  showPage("supportPage");
  setActiveNav("navSupport");
}

function requireLogin(fn) {
  if (!currentUser) { openLoginModal(); return; }
  fn();
}

// ======= MODALS =======
function openLoginModal() {
  el("loginModal").classList.remove("hidden");
  el("loginUser").value = "";
  el("loginPass").value = "";
  setTimeout(() => el("loginUser").focus(), 100);
}

function openRegisterModal() {
  el("registerModal").classList.remove("hidden");
  el("regUser").value = "";
  el("regPass").value = "";
  setTimeout(() => el("regUser").focus(), 100);
}

function closeModal(id) {
  el(id).classList.add("hidden");
}

function closeModalOnOverlay(e, id) {
  if (e.target === el(id)) closeModal(id);
}

function switchToRegister() {
  closeModal("loginModal");
  openRegisterModal();
}

function switchToLogin() {
  closeModal("registerModal");
  openLoginModal();
}

// ======= AUTH =======
function updateAuthUI() {
  if (currentUser) {
    el("navAuthBtns").classList.add("hidden");
    el("userMenu").classList.remove("hidden");
    el("userGreet").textContent = "Hi, " + currentUser;
  } else {
    el("navAuthBtns").classList.remove("hidden");
    el("userMenu").classList.add("hidden");
  }
}

function login() {
  const username = el("loginUser").value.trim();
  const password = el("loginPass").value;
  if (!username || !password) { showToast("Please fill all fields", "error"); return; }

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      currentUser = username;
      closeModal("loginModal");
      updateAuthUI();
      showToast("Welcome back, " + username + "! 👋", "success");
    } else {
      showToast(data.message, "error");
    }
  })
  .catch(() => showToast("Network error. Please try again.", "error"));
}

function registerUser() {
  const username = el("regUser").value.trim();
  const password = el("regPass").value;
  if (!username || !password) { showToast("Please fill all fields", "error"); return; }
  if (password.length < 4) { showToast("Password must be at least 4 characters", "error"); return; }

  fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      closeModal("registerModal");
      showToast("Account created! Please login.", "success");
      openLoginModal();
    } else {
      showToast(data.message, "error");
    }
  })
  .catch(() => showToast("Network error. Please try again.", "error"));
}

function logout() {
  currentUser = "";
  selectedTrain = null;
  selectedClass = null;
  updateAuthUI();
  showHome();
  showToast("Logged out successfully", "info");
}

// ======= DATE UTILS =======
function setQuickDate(daysAhead) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const iso = d.toISOString().split("T")[0];
  el("searchDate").value = iso;
}

function initDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  el("searchDate").value = tomorrow.toISOString().split("T")[0];
}

// ======= SWAP STATIONS =======
function swapStations() {
  const from = el("searchFrom").value;
  const to = el("searchTo").value;
  el("searchFrom").value = to;
  el("searchTo").value = from;
}

// ======= SEARCH TRAINS =======
function searchTrains() {
  const from = el("searchFrom").value.trim();
  const to   = el("searchTo").value.trim();
  const date = el("searchDate").value;
  const cls  = el("searchClass").value;

  if (!from) { showToast("Please enter the departure city", "error"); el("searchFrom").focus(); return; }
  if (!to)   { showToast("Please enter the destination city", "error"); el("searchTo").focus(); return; }
  if (!date) { showToast("Please select a travel date", "error"); return; }

  journeyDate = date;
  lastSearchFrom = from;
  lastSearchTo = to;

  const results = TRAINS.filter(t => {
    const srcMatch  = t.source.toLowerCase().includes(from.toLowerCase()) ||
                      from.toLowerCase().includes(t.source.toLowerCase().split(" ")[0]);
    const dstMatch  = t.destination.toLowerCase().includes(to.toLowerCase()) ||
                      to.toLowerCase().includes(t.destination.toLowerCase().split(" ")[0]);
    const clsMatch  = cls === "all" || Object.keys(t.classes).includes(cls);
    return srcMatch && dstMatch && clsMatch;
  });

  renderSearchResults(results, from, to, date);
  showPage("searchPage");
  setActiveNav(null);
}

function renderSearchResults(results, from, to, date) {
  el("resultFrom").textContent = from;
  el("resultTo").textContent = to;
  el("resultDate").textContent = formatDate(date);

  const list = el("trainResults");

  if (results.length === 0) {
    list.innerHTML = `
      <div class="no-trains">
        <div class="no-trains-icon">🚫</div>
        <h3>No trains found</h3>
        <p>Try searching with different cities or check spelling</p>
      </div>`;
    return;
  }

  list.innerHTML = results.map(t => {
    const classChips = Object.entries(t.classes).map(([cls, info]) => `
      <div class="class-chip ${info.type}" onclick="selectClassFromCard(event, '${t.number}', '${cls}')">
        <span class="class-chip-name">${cls}</span>
        <span class="class-chip-avl">${info.seats}</span>
      </div>`).join("");

    const minFare = Math.min(...Object.values(t.classes).map(c => c.fare));

    return `
    <div class="train-card" id="card-${t.number}">
      <div class="train-card-top">
        <div class="train-identity">
          <div class="train-name">${t.name}</div>
          <div class="train-meta">#${t.number}</div>
          <div class="train-runs">🗓 ${t.runDays}</div>
        </div>
        <div class="train-timing">
          <div class="timing-dep">
            <div class="timing-time">${t.departure}</div>
            <div class="timing-station">${t.source}</div>
          </div>
          <div class="timing-mid">
            <div class="timing-line"></div>
            <div class="timing-dur">${t.duration}</div>
          </div>
          <div class="timing-arr">
            <div class="timing-time">${t.arrival}</div>
            <div class="timing-station">${t.destination}</div>
          </div>
        </div>
      </div>
      <div class="train-card-classes">${classChips}</div>
      <div class="train-card-bottom">
        <div class="train-fare-hint">Starts from <strong>₹${minFare}</strong></div>
        <button class="btn-book-now" onclick="initiateBooking('${t.number}')">Book Now →</button>
      </div>
    </div>`;
  }).join("");
}

function selectClassFromCard(e, trainNum, cls) {
  document.querySelectorAll(`.class-chip`).forEach(c => c.classList.remove("selected"));
  e.currentTarget.classList.add("selected");
  const train = TRAINS.find(t => t.number === trainNum);
  if (train) {
    selectedTrain = train;
    selectedClass = cls;
  }
}

// ======= BOOKING =======
function initiateBooking(trainNum) {
  if (!currentUser) { openLoginModal(); return; }

  const train = TRAINS.find(t => t.number === trainNum);
  if (!train) return;

  selectedTrain = train;
  passengerCount = 1;

  // If class not selected, pick first available
  if (!selectedClass || !train.classes[selectedClass]) {
    selectedClass = Object.keys(train.classes)[0];
  }

  renderBookingPage();
  showBookingPage();
}

function renderBookingPage() {
  const t = selectedTrain;
  if (!t) return;

  // Train banner
  el("bookingTrainBanner").innerHTML = `
    <div>
      <div class="btb-name">${t.name} <span style="font-weight:400;color:var(--text-muted);font-size:13px">#${t.number}</span></div>
      <div class="btb-route">${t.source} → ${t.destination}</div>
    </div>
    <div class="btb-timing">
      ${t.departure} → ${t.arrival}
      <small>${t.duration}</small>
    </div>`;

  // Class selector
  const cs = el("classSelector");
  cs.innerHTML = Object.entries(t.classes).map(([cls, info]) => `
    <button class="class-btn ${cls === selectedClass ? "selected" : ""}" onclick="selectBookingClass('${cls}')">
      ${cls}
      <span>₹${info.fare}</span>
    </button>`).join("");

  // Date
  el("bookingDate").value = journeyDate;
  el("passengerCount").textContent = passengerCount;
  renderFareSummary();
}

function selectBookingClass(cls) {
  selectedClass = cls;
  document.querySelectorAll(".class-btn").forEach(b => b.classList.remove("selected"));
  document.querySelectorAll(".class-btn").forEach(b => {
    if (b.textContent.trim().startsWith(cls)) b.classList.add("selected");
  });
  renderFareSummary();
}

function changeCount(delta) {
  passengerCount = Math.max(1, Math.min(6, passengerCount + delta));
  el("passengerCount").textContent = passengerCount;
  renderFareSummary();
}

function renderFareSummary() {
  if (!selectedTrain || !selectedClass) return;
  const baseFare = selectedTrain.classes[selectedClass]?.fare || 0;
  const reservation = 40;
  const total = (baseFare * passengerCount) + reservation;

  el("fareSummaryBase").textContent = "₹" + baseFare;
  el("fareSummaryPax").textContent = "× " + passengerCount;
  el("fareSummaryTotal").textContent = "₹" + total;
}

function confirmBooking() {
  if (!currentUser) { openLoginModal(); return; }

  const name   = el("passengerName").value.trim();
  const age    = el("passengerAge").value.trim();
  const gender = el("passengerGender").value;

  if (!name) { showToast("Please enter passenger name", "error"); return; }
  if (!age)  { showToast("Please enter passenger age", "error"); return; }
  if (!selectedClass) { showToast("Please select a travel class", "error"); return; }

  const baseFare = selectedTrain.classes[selectedClass].fare;
  const total = (baseFare * passengerCount) + 40;

  fetch("/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username:    currentUser,
      train:       selectedTrain.name + " (" + selectedTrain.number + ")",
      source:      selectedTrain.source,
      destination: selectedTrain.destination,
      classType:   selectedClass,
      people:      passengerCount,
      fare:        total
    })
  })
  .then(r => r.json())
  .then(data => {
    if (data.pnr) {
      showConfirmModal(data.pnr, total, name);
    } else {
      showToast("Booking failed. Try again.", "error");
    }
  })
  .catch(() => showToast("Network error. Please try again.", "error"));
}

function showConfirmModal(pnr, total, passengerName) {
  el("confirmPNRVal").textContent = pnr;
  el("confirmDetails").innerHTML = `
    <div class="confirm-row"><span class="lbl">Train</span><span class="val">${selectedTrain.name}</span></div>
    <div class="confirm-row"><span class="lbl">Route</span><span class="val">${selectedTrain.source} → ${selectedTrain.destination}</span></div>
    <div class="confirm-row"><span class="lbl">Class</span><span class="val">${selectedClass}</span></div>
    <div class="confirm-row"><span class="lbl">Passengers</span><span class="val">${passengerCount}</span></div>
    <div class="confirm-row"><span class="lbl">Passenger</span><span class="val">${passengerName}</span></div>
    <div class="confirm-row"><span class="lbl">Date</span><span class="val">${formatDate(journeyDate)}</span></div>
    <div class="confirm-row"><span class="lbl">Total Paid</span><span class="val" style="color:var(--red)">₹${total}</span></div>`;
  el("confirmModal").classList.remove("hidden");
}

// ======= MY TICKETS =======
function loadTickets() {
  el("ticketsList").innerHTML = `<div class="empty-state"><div class="empty-icon">⏳</div><h3>Loading...</h3></div>`;

  fetch("/tickets/" + currentUser)
  .then(r => r.json())
  .then(data => {
    if (!data.length) {
      el("ticketsList").innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🎫</div>
          <h3>No bookings yet</h3>
          <p>Your booked tickets will appear here</p>
          <button class="btn-go-book" onclick="showHome()">Book a Train</button>
        </div>`;
      return;
    }

    el("ticketsList").innerHTML = data.map(t => {
      const isCanc = t.status === "Cancelled";
      return `
      <div class="ticket-card">
        <div class="ticket-header">
          <div>
            <div class="pnr-label">PNR Number</div>
            <div class="pnr-num">${t.pnr}</div>
          </div>
          <span class="status-badge ${isCanc ? "cancelled" : "confirmed"}">${t.status}</span>
        </div>
        <div class="ticket-body">
          <div class="ticket-route">
            <div class="ticket-city">${t.source || "—"}</div>
            <div class="ticket-route-arrow">→</div>
            <div class="ticket-city">${t.destination || "—"}</div>
            <div class="ticket-train">${t.train || "—"}</div>
          </div>
          <div class="ticket-details">
            <div class="ticket-detail">
              <label>Class</label>
              <span>${t.classType || "—"}</span>
            </div>
            <div class="ticket-detail">
              <label>Passengers</label>
              <span>${t.people || 1}</span>
            </div>
            <div class="ticket-detail">
              <label>Fare</label>
              <span>₹${t.fare || 0}</span>
            </div>
          </div>
        </div>
        ${!isCanc ? `
        <div class="ticket-footer">
          <button class="btn-cancel-ticket" onclick="cancelTicket('${t.pnr}')">Cancel Ticket</button>
        </div>` : ""}
      </div>`;
    }).join("");
  })
  .catch(() => showToast("Could not load tickets", "error"));
}

function cancelTicket(pnr) {
  if (!confirm("Are you sure you want to cancel this ticket?")) return;

  fetch("/cancel/" + pnr, { method: "POST" })
  .then(r => r.json())
  .then(() => {
    showToast("Ticket cancelled successfully", "info");
    loadTickets();
  })
  .catch(() => showToast("Cancellation failed", "error"));
}

// ======= PNR STATUS =======
function checkPNR() {
  const pnr = el("pnrInput").value.trim();
  if (!pnr) { showToast("Please enter a PNR number", "error"); return; }

  fetch("/pnr/" + pnr)
  .then(r => r.json())
  .then(data => {
    const box = el("pnrResult");
    box.classList.remove("hidden", "error");

    if (data.message) {
      box.classList.add("error");
      box.innerHTML = `<strong>❌ ${data.message}</strong>`;
    } else {
      box.innerHTML = `
        <div class="pnr-result-row"><span>Train</span><span>${data.train || "—"}</span></div>
        <div class="pnr-result-row"><span>From</span><span>${data.source || "—"}</span></div>
        <div class="pnr-result-row"><span>To</span><span>${data.destination || "—"}</span></div>
        <div class="pnr-result-row"><span>Class</span><span>${data.classType || "—"}</span></div>
        <div class="pnr-result-row"><span>Passengers</span><span>${data.people || 1}</span></div>
        <div class="pnr-result-row"><span>Fare</span><span>₹${data.fare || 0}</span></div>
        <div class="pnr-result-row"><span>Status</span>
          <span style="color:${data.status === 'Confirmed' ? 'var(--green)' : '#e74c3c'};font-weight:700">
            ${data.status}
          </span>
        </div>`;
    }
  })
  .catch(() => showToast("Network error", "error"));
}

// ======= SUPPORT =======
function submitSupport() {
  const issue = el("issueType").value;
  const desc  = el("issueDesc").value.trim();
  if (!desc) { showToast("Please describe your issue", "error"); return; }

  fetch("/support", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: currentUser || "guest",
      message: issue + " — " + desc
    })
  })
  .then(r => r.json())
  .then(() => {
    showToast("Support request submitted! We'll respond soon.", "success");
    el("issueDesc").value = "";
  })
  .catch(() => showToast("Submission failed", "error"));
}

// ======= KEYBOARD SHORTCUTS =======
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeAllStationDropdowns();
    ["loginModal","registerModal","confirmModal"].forEach(id => {
      if (el(id) && !el(id).classList.contains("hidden")) closeModal(id);
    });
  }
  if (e.key === "Enter") {
    if (el("loginModal") && !el("loginModal").classList.contains("hidden")) login();
    if (el("registerModal") && !el("registerModal").classList.contains("hidden")) registerUser();
  }
});

// ======= INIT =======
document.addEventListener("DOMContentLoaded", () => {
  initDate();
  updateAuthUI();
});

// ======= STATION DATABASE =======
const STATIONS = [
  { name: "New Delhi",          code: "NDLS", state: "Delhi" },
  { name: "Mumbai Central",     code: "BCT",  state: "Maharashtra" },
  { name: "Mumbai CST",         code: "CSTM", state: "Maharashtra" },
  { name: "Howrah",             code: "HWH",  state: "West Bengal" },
  { name: "Kolkata",            code: "KOAA", state: "West Bengal" },
  { name: "Chennai Central",    code: "MAS",  state: "Tamil Nadu" },
  { name: "Bangalore City",     code: "SBC",  state: "Karnataka" },
  { name: "Hyderabad",          code: "HYB",  state: "Telangana" },
  { name: "Secunderabad",       code: "SC",   state: "Telangana" },
  { name: "Pune",               code: "PUNE", state: "Maharashtra" },
  { name: "Ahmedabad",          code: "ADI",  state: "Gujarat" },
  { name: "Surat",              code: "ST",   state: "Gujarat" },
  { name: "Vadodara",           code: "BRC",  state: "Gujarat" },
  { name: "Lucknow",            code: "LKO",  state: "Uttar Pradesh" },
  { name: "Kanpur Central",     code: "CNB",  state: "Uttar Pradesh" },
  { name: "Agra Cantt",         code: "AGC",  state: "Uttar Pradesh" },
  { name: "Varanasi",           code: "BSB",  state: "Uttar Pradesh" },
  { name: "Allahabad",          code: "ALD",  state: "Uttar Pradesh" },
  { name: "Patna",              code: "PNBE", state: "Bihar" },
  { name: "Gaya",               code: "GAYA", state: "Bihar" },
  { name: "Bhopal",             code: "BPL",  state: "Madhya Pradesh" },
  { name: "Indore",             code: "INDB", state: "Madhya Pradesh" },
  { name: "Nagpur",             code: "NGP",  state: "Maharashtra" },
  { name: "Chandigarh",         code: "CDG",  state: "Punjab" },
  { name: "Amritsar",           code: "ASR",  state: "Punjab" },
  { name: "Ludhiana",           code: "LDH",  state: "Punjab" },
  { name: "Jaipur",             code: "JP",   state: "Rajasthan" },
  { name: "Jodhpur",            code: "JU",   state: "Rajasthan" },
  { name: "Udaipur",            code: "UDZ",  state: "Rajasthan" },
  { name: "Kota",               code: "KOTA", state: "Rajasthan" },
  { name: "Mangaluru",          code: "MAQ",  state: "Karnataka" },
  { name: "Thiruvananthapuram", code: "TVC",  state: "Kerala" },
  { name: "Kochi",              code: "ERS",  state: "Kerala" },
  { name: "Coimbatore",         code: "CBE",  state: "Tamil Nadu" },
  { name: "Madurai",            code: "MDU",  state: "Tamil Nadu" },
  { name: "Visakhapatnam",      code: "VSKP", state: "Andhra Pradesh" },
  { name: "Vijayawada",         code: "BZA",  state: "Andhra Pradesh" },
  { name: "Guwahati",           code: "GHY",  state: "Assam" },
  { name: "Bhubaneswar",        code: "BBS",  state: "Odisha" },
  { name: "Raipur",             code: "R",    state: "Chhattisgarh" },
  { name: "Ranchi",             code: "RNC",  state: "Jharkhand" },
  { name: "Dehradun",           code: "DDN",  state: "Uttarakhand" },
  { name: "Haridwar",           code: "HW",   state: "Uttarakhand" },
  { name: "Shimla",             code: "SML",  state: "Himachal Pradesh" },
];

// ======= STATION AUTOCOMPLETE =======
const POPULAR_STATIONS = [
  "New Delhi", "Mumbai Central", "Howrah", "Chennai Central",
  "Bangalore City", "Hyderabad", "Pune", "Lucknow"
];

let kbdIndex = { from: -1, to: -1 };

function openStationDropdown(type) {
  closeAllStationDropdowns();
  const query = el(type === 'from' ? 'searchFrom' : 'searchTo').value.trim();
  renderStationDropdown(type, query);
  el(type === 'from' ? 'fromDropdown' : 'toDropdown').classList.add('open');
  kbdIndex[type] = -1;
}

function filterStations(type) {
  const query = el(type === 'from' ? 'searchFrom' : 'searchTo').value.trim();
  renderStationDropdown(type, query);
  el(type === 'from' ? 'fromDropdown' : 'toDropdown').classList.add('open');
  kbdIndex[type] = -1;
}

function renderStationDropdown(type, query) {
  const dropdownId = type === 'from' ? 'fromDropdown' : 'toDropdown';
  const dropdown = el(dropdownId);
  const q = query.toLowerCase();

  let filtered;
  let headerLabel;

  if (!q) {
    // Show popular stations when no query
    filtered = STATIONS.filter(s => POPULAR_STATIONS.includes(s.name));
    headerLabel = '⭐ Popular Stations';
  } else {
    filtered = STATIONS.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q)
    );
    headerLabel = filtered.length ? `🔍 ${filtered.length} result${filtered.length > 1 ? 's' : ''}` : '';
  }

  if (!filtered.length) {
    dropdown.innerHTML = `
      <div class="sd-header">🔍 Search Stations</div>
      <div class="sd-no-result">
        <span>🚫</span>
        No stations found for "${query}"
      </div>`;
    return;
  }

  const items = filtered.map((s, i) => {
    const displayName = q
      ? s.name.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>')
      : s.name;
    return `
      <div class="station-option" data-idx="${i}" data-name="${s.name}"
           onclick="selectStation('${type}', '${s.name}')">
        <div class="so-icon">🚉</div>
        <div class="so-details">
          <div class="so-name">${displayName}</div>
          <div class="so-state">${s.state}</div>
        </div>
        <div class="so-code">${s.code}</div>
      </div>`;
  }).join('');

  dropdown.innerHTML = `
    <div class="sd-header">${headerLabel}</div>
    <div class="sd-scroll">${items}</div>`;
}

function selectStation(type, name) {
  el(type === 'from' ? 'searchFrom' : 'searchTo').value = name;
  closeAllStationDropdowns();
}

function stationKeyNav(e, type) {
  const dropdownId = type === 'from' ? 'fromDropdown' : 'toDropdown';
  const dropdown = el(dropdownId);
  if (!dropdown.classList.contains('open')) return;

  const options = dropdown.querySelectorAll('.station-option');
  if (!options.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    kbdIndex[type] = Math.min(kbdIndex[type] + 1, options.length - 1);
    updateKbdActive(options, kbdIndex[type]);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    kbdIndex[type] = Math.max(kbdIndex[type] - 1, 0);
    updateKbdActive(options, kbdIndex[type]);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (kbdIndex[type] >= 0 && options[kbdIndex[type]]) {
      const name = options[kbdIndex[type]].dataset.name;
      selectStation(type, name);
    } else {
      closeAllStationDropdowns();
    }
  } else if (e.key === 'Escape') {
    closeAllStationDropdowns();
  }
}

function updateKbdActive(options, idx) {
  options.forEach(o => o.classList.remove('kbd-active'));
  if (idx >= 0) {
    options[idx].classList.add('kbd-active');
    options[idx].scrollIntoView({ block: 'nearest' });
  }
}

function closeAllStationDropdowns() {
  document.querySelectorAll('.station-dropdown').forEach(d => d.classList.remove('open'));
  kbdIndex = { from: -1, to: -1 };
}

// Close on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.station-picker') && !e.target.closest('.sf-body')) {
    closeAllStationDropdowns();
  }
});