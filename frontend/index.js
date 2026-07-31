const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const cityForm = document.getElementById("city-form");
const weatherApp = document.getElementById("weather-app");

const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");
const loginMsg = document.getElementById("login-msg");

const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerBtn = document.getElementById("register-btn");
const registerMsg = document.getElementById("register-msg");

const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");

const subscribeBtn = document.getElementById("subscribe-btn");
const subscribeMsg = document.getElementById("subscribe-msg");

const cityInput = document.getElementById("weather-city-input");
const getWeatherBtn = document.getElementById("get-weather-btn");
const weatherInfo = document.getElementById("weather-info");
const cityNameDisplay = document.getElementById("city-name");
const temperatureDisplay = document.getElementById("temperature");
const descriptionDisplay = document.getElementById("description");
const errorMessage = document.getElementById("error-message");
const cityInput2 = document.getElementById("weather-city-input-2");

const API_KEY = "8b4ac15716b7bc9c802084a4315c951b";
const UNSPLASH_KEY = "TEOdZBtu2HWoOAZYNwtY-sep_zg9rD32WhNu_iUt3oM";

showRegister.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

showLogin.addEventListener("click", () => {
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

registerBtn.addEventListener("click", async () => {
  const email = registerEmail.value.trim();
  const password = registerPassword.value.trim();

  if(!email || !password){
    registerMsg.textContent = "Email and password required!";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/v1/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    registerMsg.textContent = data.message;

    if(res.ok){
      registerEmail.value = "";
      registerPassword.value = "";
      registerMsg.textContent = "Registered! Please login now.";
      setTimeout(() => {
        registerForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
        loginMsg.textContent = "";
      }, 1500);
    }

  } catch(err){
    console.error(err);
    registerMsg.textContent = "Registration failed. Try again.";
  }
});


loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if(!email || !password){
    loginMsg.textContent = "Email and password required!";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if(!res.ok){
      if(res.status === 404){
        loginMsg.textContent = "You are not registered. Please register first.";
      } else if(res.status === 401){
        loginMsg.textContent = "Invalid credentials.";
      } else {
        loginMsg.textContent = "Login failed. Try again.";
      }
      return;
    }

    loginMsg.textContent = "Login successful!";
    localStorage.setItem("token", data.accessToken);
    loginEmail.value = "";
    loginPassword.value = "";

    cityForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

  } catch(err){
    console.error(err);
    loginMsg.textContent = "Login failed. Try again.";
  }
});


subscribeBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  const token = localStorage.getItem("token");

  if(!city || !token){
    subscribeMsg.textContent = "Please enter city and login first!";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/v1/users/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ city }),
    });
    const data = await res.json();
    subscribeMsg.textContent = data.message;

    if(res.ok){
      cityForm.classList.add("hidden");
      weatherApp.classList.remove("hidden");
    }

  } catch(err){
    console.error(err);
    subscribeMsg.textContent = "Subscription failed.";
  }
});


getWeatherBtn.addEventListener("click", async () => {
  const city = cityInput2.value.trim();
  if(!city) return;

  try {
    const data = await fetchWeatherData(city);
    displayWeatherData(data);
  } catch(err){
    console.log(err.message);
    errorMessage.textContent = err.message;
    showError();
  }
});

async function fetchWeatherData(city){
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
    const data = await res.json();
 console.log("Weather API response:", data); 

  if(!res.ok) throw new Error(data.message);

  return data;

}

async function getCityImage(query){
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_KEY}`);
    const data = await res.json();

    if(data.results && data.results.length > 0){
      return data.results[0].urls.regular;
    }

    return `https://source.unsplash.com/1600x900/?nature,landscape`;

  } catch(err){
    console.log("Image fetch error:", err);

    return `https://source.unsplash.com/1600x900/?sky,weather`;
  }
}

async function displayWeatherData(data){
  const {name, main, weather} = data;
  cityNameDisplay.textContent = name;
  temperatureDisplay.textContent = `Temperature: ${main.temp}°C`;
  descriptionDisplay.textContent = `Weather: ${weather[0].description}`;

  let condition = weather[0].main.toLowerCase();
  let bgQuery = `${name} city`;
  const hour = new Date().getHours();

  if(condition.includes("rain") || condition.includes("drizzle")) bgQuery += " rain";
  else if(condition.includes("clear")) bgQuery += " sunny";
  else if(condition.includes("cloud")) bgQuery += " cloudy";

  if(hour >= 18 || hour <= 6) bgQuery += " night";

  const img = await getCityImage(bgQuery);
  document.body.style.backgroundImage = `url(${img})`;
  document.body.style.backgroundColor = (hour >= 18 || hour <= 6) ? "#0b0f1a" : "#87ceeb";

  weatherInfo.classList.remove("hidden");
  errorMessage.classList.add("hidden");
}

function showError(){
  weatherInfo.classList.add("hidden");
  errorMessage.classList.remove("hidden");
}