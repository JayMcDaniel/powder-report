/** builds html from weather json and inserts weather report span */

var insertCurrentWeather = function(json, name){
    
    
    var weather_report = document.createElement("p");
        weather_report.className = "weather_report";
    
    var icon = document.createElement("img");
        icon.className ="weather_icon";
        icon.src = "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png";
    
    var description = document.createElement("span");
        description.className = "weather_description";
        description.textContent = json.weather[0].description;
    
    var temp = document.createElement("span");
        temp.className ="weather_temp";
        temp.textContent = json.main.temp.toFixed(1) + "\u2109"; //symbol for degrees F
    
    var wind_speed = document.createElement("span");
        wind_speed.className = "weather_wind_speed";
        wind_speed.textContent = "wind: " + json.wind.speed.toFixed(1) + " mph";
    
    
    
    weather_report.appendChild(icon);
    weather_report.appendChild(description);
    weather_report.appendChild(temp);
    weather_report.appendChild(wind_speed);
    
    $("#" + name.id + " .resort_snippet_text").prepend(weather_report);
      
}


module.exports = insertCurrentWeather;