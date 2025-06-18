document.getElementById("track-btn").addEventListener("click", async function(event) {
    event.preventDefault();

    let phoneNumber = document.getElementById("tracking-number").value.trim();
    let trackingInfo = document.getElementById("tracking-info");
    let loading = document.getElementById("loading");
    let mapContainer = document.getElementById("map");

    loading.style.display = "block";
    trackingInfo.style.display = "none";

    // Validate SA number
    let saNumberPattern = /^((\+27|0)[6-8][0-9]{8})$/;
    if (!saNumberPattern.test(phoneNumber)) {
        loading.style.display = "none";
        trackingInfo.style.display = "block";
        trackingInfo.innerHTML = "<p style='color: red;'>Invalid South African phone number.</p>";
        return;
    }

    let locationData = {};
    let phoneStatus = "Inactive";
    let deviceInfo = {};

    // Live tracking
    if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
            (position) => {
                locationData.latitude = position.coords.latitude;
                locationData.longitude = position.coords.longitude;
                locationData.method = "GPS Live Tracking";
                phoneStatus = "Active";
                deviceInfo.lastUpdated = new Date().toLocaleString();

                updateTrackingInfo(phoneNumber, phoneStatus, locationData, deviceInfo);
                loadMap(locationData.latitude, locationData.longitude);
            },
            (error) => {
                fetch("https://ip-api.com/json")
                    .then(response => response.json())
                    .then(data => {
                        locationData.city = data.city;
                        locationData.country = data.country;
                        locationData.method = "IP-based tracking";
                        phoneStatus = "Active";
                        deviceInfo.lastUpdated = new Date().toLocaleString();

                        updateTrackingInfo(phoneNumber, phoneStatus, locationData, deviceInfo);
                    })
                    .catch(err => {
                        trackingInfo.style.display = "block";
                        trackingInfo.innerHTML = "<p style='color: red;'>Unable to track phone location.</p>";
                    });
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0
            }
        );
    }
});

function updateTrackingInfo(phoneNumber, phoneStatus, locationData, deviceInfo) {
    let trackingInfo = document.getElementById("tracking-info");
    trackingInfo.style.display = "block";

    trackingInfo.innerHTML = `
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Status:</strong> ${phoneStatus}</p>
        <p><strong>Last Updated:</strong> ${deviceInfo.lastUpdated || "Unknown"}</p>
        <p><strong>Location:</strong> ${phoneStatus === "Active"
            ? (locationData.method.includes("GPS")
                ? `Latitude: ${locationData.latitude}, Longitude: ${locationData.longitude}`
                : `${locationData.city}, ${locationData.country}`)
            : "Unknown - Tracking Unavailable"}</p>
        <p><strong>Tracking Method:</strong> ${locationData.method || "None"}</p>
    `;
}

// Toggle dark mode
document.getElementById("toggle-mode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Load Google Maps
function loadMap(lat, lon) {
    let mapContainer = document.getElementById("map");
    mapContainer.style.display = "block";
    mapContainer.innerHTML = `<iframe 
        width="100%" height="300"
        src="https://maps.google.com/maps?q=${lat},${lon}&output=embed">
    </iframe>`;
}

// Placeholder for SMS/email notifications
function sendNotification(phoneNumber) {
    console.log(`Sending notification for active phone: ${phoneNumber}`);
}

// Register Service Worker for offline support
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").then(() => {
        console.log("Service Worker Registered");
    });
}
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker Registered"))
        .catch(err => console.error("Service Worker Error", err));
}
