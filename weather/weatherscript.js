'use strict';

let weatherWidget = {
  settings: {
    api_key: '0361f2f6515f6fbc5002d00a3a9155bc',
    weather_url: 'https://api.openweathermap.org/data/2.5/weather',
    forecast_url: 'https://api.openweathermap.org/data/2.5/forecast',
    search_type: 'city_name',
    city_name: '',
    units: 'metric',
    icon_mapping: {
      '01d': 'wi-day-sunny',
      '01n': 'wi-day-sunny',
      '02d': 'wi-day-cloudy',
      '02n': 'wi-day-cloudy',
      '03d': 'wi-cloud',
      '03n': 'wi-cloud',
      '04d': 'wi-cloudy',
      '04n': 'wi-cloudy',
      '09d': 'wi-rain',
      '09n': 'wi-rain',
      '10d': 'wi-day-rain',
      '10n': 'wi-day-rain',
      '11d': 'wi-thunderstorm',
      '11n': 'wi-thunderstorm',
      '13d': 'wi-snow',
      '13n': 'wi-snow',
      '50d': 'wi-fog',
      '50n': 'wi-fog'
    }
  },
  constant: {
    dow: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  }
};

// Define getWeather and getForecast functions before init
weatherWidget.getWeather = function () {
  let params = {
    'q': this.settings.city_name,
    'APPID': this.settings.api_key,
    'units': this.settings.units
  };

  let p = '?' + Object.keys(params)
    .map((key) => key + '=' + params[key])
    .join('&');
  return this.makeRequest(this.settings.weather_url, p);
};

weatherWidget.getForecast = function () {
  let params = {
    'q': this.settings.city_name,
    'APPID': this.settings.api_key,
    'units': this.settings.units
  };

  let p = '?' + Object.keys(params)
    .map((key) => key + '=' + params[key])
    .join('&');
  return this.makeRequest(this.settings.forecast_url, p);
};

weatherWidget.makeRequest = function (url, params) {
  return new Promise(function (resolve, reject) {
    let req = new XMLHttpRequest();
    req.open('GET', url + params, true);
    req.responseType = 'json';

    req.onload = function () {
      if (req.status >= 200 && req.status < 400) {
        resolve(req.response);
      } else {
        reject(Error(req.status));
      }
    };

    req.onerror = () => reject('Error occurred while connecting to Weather API');
    req.send(params);
  });
};

// Now define init function
weatherWidget.init = function (settings) {
  this.settings = Object.assign(this.settings, settings);

  Promise.all([weatherWidget.getWeather(), weatherWidget.getForecast()])
    .then((resolve) => {
      let weather = resolve[0];
      let forecast = resolve[1].list;

      // Display custom location name
      document.getElementsByClassName('ow-city-name')[0].innerHTML = "Logos' Weather Journal ";
      document.getElementsByClassName('ow-temp-current')[0].innerHTML = Math.round(weather.main.temp) + '&deg';

      // Display weather icon
      if (!!weatherWidget.settings.icon_mapping[weather.weather[0].icon]) {
        let icon = weatherWidget.settings.icon_mapping[weather.weather[0].icon];
        let ico_current = document.getElementsByClassName('ow-ico-current')[0];
        if (ico_current.classList) {
          ico_current.classList.add(icon);
        } else {
          ico_current.className += ' ' + icon;
        }
      }


      //generate a custom message from an array
      const customMessages = {
        clear: [
          "It's a clear day at Rev's House! Perfect for outdoor activities.",
          "Sunshine at Rev's House! Time for a picnic!",
          "A bright, beautiful day at Rev's House. Enjoy the outdoors!"
        ],
        clouds: [
          "Cloudy skies at Rev's House. Great weather for staying cozy indoors.",
          "Overcast at Rev's House. Perfect for a movie marathon!",
          "Cloudy but calm at Rev's House. A good day for a stroll."
        ],
        rain: [
          "It's raining at Rev's House. Grab your umbrella if you're heading out!",
          "Rainy days at Rev's House are best spent indoors with a book.",
          "Showers at Rev's House. Stay dry and enjoy some tea!"
        ],
        snow: [
          "Snowfall at Rev's House. Bundle up if you're going outside!",
          "Winter wonderland at Rev's House! Perfect for snowball fights.",
          "Snowy scenes at Rev's House. A good day for hot cocoa!"
        ],
        thunderstorm: [
          "A storm is brewing at Rev's House. Best to stay indoors!",
          "Thunder and lightning at Rev's House. Cozy up and stay safe!",
          "It's stormy at Rev's House. Perfect for some indoor fun!"
        ],
        mist: [
          "Foggy conditions at Rev's House. Drive safely if you’re on the road!",
          "Misty mornings at Rev's House create a magical atmosphere.",
          "Fog rolls in at Rev's House. A good day for quiet reflection."
        ],
        fog: [
          "Foggy conditions at Rev's House. Drive safely if you’re on the road!",
          "Thick fog at Rev's House. Visibility is low, so take care!",
          "Fog covers Rev's House, giving everything a serene feel."
        ],
        default: [
          "The weather is unpredictable at Rev's House. Stay prepared!",
          "Weather at Rev's House keeps you on your toes. Be ready for anything!",
          "Who knows what to expect at Rev's House? Stay alert!"
        ]
      };

      // Generate a custom message based on weather conditions
      // Function to get a random message from an array
      function getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
      }

      // Set the custom message
      let weatherCondition = weather.weather[0].main.toLowerCase();
      let customMessage;

      // Use the customMessages object to get a random message
      if (customMessages[weatherCondition]) {
        customMessage = getRandomMessage(customMessages[weatherCondition]);
      } else {
        customMessage = getRandomMessage(customMessages.default);
      }

      // Set the custom message in the DOM
      document.getElementsByClassName('ow-custom-message')[0].innerHTML = customMessage;


    }).catch((error) => {
      console.error("Error loading weather data: ", error);
    });
};

// Define and run widget once
let widget = Object.create(weatherWidget);
widget.init({
  city_name: 'comox'
});
