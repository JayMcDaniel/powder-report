      var utils = {

          /** add commas function */
          addCommas: function (val) {

              if (isNaN(val)) {
                  return val;
              } else if ((val > 999) || (val < -999)) {
                  while (/(\d+)(\d{3})/.test(val.toString())) {
                      val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
                  }
              }
              return val;
          },

          /** return _sm for image name */
          thumbnailName: function (image_name) {
              return image_name.replace('.png', '_sm.png').replace('.jpg', '_sm.jpg').replace('.jpeg', '_sm.jpeg').replace('.pdf', '_sm.png');
          },


          phoneFormat: function (string) {
              return string.replace(/\(|\)/g, "").replace(/-| /g, "&#8209;");
          },


          parseAddress: function (resort_obj) {
              var parsed_address = {};

              //if parts are there, use those
              parsed_address.street_adress = resort_obj.contact_info.street_address || "";
              parsed_address.city = resort_obj.contact_info.city || "";
              parsed_address.state = resort_obj.contact_info.state || "";
              parsed_address.zip = resort_obj.contact_info.zip || "";

              //full address uses full if its there, or a combination if it's not
              parsed_address.full_address = resort_obj.contact_info.full_address || resort_obj.contact_info.street_address + ", " + resort_obj.contact_info.city + ", " + resort_obj.contact_info.state + " " + resort_obj.contact_info.zip;

              //if full address is there, parse it for parts of the address
              if (typeof resort_obj.contact_info.full_address !== "undefined") {
                  var address_arr = resort_obj.contact_info.full_address.split(",");

                  parsed_address.zip = address_arr[address_arr.length - 1].slice(3);
                  parsed_address.state = address_arr[address_arr.length - 1].slice(1, 3);
                  parsed_address.city = address_arr[address_arr.length - 2];
                  parsed_address.street_adress = address_arr.slice(0, address_arr.length - 2).join(",");

              }

              return parsed_address;

          },


          /** if url doesn't start with http, add it */
          urlFormat: function (string) {
              if (string.slice(0, 3) === "www") {
                  string = "http://" + string;
              }
              return string;
          },


          /** return modded language for weather description */
          weatherDescriptor: function (string) {
              if (string === "NAmph ") {
                  return "N/A";
              }

              return string.slice(0, 1) + string.slice(1).toLowerCase().replace(".", ";");
          },

          /** mod wind language */
          windDescriptor: function (string) {
              if (string === "NAmph ") {
                  return "N/A";
              } else {
                  return string;
              }

          },

          /** return compass direction for number */
          windDirection: function (wind) {
              var wind_num = Number(wind);
              if (isNaN(wind_num)) {
                  return "";
              } else if (wind_num < 22.5) {
                  return "N";
              } else if (wind_num < 67.5) {
                  return "NE";
              } else if (wind_num < 112.5) {
                  return "E";
              } else if (wind_num < 157.5) {
                  return "SE";
              } else if (wind_num < 202.5) {
                  return "S";
              } else if (wind_num < 247.5) {
                  return "SW";
              } else if (wind_num < 292.5) {
                  return "W";
              } else if (wind_num < 337.5) {
                  return "NW";
              } else {
                  return "N";
              }

          },


          /** swap with appropriate custom weather icon */
          getWeatherIcon: function (icon) {
              var description = ["showers", "clear", "sunny", "mostly cloudy", "cloud", "fog", "blustery", "snow", "wintry", "thunder", "wind", "rain"];
              var customWeatherIcons = ["R", "B", "B", "Y", "N", "M", "F", "W", "X", "Z", "F", "R"]; //custom icons using http://www.alessioatzeni.com/meteocons/  

              var foundIndex = -1;

              description.forEach(function (e, i) {
                  var e_re = new RegExp(e, "i");
                  if (icon.match(e_re)) {

                      return foundIndex = i;
                  }
              });
              if (foundIndex > -1) {
                  return customWeatherIcons[foundIndex];

              } else {
                  return "";
              };

          }

      }


      module.exports = utils;