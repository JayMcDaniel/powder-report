var utils = require("./utils.js");

/** builds html from weather json and inserts weather report span */

var insertCurrentWeather = function (json, resort_obj) {
    
    $("#" + resort_obj.id + " .weather_report").remove();

    var weather_report = document.createElement("p");
    weather_report.className = "weather_report";

    var icon = document.createElement("img");
    icon.className = "weather_icon";
    icon.src = "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png";

    var description = document.createElement("span");
    description.className = "weather_description";
    description.textContent = utils.weatherDescriptor(json.weather[0].description) + " ";

    var temp = document.createElement("span");
    temp.className = "weather_temp";
    temp.textContent = json.main.temp.toFixed(1) + "\u2109"; //symbol for degrees F

    var wind_speed = document.createElement("span");
    wind_speed.className = "weather_wind_speed";
    wind_speed.textContent = "wind:\u00a0" + json.wind.speed.toFixed(1) + "\u00a0mph";

    var five_day_forcast_span = document.createElement("span");
    var five_day_forcast_link = document.createElement("a");
    five_day_forcast_link.className = "five_day_forcast_link";
    five_day_forcast_link.textContent = "five day forcast";
    five_day_forcast_link.href = "http://www.weather.com/weather/5day/l/" +resort_obj.contact_info.zip+ ":4:US";
    five_day_forcast_link.target = "_blank";
    five_day_forcast_span.appendChild(five_day_forcast_link);




    weather_report.appendChild(icon);
    weather_report.appendChild(description);
    weather_report.appendChild(temp);
    weather_report.appendChild(wind_speed);
    weather_report.appendChild(five_day_forcast_span);

    $(weather_report).insertBefore($("#" + resort_obj.id + " .toggle_widget_link"));
    
    

}


module.exports = insertCurrentWeather;