var utils = require("./utils.js");



/** builds html from weather json and inserts weather report span */


var insertCurrentWeather = function insertCurrentWeather(json, resort_obj, parsed_address) {


    $("#" + resort_obj.id + " .weather_report").remove();

    //outer weather report span
    var weather_report = document.createElement("p");
    weather_report.className = "weather_report";
    weather_report.setAttribute("alt", "Weather conditions for " + resort_obj.name);
    weather_report.setAttribute("title", "Weather conditions for " + resort_obj.name);



    //description
    var description = document.createElement("span");
    var description_text = json.data.weather[0];
    description.className = "weather_description";
    description.textContent = utils.weatherDescriptor(description_text) +".";
    
    //weather icon
    var icon = document.createElement("span");
    icon.className = "weather_icon";
   // icon.src = json.data.iconLink[0];
   
     icon.textContent = utils.getWeatherIcon(description_text); //convert description to favicon
    //temp
    var temp = document.createElement("span");
    temp.className = "weather_temp";
    var currentTemp = json.currentobservation.Temp; //symbol for degrees F. Sometimes the temp from openweather comes back in kelvin even if I ask for it in F, so I need to convert.    
    temp.textContent = currentTemp + "\u2109 ";

    //wind
    var wind_speed = document.createElement("span");
    wind_speed.className = "weather_wind_speed";
    wind_speed.textContent = "wind:\u00a0" + json.currentobservation.Winds + "\u00a0mph";

    //5-day forecast link
    var five_day_forcast_span = document.createElement("span");
    var five_day_forcast_link = document.createElement("a");
    five_day_forcast_link.className = "five_day_forcast_link";
    five_day_forcast_link.textContent = "5\u2011day\u00A0forcast";

    //if more accurate weather link is available, use that instead of zip code
    if (typeof resort_obj.weather_forcast_url != "undefined" && resort_obj.weather_forcast_url.length > 0) {
        five_day_forcast_link.href = resort_obj.weather_forcast_url;

    } else {
        five_day_forcast_link.href = "http://www.weather.com/weather/5day/l/" + parsed_address.zip + ":4:US";
    }


    five_day_forcast_link.target = "_blank";
    five_day_forcast_span.appendChild(five_day_forcast_link);

    //put it all together
    weather_report.appendChild(icon);
    weather_report.appendChild(description);
    weather_report.appendChild(temp);
    weather_report.appendChild(wind_speed);
    weather_report.appendChild(five_day_forcast_span);

    $(weather_report).insertBefore($("#" + resort_obj.id + " .toggle_widget_link"));



}


module.exports = insertCurrentWeather;