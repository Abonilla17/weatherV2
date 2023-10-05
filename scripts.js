// Declare variables
let latitude;
let longitude;
const alertTitle = document.getElementById("alertTitle");
const body = document.getElementById("body");
const pictureSize = "medium";
var temperatureInput= "";
var humidity1 = "";
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
console.log(isDarkMode);
const rainChanceIcon = document.getElementById("rainChanceIcon");
const windForecast = document.getElementById("windForecast");
const windDirection = document.getElementById("windDirection");
let indexNumber = 0;
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        // Callback function to handle successful retrieval of location data
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const alertTitle = document.getElementById("alertTitle");
        if (alertTitle) {
          alertTitle.style.display = "block";
        }
        // Now call the weather functions with the obtained latitude and longitude
        getWeather(latitude, longitude);
      //  getHourlyWeather(latitude, longitude);
      //  getHourlyWeather2(latitude, longitude);
      //  getHourlyWeather3(latitude, longitude);
        body.style.display = "block";
      },
      function(error) {
        // Callback function to handle errors
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert(`User denied the geolocation request.`);
            break;
          case error.POSITION_UNAVAILABLE:
            alert(`Location information is unavailable.`);
            alert(`This may be because you have denied location access in your operating system settings.`);
            break;
          case error.TIMEOUT:
            alert(`The request to get user location timed out.`);
            break;
          default:
            alert(`An unknown error occurred.`);
            break;
        }
      }
    );
  } else {
    alert(`Geolocation is not supported by this browser.`);
  }
}


