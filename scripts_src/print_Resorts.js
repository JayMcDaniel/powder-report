var printResorts = function (json, area) {
    var $resorts_results_div = $("#resorts_results_div");
    $resorts_results_div.empty();

    var resorts_arr = json[area];
    var allResorts = "";
    for (var i = 0, len = resorts_arr.length; i < len; i++) {
        
        resorts_arr[i].id = resorts_arr[i].name.toLowerCase().replace(/ /g,"_");
        
        var resort_brief_div = buildResortBriefDiv(resorts_arr[i]);
        allResorts = allResorts + resort_brief_div;

        requestCurrentWeather(resorts_arr[i], function (json, name) {
            insert_Current_Weather(json, name);
        });
    }

    $resorts_results_div.append(allResorts);
}

//module.exports = printResorts;