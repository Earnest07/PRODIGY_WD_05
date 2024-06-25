const searchCity = document.getElementById("search-city");
const heroTemperature = document.getElementById("hero-temperature");
const cityName = document.getElementById("city-name");
const chanceOfRain = document.getElementById("chance-of-rain");
const mainImage = document.getElementById("main-img");
const forecastList = document.getElementById("forecast-list");
const realFeel = document.getElementById("real-feel");
const wind = document.getElementById("wind");
const chance = document.getElementById("chance");
const uvIndex = document.getElementById("uv-index");
const daysContainer = document.getElementById("days-container");

let imageToSet;
let returnImage;

const displayImage = async (weatherStatus) => {
  if (weatherStatus === "Cloudy") {
    returnImage = "./images/cloudy.png";
  } else if (weatherStatus === "Rain") {
    returnImage = "./images/rainy.png";
  } else if (weatherStatus === "Sunny") {
    returnImage = "./images/sun.png";
  } else if (weatherStatus === "Snow") {
    returnImage = "./images/snow.png";
  } else if (weatherStatus === "Clear") {
    returnImage = "./images/haze.png";
  } else if (weatherStatus === "Stormy") {
    returnImage = "./images/stormy.png";
  } else {
    returnImage = "./images/partly-cloudy.png";
  }
  console.log(weatherStatus);

  return returnImage;
};

const appendForecast = async (data) => {
  forecastList.innerHTML = "";

  for (let i = 0; i < data.forecast.forecastday[0].hour.length; i++) {
    if (i % 4 === 0) {
      const li = document.createElement("li");
      li.classList.add("forecast-item");

      const timing = document.createElement("div");
      timing.classList.add("timing");
      timing.textContent =
        data.forecast.forecastday[0].hour[i].time.split(" ")[1] +
        (data.forecast.forecastday[0].hour[i].time.split(" ")[1].split(":")[0] <
        12
          ? " AM"
          : " PM");

      const img = document.createElement("img");
      img.classList.add("forecast-img");
      img.setAttribute(
        "src",
        await displayImage(data.forecast.forecastday[0].hour[i].condition.text)
      );
      img.setAttribute("width", "40");
      const degree = document.createElement("div");
      degree.classList.add("forecast-degree");
      degree.innerHTML = `${data.forecast.forecastday[0].hour[i].temp_c}&deg;C.`;

      li.appendChild(timing);
      li.appendChild(img);
      li.appendChild(degree);

      forecastList.appendChild(li);
    }
  }
};

const updateAirConditioning = async (data1, data2) => {
  realFeel.innerHTML = data1.current.humidity + "%";
  wind.innerHTML = data1.current.wind_kph + " km/h";
  //   chance.innerHTML = data2.forecast.forecastday[0].hour[1].will_it_rain + "%";
  uvIndex.innerHTML = data1.current.uv;
};

const giveDay = async (number) => {
  if (number === 0) return "Today";
  else if (number === 1) return "Tue";
  else if (number === 2) return "Wed";
  else if (number === 3) return "Thu";
  else if (number === 4) return "Fri";
  else if (number === 5) return "Sat";
  else if (number === 6) return "Sun";
  else return "No day";
};

const updateDaysContainer = async (data1, data2) => {
  daysContainer.innerHTML = "";
  for (let i = 0; i < data2.forecast.forecastday.length; i++) {
    const li = document.createElement("li");
    li.classList.add("days-item");

    const day = document.createElement("div");
    day.classList.add("day-name");
    day.innerHTML = await giveDay(i);

    const dayIconWeather = document.createElement("div");
    dayIconWeather.classList.add("day-icon-weather");

    const dayIcon = document.createElement("img");
    dayIcon.classList.add("day-icon");
    imageToSet = await displayImage(
      data2.forecast.forecastday[i].hour[0].condition.text
    );
    dayIcon.setAttribute("src", imageToSet);

    const dayWeather = document.createElement("div");
    dayWeather.classList.add("day-weather");
    dayWeather.textContent =
      data2.forecast.forecastday[i].hour[0].condition.text;

    dayIconWeather.appendChild(dayIcon);
    dayIconWeather.appendChild(dayWeather);

    const dayDegree = document.createElement("div");
    dayIconWeather.classList.add("day-degree");

    const highDegree = document.createElement("div");
    highDegree.classList.add("high-degree");
    highDegree.textContent =
      data2.forecast.forecastday[i].day.maxtemp_c + " / ";

    const lowDegree = document.createElement("div");
    lowDegree.classList.add("low-degree");
    lowDegree.textContent = data2.forecast.forecastday[i].day.mintemp_c;

    dayDegree.appendChild(highDegree);
    dayDegree.appendChild(lowDegree);

    li.appendChild(day);
    li.appendChild(dayIconWeather);
    li.appendChild(dayDegree);

    daysContainer.appendChild(li);
  }
};

const currentWeatherData = async () => {
  let baseURL = "http://api.weatherapi.com/v1";
  let apiKey = "be210523925a44e4964140929242406";
  //   let queryParams = "Paris";
  let queryParams = searchCity.value;
  let url = `${baseURL}/current.json?key=${apiKey}&q=${queryParams}`;
  let forecastUrl = `${baseURL}/forecast.json?key=${apiKey}&q=${queryParams}&days=7`;

  try {
    const response1 = await fetch(url);
    const response2 = await fetch(forecastUrl);

    // if (!response1.ok || !response2.ok) {
    //   throw new Error(
    //     `HTTP error! Status: ${response1.status || response2.status}`
    //   );
    // }
    const data1 = await response1.json();
    const data2 = await response2.json();

    // const response1 = await fetch("../json/current.json");
    // const data1 = await response1.json();
    // const response2 = await fetch("../json/forecast.json");
    // const data2 = await response2.json();
    heroTemperature.innerHTML = `${data1.current.temp_c}&deg;C.`;
    cityName.innerHTML = queryParams;
    chanceOfRain.innerHTML =
      "Chance of rain : " +
      data2.forecast.forecastday[0].hour[0].chance_of_rain +
      "%";

    imageToSet = await displayImage(data1.current.condition.text);
    mainImage.setAttribute("src", `${imageToSet}`);

    console.log(data2);
    appendForecast(data2);
    updateAirConditioning(data1, data2);
    updateDaysContainer(data1, data2);
  } catch (error) {
    console.log(error);
  }
};

// currentWeatherData();
