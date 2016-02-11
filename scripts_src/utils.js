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


          urlFormat: function (string) {
              if (string.slice(0, 3) === "www") {
                  string = "http://" + string;
              }
              return string;
          },


          /** return modded language for weather description */
          weatherDescriptor: function (string) {
              return string.replace("overcast clouds", "overcast").replace(/sky is clear/i, "clear skies");
          },


          /** swap with appropriate custom weather icon */
          getWeatherIcon: function (icon) {

              var openWeatherIcons = ["01d", "02d", "03d", "04d", "09d", "10d", "11d", "13d", "50d", "01n", "02n", "03n", "04n", "09n", "10n", "11n", "13n", "50n"]; //18 icons, 9 day / 9 night from openWeatherMap.org
              var customWeatherIcons = ["B", "H", "N", "Y", "R", "R", "P", "W", "M", "C", "I", "N", "Y", "8", "8", "6", "#", "M"]; //custom icons using http://www.alessioatzeni.com/meteocons/  (C starts night)
              var foundIndex = $.inArray(icon, openWeatherIcons);

              if (foundIndex > -1) {
                  return customWeatherIcons[foundIndex];

              } else {
                  return "";
              };

          }

      }


      module.exports = utils;