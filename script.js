// --- 1. CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyDM_hkSo9iK52gmvQxuZYi7FdlmH5Hi06w",
  authDomain: "svit-bus-tracker.firebaseapp.com",
  databaseURL: "https://svit-bus-tracker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "svit-bus-tracker",
  storageBucket: "svit-bus-tracker.firebasestorage.app",
  messagingSenderId: "1048216137167",
  appId: "1:1048216137167:web:39a1544dfb767eca8676ba",
  measurementId: "G-RS327GDWPH"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// --- 2. OFFICIAL SVIT ROUTE DATA (JAN 2026) ---
// Format: "Route Number": ["Start Point", "Stop 1", "Stop 2", ... "End Point"]
const routeData = {
    "A-01 (Dumad Chowkdi)": ["Dumad Chowkdi", "SVIT Campus"],
    "A-02 (Gurukul)": ["Gurukul", "Parivar Char Rasta", "Mahesh Complex", "Kaladarshan", "SVIT Campus"],
    "A-03 (Anand Nagar)": ["Jivan Bharti School", "Muktanand", "Ambalal Park", "Charbhuja Complex", "Anand Nagar", "SVIT Campus"],
    "A-04 (Amit Nagar)": ["Amit Nagar", "Amrapali", "Dumad Chowkdi", "SVIT Campus"],
    "A-05 (Seven Seas)": ["Bright School", "L&T Circle", "EME Circle", "Udipi", "Seven Seas Mall", "SVIT Campus"],
    "A-06 (Airport Circle)": ["Moti Nagar", "Shiv Vatika", "Sangam", "Meera Park", "Airport Circle", "Sama Savli Road", "Dumad Chowkdi", "SVIT Campus"],
    "A-07 (Manek Park)": ["Punam Complex", "Ayurvedic Hospital", "Surya Nagar", "Mahavir Hall", "Manek Park", "SVIT Campus"],
    "A-08 (Harni Warasiya)": ["Kamla Nagar", "Sayaji Bus Stop", "Sardar Estate", "Khodiyar Nagar", "Petrol Pump", "Harni CBSE School", "SVIT Campus"],
    "A-09 (Uma Char Rasta)": ["Lad Bhawan", "Reliance", "Vrundavan", "Prabhat", "Zaver Nagar", "Uma Char Rasta", "SVIT Campus"],
    "A-10 (Karelibaug)": ["Kishan Vadi", "Karelibaug Water Tank", "SVIT Campus"],
    "A-11 (Gorwa ITI)": ["Gorwa ITI", "Sahyog", "Panchvati", "SVIT Campus"],
    "A-12 (Laxmipura)": ["Zydex", "Yash Complex", "Iscon Height", "Amin Party Plot", "Laxmipura Circle", "SVIT Campus"],
    "A-13 (Gorwa Workshop)": ["Natubhai Center", "Ellora Park", "Kalptaru", "Cash & Carry", "Panch Ratna", "Gorwa Workshop", "SVIT Campus"],
    "A-14 (Pushpak)": ["Samta", "Pavan Dham", "Aakanksha Duplex", "Pushpak Township", "SVIT Campus"],
    "A-15 (Parle Point)": ["Pratham Complex", "Iscon Temple", "Harinagar Char Rasta", "Rajesh Tower", "Raneshwar Temple", "Jhansi Ki Rani (Parle Point)", "SVIT Campus"],
    "A-16 (Vasna Road)": ["Panchmukhi Hanuman", "Bansal Store", "Time Circle", "Swaminarayan Temple", "D-Mart", "Taksh Complex", "Beena Nagar", "SVIT Campus"],
    "A-17 (Vasna-Bhayli)": ["Vishwamitri Road", "Muj Mahuda", "Akshar Chowk", "Meghdhanush", "Manisha Chokdi", "Tube Co.", "Hanuman Mandir", "Havmore", "Malhar Point", "Genda Circle", "GSFC", "SVIT Campus"],
    "A-18 (Akota)": ["Vishwamitri Road", "Munj Mahuda", "Miraj Tower", "Akota Garden", "Urmi Char Rasta", "Haveli", "Keya Motors", "Rama Kaka Deri", "SVIT Campus"],
    "A-19 (Makarpura)": ["Gayatrinagar", "Voltamp", "Maneja", "LMP Makarpura", "Novino", "Sussen", "GIDC", "Vadsar Bridge", "Kalali Crossing", "SVIT Campus"],
    "A-20 (Manjalpur A)": ["Sai Chowkdi", "Manjalpur", "Darbar Chowkdi", "Ramesh Patel Estate", "Tulsidham", "Reliance Circle", "Lalbag Bridge", "Motibag", "Kalaghoda", "SVIT Campus"],
    "A-21 (Manjalpur B)": ["Baroda Dairy", "Kabir Complex", "Deep Chambers", "Manjalpur Naka", "Lalbag Bridge", "Motibag", "Rajmahal Road", "Narhari Hospital", "Chhani Jakat Naka", "SVIT Campus"],
    "A-22 (Tarsali)": ["Ganga Sagar", "Tarsali Market", "Sai Temple", "Sharad Nagar", "ONGC", "Baroda Dairy", "Indra Complex", "Reliance Circle", "Maharani Nursing", "Kalaghoda", "SVIT Campus"],
    "A-23 (Kirti Stambh)": ["Kabir Complex", "Tulsidham", "Saraswati Complex", "Tapan", "Darbar Chowkdi", "Railway Crossing", "Lalbag", "Kirti Stambh", "Saffron Tower", "Chhani Jakat Naka", "SVIT Campus"],
    "A-24 (Saffron Tower)": ["Tapans", "Ramesh Patel Estate", "Saraswati Complex", "Tulsidham", "Deep Chambers", "Reliance Circle", "Motibag", "Kalaghoda", "Saffron Tower", "SVIT Campus"],
    "A-25 (Pologround)": ["Goya Gate", "Gangotri", "Navapura Police Stn", "Jayratna Bldg", "Pologround", "Kirtistambh", "SVIT Campus"],
    "A-26 (Sama Garden)": ["Sama Garden", "Chanakyapuri", "Swati Society", "Abhilasha Char Rasta", "SVIT Campus"],
    "AR-A-01 (Architecture 1)": ["Raneshwar", "Swaminarayan Temple", "Harinagar", "Natubhai Circle", "Trident", "Genda Circle", "Fatehgunj", "Chhani Jakat Naka", "SVIT Campus"],
    "AR-A-02 (Architecture 2)": ["Kaladarshan", "Uma Char Rasta", "Sangam", "Karelibaug Tank", "Amit Nagar", "Sama Garden", "Chanakyapuri", "SVIT Campus"]
};

