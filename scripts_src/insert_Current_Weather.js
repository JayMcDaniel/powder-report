var insert_Current_Weather = function(json, name){
    console.log(json);
    
    var weather_report = document.createElement("p");
        weather_report.className = "weather_report";
    var weather_icon = document.createElement("img");
        weather_icon.className ="weather_icon";
        weather_icon.src = "http://openweathermap.org/img/w/" + json.weather[0].icon + ".png";
    var weather_description = document.createElement("span");
        weather_description.className = "weather_description";
        weather_description.textContent = json.weather[0].description;
    var weather_temp = document.createElement("span");
        weather_temp.className ="weather_temp";
        weather_temp.textContent = json.main.temp.toFixed(1) + " \u2109";
    
    
    
    weather_report.appendChild(weather_icon);
    weather_report.appendChild(weather_description);
    weather_report.appendChild(weather_temp);
    
    $("#" + name.id + " .resort_snippet_text").prepend(weather_report);
    
//    var resort_snippet_text = document.getElementById(name.id);
//    
//    resort_snippet.appendChild(weather_report);
    
}