document.getElementById("getWeather").addEventListener("click", () => {
    if (navigator.geolocation) {
        document.getElementById("loader").style.display = "block";
        
        navigator.geolocation.getCurrentPosition(showWeather, showError, {
            enableHighAccuracy: true,  // Get precise location
            timeout: 15000,  // Increased timeout for better accuracy
            maximumAge: 0
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

document.getElementById("searchWeather").addEventListener("click", () => {
    let city = document.getElementById("cityInput").value;
    if (city) {
        getWeatherByCity(city);
    } else {
        alert("Please enter a city name.");
    }
});

function showWeather(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiKey = "b152aeac68040d0146618fb19f0125ea";

    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetchWeather(url);
}

// 🆕 Backup method: Use IP-based geolocation if GPS fails
function getLocationByIP() {
    fetch("https://ipapi.co/json/")
        .then(response => response.json())
        .then(data => {
            let lat = data.latitude;
            let lon = data.longitude;
            let apiKey = "b152aeac68040d0146618fb19f0125ea";
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            fetchWeather(url);
        })
        .catch(error => {
            alert("Error fetching location by IP.");
            console.error(error);
            document.getElementById("loader").style.display = "none";
        });
}

function getWeatherByCity(city) {
    let apiKey = "b152aeac68040d0146618fb19f0125ea";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetchWeather(url);
}

function fetchWeather(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("loader").style.display = "none";
            if (data.cod === "404") {
                alert("City not found! Please try again.");
                return;
            }
            let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

            let weatherInfo = `
                <h2>📍 ${data.name}, ${data.sys.country}</h2>
                <img src="${icon}" alt="Weather Icon">
                <p>🌡 Temperature: ${data.main.temp}°C</p>
                <p>🌦 Weather: ${data.weather[0].description}</p>
                <p>💧 Humidity: ${data.main.humidity}%</p>
                <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
            `;
            document.getElementById("weatherDetails").innerHTML = weatherInfo;
        })
        .catch(error => {
            alert("Error fetching weather data.");
            console.error(error);
            document.getElementById("loader").style.display = "none";
        });
}

function showError(error) {
    document.getElementById("loader").style.display = "none";
    
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("⚠ Location access denied. Using IP-based location.");
            getLocationByIP();  // Fallback to IP location
            break;
        case error.POSITION_UNAVAILABLE:
            alert("⚠ Location unavailable. Using IP-based location.");
            getLocationByIP();
            break;
        case error.TIMEOUT:
            alert("⚠ Location request timed out. Using IP-based location.");
            getLocationByIP();
            break;
        default:
            alert("⚠ Unknown location error. Using IP-based location.");
            getLocationByIP();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    function updateDateTime() {
        let now = new Date();
        
        // Format Time
        let formattedTime = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });

        // Format Date
        let formattedDate = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        // Display Time and Date in separate lines
        document.getElementById("dateTime").innerHTML = `
            <strong>${formattedTime}</strong> <br>
            <small>${formattedDate}</small>
        `;
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();
});
