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
          "Days like this make me wish my office had windows ;0;",
          "Ahh, it's so nice out, I wonder if my boss wants to go for a picnic...",
          "How much sunscreen would it take to make me look like a ghost?"
        ],
        clouds: [
          "I wonder if my plants are getting enough sun...",
          "I wish the government could actually change the weather...",
          "How are my allergies still acting up with such plain weather?"
        ],
        rain: [
          "I wonder if the giant hole in Rev's house ever floods.",
          "Soupy weather. (That's what my grandma says at least.)",
          "I hope Rev's having a nice shower."
          "I wonder if my boss has an umbrella... maybe I can offer to share...?"
        ],
        snow: [
          "Ahh, perfect weather for tea and a book! Alas, employment.",
          "Rev threw a snowball at me on the way to our study session... I almost died",
          "What a bad day to be in Canada..."
        ],
        thunderstorm: [
          "AAAAAAAAAH WHAT WAS THAT",
          "My boss loves days like this. Says it's 'very Frankenstein-esque'",
          "Is the lightning going to keep going... Should I sleep at work..."
        ],
        mist: [
          "REV WAS HERE",
          "The world feels slow like this...",
          "Wasn't 'The Mist' the name of some horror movie... or was that fog?"
        ],
        fog: [
          "Aaaah I have to drive home in this...?",
          "Rev's house probably gains 10 scary points on days like this...",
          "REV HERE THIS WEATHER'S GREAT FOR HIDING THINGS IN THE FOREST"
        ],
        default: [
          "Could use another coffee...",
          "Ah I really should study a little more, midterms are so close...",
          "There's a weird dog following me... He seems friendly?"
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
