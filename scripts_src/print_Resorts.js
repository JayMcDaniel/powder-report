var buildResortBriefDiv = require("./build_Resort_Brief_Div.js");
var requestCurrentWeather = require("./request_Current_Weather.js");
var insertCurrentWeather = require("./insert_Current_Weather.js");

/** calls builder and inserts new resort snippets on page */

var printResorts = function (json, area) {
    var $resorts_results_div = $("#resorts_results_div");
    $resorts_results_div.empty();

    var resorts_arr = json[area];
    var allResorts = "";
    for (var i = 0, len = resorts_arr.length; i < len; i++) {

        resorts_arr[i].id = resorts_arr[i].name.toLowerCase().replace(/ /g, "_");

        var resort_brief_div = buildResortBriefDiv(resorts_arr[i]);
        allResorts = allResorts + resort_brief_div;

        requestCurrentWeather(resorts_arr[i], function (json, name) {
            insertCurrentWeather(json, name);
        });
    }

    $resorts_results_div.append(allResorts);
}


module.exports = printResorts;