// Official Bus Registration Numbers (GJ-06 & GJ-23)
const busNumbers = [
    "GJ-06-XX-1111", "GJ-06-XX-2222", "GJ-06-XX-3333", "GJ-06-XX-4444",
    "GJ-06-XX-5555", "GJ-23-Y-9599", "GJ-23-AW-0090", "GJ-23-Y-9959",
    "GJ-23-AT-9972", "GJ-23-AW-0900", "GJ-23-AT-0900", "GJ-23-AW-0909",
    "GJ-23-AT-0909", "GJ-23-AW-9729", "GJ-23-AW-9279", "GJ-23-AY-2799",
    "GJ-23-AY-3699", "GJ-23-AY-4599", "GJ-23-AY-5499", "GJ-23-AY-7299"
];

// --- 3. POPULATE DROPDOWNS ---
window.onload = function() {
    const routeSelect = document.getElementById('routeSelect');
    const busSelect = document.getElementById('busSelect');

    // Fill Routes
    for (const [routeName, stops] of Object.entries(routeData)) {
        let opt = document.createElement('option');
        opt.value = routeName;
        opt.innerText = routeName;
        routeSelect.appendChild(opt);
    }

    // Fill Bus Numbers
    busNumbers.forEach(bus => {
        let opt = document.createElement('option');
        opt.value = bus;
        opt.innerText = bus;
        busSelect.appendChild(opt);
    });

    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
};

// --- 4. APP LOGIC ---
let watchId = null;
let currentBus = "";
let currentRouteKey = "";
let wakeLock = null;

async function startTrip() {
    const bus = document.getElementById('busSelect').value;
    const routeKey = document.getElementById('routeSelect').value;
    const pass = document.getElementById('password').value;

    if (!bus || !routeKey) { alert("Please select Bus and Route!"); return; }
    if (pass !== "123456") { alert("Incorrect Password!"); return; }

    currentBus = bus;
    currentRouteKey = routeKey;
    const stopsList = routeData[routeKey]; // Get the list of stops

    // SWITCH TO DASHBOARD
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('dashboardScreen').classList.remove('hidden');

    // SHOW ROUTE DETAILS ON DASHBOARD
    document.getElementById('liveBus').innerText = bus;
    document.getElementById('liveRoute').innerText = routeKey;
    
    // Display the Full Stops List for the Driver
    document.getElementById('routeStops').innerText = "Stops: " + stopsList.join(" ➝ ");

    // START PWA BACKGROUND TASKS
    document.getElementById('silentAudio').play().catch(e => console.log("Click needed"));
    if ('wakeLock' in navigator) {
        try { wakeLock = await navigator.wakeLock.request('screen'); } 
        catch (err) { console.log("Wake Lock Error", err); }
    }

    // START GPS TRACKING
    const geoOptions = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
    watchId = navigator.geolocation.watchPosition(updateLocation, handleError, geoOptions);
}

function updateLocation(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const speed = position.coords.speed ? (position.coords.speed * 3.6).toFixed(1) : 0;

    document.getElementById('gpsStatus').innerHTML = "🟢 <span class='pulse-icon'></span> GPS Live";
    document.getElementById('gpsStatus').style.color = "green";
    document.getElementById('speedDisplay').innerText = speed + " km/h";

    const now = new Date();
    document.getElementById('updateTime').innerText = now.getHours() + ":" + (now.getMinutes()<10?'0':'') + now.getMinutes();

    // UPDATE FIREBASE WITH FULL ROUTE INFO
    db.ref('activeBuses/' + currentRouteKey).set({
        busNumber: currentBus,
        stops: routeData[currentRouteKey], // Send full stops to database too
        lat: lat,
        lng: lng,
        speed: speed,
        lastUpdated: Date.now()
    });
}

function handleError(error) {
    document.getElementById('gpsStatus').innerText = "🔴 GPS Lost: " + error.message;
    document.getElementById('gpsStatus').style.color = "red";
}

function endTrip() {
    if (confirm("End this trip?")) {
        db.ref('activeBuses/' + currentRouteKey).remove();
        if (watchId) navigator.geolocation.clearWatch(watchId);
        if (wakeLock) wakeLock.release();
        location.reload();
    }
}