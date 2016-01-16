var printResorts = function (json, area) {
    var $resorts_results_div = $("#resorts_results_div");
    $resorts_results_div.empty();
    
    var resorts_arr = json[area];
    var allResorts = "";
    for (var i = 0, len = resorts_arr.length; i< len; i++){
        var resort_brief_div = buildResortBriefDiv(resorts_arr[i]);
        allResorts = allResorts + resort_brief_div;
    }
    
    $resorts_results_div.append(allResorts);
}

//module.exports = printResorts;