// Fetch the weather data based on the latitude and longitude
 function getWeather(latitude, longitude) {
  const weatherForecast = document.getElementById("weather");
const city = document.getElementById("city");
const state = document.getElementById("state");
const alerts = document.getElementById("weatherAlerts");
const temperature = document.getElementById("temperature");
const winds = document.getElementById("winds");
const rainChance = document.getElementById("rainChance");
const icon = document.getElementById("weatherIcon");
const shortForecast = document.getElementById("shortForecast");
const weatherValidTime = document.getElementById("weatherValidTime");
const forecastFor = document.getElementById("weatherFor");
const feelsLIke = document.getElementById(`feelsLike`);
const noAlerts = document.getElementById('noAlerts');
const inApplicable = document.getElementById('inApplicable');
let iconImage = "";
const futureForecast = document.getElementById("futurePeriods");
const feelsLikeCalculationElement = document.getElementById("feelsLikeCalculation");
const rainPercentage = document.getElementById("rainPercent");
const rainChanceIcon = document.getElementById("rainChanceIcon");
rainChanceIcon.style.display = "inline-block";
rainPercentage.style.display = "inline-block";
const weatherdata = `https://api.weather.gov/points/${latitude},${longitude}`;
  fetch(weatherdata)
  .then(response => {
    console.log(`Api response code is ` +  response.status);
    if (response.status === 500) {
      getWeather(latitude, longitude);
      throw new Error('Internal Server Error');
    }    
    return response.json();
  })
  .then(data => {
    console.log(data);
    city.innerHTML = ` City = ${data.properties.relativeLocation.properties.city}`;
    state.innerHTML = ` State = ${data.properties.relativeLocation.properties.state}`;
    const weatherAlerts = `https://api.weather.gov/alerts/active?area=${data.properties.relativeLocation.properties.state}`;
    //   const cityName = 'Big Island Summit';
    const cityName = data.properties.relativeLocation.properties.city;
       console.log(cityName);
       console.log(weatherAlerts);
       fetch(weatherAlerts)
       .then(response => {
        console.log(`Api response code is ` +  response.status);
        if (response.status === 500) {
          getWeather(latitude, longitude);
          throw new Error('Internal Server Error');
        }    
        return response.json();
      })
         .then(alertData => {
           console.log(alertData);
           const alertTime = alertData.updated;
           console.log(alertTime);
           const correctTime = new Date(alertTime);
           const readableDateTime = correctTime.toISOString();
           console.log(readableDateTime);
           alerts.innerHTML = `There are currently no active weather alerts as of ${correctTime}`;
           console.log(alertData.features.length);
           if(alertData.features.length > 0 && alertData.features[indexNumber].properties.headline != undefined) {
             if (alertData.features.length > 0) {
               alerts.innerHTML = ''; // Clear any existing content before appending new alerts
               for (let i = 0; i < alertData.features.length; i++) {
                 const activeAlerts = alertData.features[i].properties.headline;
                 
                 const alertDescription = alertData.features[i].properties.description;
                 const areaDescription = alertData.features[i].properties.areaDesc;
                 if (areaDescription.includes(cityName)) {
                   alerts.innerHTML += `This weather alert is applicable to you in: ${cityName}<br>`;
                 } else {
                   alerts.innerHTML += `This weather alert is inapplicable to you in  ${cityName}<br>`;
                 }
                 alerts.innerHTML += activeAlerts + `<br>`;
                 alerts.innerHTML += `Applicable to ${areaDescription}  <br>`;
                 alerts.innerHTML += alertDescription + `<br>`;
                 alerts.innerHTML += `<br>`;
                 alerts.classList.add('alert');
                 alerts.classList.add('alert-info');        
               }
             } else {
               alerts.innerHTML = `There are currently no active weather alerts as of ${correctTime}`;
             }
           }            
         });
         fetch(data.properties.forecast)
         .then(response => {
          console.log(`Api response code is ` +  response.status);
          if (response.status === 500) {
            getWeather(latitude, longitude);
            throw new Error('Internal Server Error');
          }    
          return response.json();
        })
         .then(data2 => {
           console.log(data2);
           console.log(data2.properties.periods[indexNumber].probabilityOfPrecipitation.value);
            const isDaytime = data2.properties.periods[indexNumber].isDaytime;
            console.log(data2.properties.periods[indexNumber].isDaytime)
            const futurePeriodsLength = data2.properties.periods.length;
           console.log(futurePeriodsLength);
           const dateString = `${data2.properties.periods[indexNumber].endTime}`;
           const date = new Date(dateString);
           const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
             const formattedDate = date.toLocaleString(undefined, options);
             console.log(formattedDate);
             console.log(data2.properties.periods[indexNumber].icon);
           weatherValidTime.innerHTML = `This forecest is valid until ${formattedDate} `;
           const direction = `${data2.properties.periods[indexNumber].windDirection}`;
           console.log(direction);
           windForecast.innerHTML = `${data2.properties.periods[indexNumber].windSpeed} ${direction}`;
           temperature.innerHTML = `${data2.properties.periods[indexNumber].temperature}°${data2.properties.periods[0].temperatureUnit}` ;
           shortForecast.innerHTML = `${data2.properties.periods[indexNumber].shortForecast}`;
           document.getElementById(`weatherImage`).src = `${data2.properties.periods[0].icon}`;
           const dateString2 = `${data2.properties.periods[indexNumber].startTime}`;
           const date2 = new Date(dateString2);
           const options2 = {hour: 'numeric', minute: 'numeric'};
             const formattedDate2 = date2.toLocaleString(undefined, options2);
             console.log(formattedDate2);
           var temperatureInput = data2.properties.periods[indexNumber].temperature;
           var humidity1 = data2.properties.periods[indexNumber].relativeHumidity.value;
           var humidity = humidity1 / 100;
           if(data2.properties.periods[indexNumber].probabilityOfPrecipitation.value != null)
           {
             rainChanceIcon.innerHTML = `${data2.properties.periods[indexNumber].probabilityOfPrecipitation.value}`;
             // rainChanceIcon.classList.add(`fa-${data2.properties.periods[0].probabilityOfPrecipitation.value}`);
           }
           else{
             rainChanceIcon.innerHTML = `0`;
           }
           var feelsLikeTemperature = calculateFeelsLikeTemperature(temperatureInput, humidity);
           console.log("Feels like temperature: " + feelsLikeTemperature.toFixed(0) + "°F");
           feelsLIke.innerHTML = feelsLikeTemperature.toFixed(0) + "°F";
           const unit = data2.properties.periods[0].temperatureUnit;
           const humdiityPercentage = humidity *100;
           const feelsLikeCalculation = "*Feels like temperature is calculated using: " + "the temperature which is  " + temperatureInput + "°" + unit + " and relative humidity which is:  "  +  humdiityPercentage + "%" ;
           feelsLikeCalculationElement.innerHTML = feelsLikeCalculation;
          console.log(feelsLikeCalculation);
         });  
     });
     console.log(indexNumber)
     setTimeout(function() {
      const pageLoader = document.getElementById("pageLoaded");
      pageLoader.classList.remove("is-active");
      console.log('5 secc delay');
  }, 5000);
  
    }

// Function to calculate the feels like temperature based on relative humidity
function calculateFeelsLikeTemperature(temperatureF, humidity) {
  // Calculate the feels like temperature
  var feelsLikeTemperature =
    temperatureF +
    0.33 * humidity -
    0.70 * Math.pow(10, -3) * Math.pow(temperatureF, 2) -
    4.00 * Math.pow(10, -6) * Math.pow(humidity, 2) +
    0.75 * Math.pow(10, -3) * Math.pow(temperatureF, 2) * humidity;

  return feelsLikeTemperature;

}
function toggleNotification(){
    const notification = document.getElementById("notification");
    if(notification.style.display == "none"){
        notification.style.display = "block";
    }
    else{
        notification.style.display = "none";
    }
}
function on() {
    const weatherContent = document.getElementById("weatherContent");  
    if(isDarkMode == true)
    {
      weatherContent.style.backgroundColor = "#0a0a0a";
      weatherContent.style.color = "#FFFFFF";
      document.body.style.backgroundColor = "#0a0a0a";
      document.body.style.color = "#FFFFFF";
     getLocation();
    }
    else{
      weatherContent.style.backgroundColor = "	#e4e5f1";
      weatherContent.style.color = "#333333";
      document.body.style.backgroundColor = "#d2d3db";
      document.body.style.color = "#333333";
          getLocation();
    }
    document.body.style.display = "visible";

  } 