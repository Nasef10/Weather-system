const APIKey = "47625da06d634d50a34131956240412";
const baseURL = "https://api.weatherapi.com/v1/forecast.json";


const findInput = document.querySelector("#findInput");
const forecastContainer = document.querySelector("#weather-cards");

// Fetch Weather Data
async function fetchWeather(city) {
  try {
    const response = await fetch(`${baseURL}?key=${APIKey}&q=${city}&days=3`);
    if (response.ok) {
      return await response.json();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to fetch weather data.",
      });
      return null;
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Something went wrong. Please try again later.",
    });
    return null;
  }
}

// Render Weather Data
async function displayWeather(city) {
  const data = await fetchWeather(city);
  if (!data) {
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Unable to fetch weather data!",
    });
    return;
  }

  const { location, forecast: forecastData } = data;
  forecastContainer.innerHTML = "";

  forecastData.forecastday.forEach((day) => {
    const dayName = new Date(day.date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const card = `
      <div class="col-lg-4 mb-4 card-info ">
        <div class="card h-100 rounded-4 ">
          <div class="card-header text-center text-white rounded-4 p-4">
            <h5>${dayName}</h5>
            <p>${new Date(day.date).toLocaleDateString()}</p>
          </div>
          <div class="card-body bg-light text-center rounded-4">
            <h6 class="location">${location.name}, ${location.country}</h6>
            <p class="temperature">${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C</p>
            <img src="https:${day.day.condition.icon}" alt="Weather Icon" />
            <p class="condition">${day.day.condition.text}</p>
          </div>
          <div class="wind  p-2 mx-auto">
         <img src="https://routeweather.netlify.app/images/icon-wind.png" alt="">
          <span>Wind: ${day.day.maxwind_kph} km/h</span>
          </div>
          <div class="humidity p-2 mx-auto">
                    
              <span>Humidity: ${day.day.avghumidity}%</span>
          </div>
          
        </div>
      </div>
    `;
    forecastContainer.innerHTML += card;
  });

  Swal.fire({
    icon: "success",
    title: "Success!",
    text: `Weather data for ${city} has been loaded successfully.`,
    timer: 2000,
    showConfirmButton: false,
  });
}

// Get User's Current Location
function fetchWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const location = `${latitude},${longitude}`;
        displayWeather(location);
      },
      (error) => {
        Swal.fire({
          icon: "warning",
          title: "Location Error",
          text: "Unable to access your location. Showing default weather.",
        });
        displayWeather("Cairo"); // Default location if geolocation fails
      }
    );
  } else {
    Swal.fire({
      icon: "error",
      title: "Geolocation Unsupported",
      text: "Geolocation is not supported by this browser. Showing default weather.",
    });
    displayWeather("Cairo");
  }
}

// Search Weather as User Types
findInput.addEventListener("input", () => {
  const city = findInput.value.trim();
  if (city) {
    displayWeather(city);
  } else {
    fetchWeatherByLocation(); // Show user's current location weather
  }
});

// Default Weather on Load
window.onload = fetchWeatherByLocation;
