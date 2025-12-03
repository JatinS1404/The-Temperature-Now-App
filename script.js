const apiKey = "5a3000407c069433456f4a3e9061e880"; // Replace with your key

const weatherInfo = document.getElementById("weatherInfo");
const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const icon = document.getElementById("weatherIcon");
const errorMsg = document.getElementById("error");
const cityInput = document.getElementById("cityInput");
const suggestionsList = document.getElementById("suggestions");

// --- Auto-suggest ---
cityInput.addEventListener("input", () => {
  const query = cityInput.value.toLowerCase();
  suggestionsList.innerHTML = "";
  if (!query) return;
  const matches = cities.filter(city => city.toLowerCase().startsWith(query));
  matches.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => {
      cityInput.value = city;
      suggestionsList.innerHTML = "";
    });
    suggestionsList.appendChild(li);
  });
});

// --- Weather API ---
async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError("City not found or API limit reached.");
  }
}

function displayWeather(data) {
  errorMsg.textContent = "";
  weatherInfo.classList.remove("hidden");

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temp.textContent = data.main.temp.toFixed(1);
  description.textContent = data.weather[0].description;
  humidity.textContent = data.main.humidity;
  wind.textContent = data.wind.speed;
  icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  updateBackground(data.weather[0].main);
}

function showError(message) {
  weatherInfo.classList.add("hidden");
  errorMsg.textContent = message;
}

// --- Dynamic background ---
function updateBackground(condition) {
  let gradient;
  switch(condition.toLowerCase()) {
    case "clear": gradient = "linear-gradient(to right, #fceabb, #f8b500)"; break;
    case "clouds": gradient = "linear-gradient(to right, #bdc3c7, #2c3e50)"; break;
    case "rain": gradient = "linear-gradient(to right, #4e54c8, #8f94fb)"; break;
    case "snow": gradient = "linear-gradient(to right, #e6dada, #274046)"; break;
    case "thunderstorm": gradient = "linear-gradient(to right, #141e30, #243b55)"; break;
    default: gradient = "linear-gradient(to right, #00b4db, #0083b0)";
  }
  document.body.style.background = gradient;
}