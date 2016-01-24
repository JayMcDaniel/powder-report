(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var loadResorts = require("./load_Resorts.js");
var printResorts = require("./print_Resorts.js");
var toggleWidgetDisplaySetup = require("./toggle_Widget_Display_setup.js");
var sorting = require("./sorting.js");
var area_selector = require("./area_selector.js");

$(document).ready(function () {

    var area = area_selector.pageLoad();

    /** get the resort json from selected area */
    loadResorts(area, function (json, area) {

        printResorts(json, area);
        toggleWidgetDisplaySetup();
        sorting.setSelected(json, area);
        sorting.sortBarInit();

        //initialize are dropdown menu;

        area_selector.dropdownInit();

    });





});
},{"./area_selector.js":2,"./load_Resorts.js":5,"./print_Resorts.js":6,"./sorting.js":8,"./toggle_Widget_Display_setup.js":9}],2:[function(require,module,exports){
var loadResorts = require("./load_Resorts.js");
var printResorts = require("./print_Resorts.js");
var toggleWidgetDisplaySetup = require("./toggle_Widget_Display_setup.js");
var sorting = require("./sorting.js");


var area_selector = {

    pageLoad: function () {

        //look at initial page url and q string to get area

        var area = window.location.hash.slice(1) || "mid_atlantic";

        //set initial value of resort_selection_dropdown 
        $("#resort_selection_dropdown").val(area);

        return area;

    },

    dropdownInit: function () {
        $("#resort_selection_dropdown").change(function () {
            var area = $(this).val();
            window.location.hash = area;


            /** get the resort json from selected area */
            loadResorts(area, function (json, area) {
                sorting.setSelected(json, area);
                sorting.sortResortsArray(); //not supplying sort_by and sort_order to use function cache;
                
                
                toggleWidgetDisplaySetup();


            });
        });
    }

}

module.exports = area_selector;
},{"./load_Resorts.js":5,"./print_Resorts.js":6,"./sorting.js":8,"./toggle_Widget_Display_setup.js":9}],3:[function(require,module,exports){
var utils = require('./utils.js');
/** builds html from _resorts.json and returns it as a .resort_snippet div*/

var buildResortBriefDiv = function (resort_obj, parsed_address) {
    


    var name_and_logo = "<a class = 'resort_name' target ='_blank' href ='" + utils.urlFormat(resort_obj.contact_info.url) + "'><h3><img class ='resort_logo_img' src = 'images/resort_logos/" + resort_obj.images.logo + "'/>" + resort_obj.name + " <span class='resort_state'>" + parsed_address.state + "</span></h3></a>";

    var trails = "<span class = 'trails report'>" + resort_obj.stats.trails + "&nbsp;trails </span>";

    var lifts = "<span class = 'lifts report'>" + resort_obj.stats.lifts + "&nbsp;lifts </span>";

    var acres = "<span class = 'acres report'>" + utils.addCommas(resort_obj.stats.skiable_acres) + "&nbsp;acres</span>";

    var vert = "<span class = 'vert report'>" + utils.addCommas(resort_obj.stats.vertical_drop_ft) + "'&nbsp;vertical&nbsp;drop</span>";

    var full_address = "<a target ='_blank' href ='" + resort_obj.contact_info.address_url + "'><span class = 'full_address'>" + parsed_address.full_address + "</span></a> ";

    var rates = "Rates (midweek / weekend): <span class = 'rates_adult report'>Adult:&nbsp;$" + resort_obj.rates.adults_midweek + "&nbsp;/&nbsp;$" + resort_obj.rates.adults_prime + "&nbsp;</span>\
                <span class = 'rates_junior report'>Junior:&nbsp;$" + resort_obj.rates.juniors_midweek + "&nbsp;/&nbsp;$" + resort_obj.rates.juniors_prime + "</span> <a class = 'rates_url' target ='_blank' href ='" + resort_obj.rates.rates_url + "'>Get tickets</a>";

    var phone = "<span class ='resort_phone_number'>" + utils.phoneFormat(resort_obj.contact_info.phone) + "</span>";


    var toggle_widget_link = "<span class = 'toggle_widget_link report' widget_link = " + resort_obj.stats.widget_link + ">show current stats</span>"

    var map_thumbnail = "<div class='map_thumbnail'> <a target ='_blank' href='images/resort_maps/" + resort_obj.images.map + "'><img src='images/resort_maps/" + utils.thumbnailName(resort_obj.images.map) + "'/></a></div>";


    var snippet = "<div class='resort_snippet' id ='" + resort_obj.id + "' >" + name_and_logo + "\
        " + map_thumbnail + "<div class='resort_snippet_text'>\
        <span class='stats_report'>" + trails + lifts + acres + vert + "</span><br/>\
        " + rates + "<br><p class='contact_info'>\
        " + full_address + phone + "</p>\
        " + toggle_widget_link + "</div>\
            <div class='clear_float'></div>\
        </div>";



    return snippet;
}

module.exports = buildResortBriefDiv;
},{"./utils.js":10}],4:[function(require,module,exports){
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
    temp.textContent = json.main.temp.toFixed(1) + "\u2109 "; //symbol for degrees F

    var wind_speed = document.createElement("span");
    wind_speed.className = "weather_wind_speed";
    wind_speed.textContent = "wind:\u00a0" + json.wind.speed.toFixed(1) + "\u00a0mph";

    var five_day_forcast_span = document.createElement("span");
    var five_day_forcast_link = document.createElement("a");
    five_day_forcast_link.className = "five_day_forcast_link";
    five_day_forcast_link.textContent = "5\u2011day\u00A0forcast";

    //if more accurate weather link is available, use that instead of zip code
    if (typeof resort_obj.weather_forcast_url != "undefined" && resort_obj.weather_forcast_url.length > 1) {
        five_day_forcast_link.href = resort_obj.weather_forcast_url;

    } else {
        five_day_forcast_link.href = "http://www.weather.com/weather/5day/l/" + resort_obj.contact_info.zip + ":4:US";
    }


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
},{"./utils.js":10}],5:[function(require,module,exports){
/** gets static resort condition from .json file */

var loadResorts = function (area, callback) {

    var file = "json/" + area + "_resorts.json";

    $.getJSON(file)
        .done(function (json) {
            callback(json, area);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
            console.log("Request Failed: " + err);
        });

}

module.exports = loadResorts;
},{}],6:[function(require,module,exports){
var buildResortBriefDiv = require("./build_Resort_Brief_Div.js");
var requestCurrentWeather = require("./request_Current_Weather.js");
var insertCurrentWeather = require("./insert_Current_Weather.js");
var utils = require("./utils.js");

/** calls builder and inserts new resort snippets on page */

var printResorts = function (json, area) {
    
    $(".region_selected").text(area.toUpperCase().replace(/_/g," "));
    
    var $resorts_results_div = $("#resorts_results_div");

    $resorts_results_div.empty();

    var resorts_arr = json[area];
    var allResorts = "";
    for (var i = 0, len = resorts_arr.length; i < len; i++) {

        resorts_arr[i].id = resorts_arr[i].name.toLowerCase().replace(/ /g, "_").replace(/\./g, "");
        
        var parsed_address = utils.parseAddress(resorts_arr[i]);
        
        var resort_brief_div = buildResortBriefDiv(resorts_arr[i], parsed_address);
        allResorts = allResorts + resort_brief_div;

        requestCurrentWeather(resorts_arr[i], parsed_address, function (json, name) {
            insertCurrentWeather(json, name);
        });
    }

    //insert all resorts on page
    $resorts_results_div.append(allResorts);
    
}


module.exports = printResorts;
},{"./build_Resort_Brief_Div.js":3,"./insert_Current_Weather.js":4,"./request_Current_Weather.js":7,"./utils.js":10}],7:[function(require,module,exports){


/** gets current weather conditions from openweathermap.org */

var requestCurrentWeather = function (resort_obj, parsed_address, callback) {


        var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + parsed_address.zip + ",us&units=Imperial&appid=cca701a02541072de8ae89206c9faee9";
   
    $.getJSON(url)
        .done(function (json) {

            callback(json, resort_obj);
        })
        .fail(function (jqxhr, textStatus, error) {
            var err = textStatus + ", " + error;
        });

}

module.exports = requestCurrentWeather;
},{}],8:[function(require,module,exports){
var printResorts = require("./print_Resorts.js");


/** set up the sort bar functionality */

var sorting = {
    
    //have a copy of the selected json and area in this object to use in sortResortsArray();
    selected_json: {},
    selected_area: {},
    
    setSelected: function(json, area){
        this.selected_json = json;
        this.selected_area = area;
    },
    
    
    
    

    //sorts resort json. called when sort link is clicked or region dropdown is changed
    sortResortsArray: function (sort_by, sort_order) {

        if (typeof sort_by === "undefined") {
            sort_by = this.cached ? this.cached.sort_by : "name";
        }
        if (typeof sort_order === "undefined") {
            sort_order = this.cached ? this.cached.sort_order : "desc";
        }

        
        var thisResortArray = this.selected_json[this.selected_area];
        if (sort_by === "name") {
            thisResortArray.sort(function (a, b) {
                return a[sort_by].localeCompare(b[sort_by]);
            });
        } else { //for numbered sorts in two levels

            var sort_spot = sort_by.split(".");

            thisResortArray.sort(function (a, b) {
                return a[sort_spot[0]][sort_spot[1]] - b[sort_spot[0]][sort_spot[1]];
            });

        }


        if (sort_order === "asc") {
            thisResortArray.reverse();
        }

        this.cached = {
            sort_order: sort_order,
            sort_by: sort_by
        }

       //rebuild resorts list on screen
            printResorts(this.selected_json, this.selected_area);
    },

    //sort bar initializer - called when page loads
    sortBarInit: function () {

        $("#sort_bar .sort_link").click(function () {

            var clicked_sort = $(this);
            var sort_by = clicked_sort.attr("sort_by");
            var sort_order = clicked_sort.attr("sort_order");

            $("#sort_bar .sort_link_selected").removeClass("sort_link_selected");
            clicked_sort.addClass("sort_link_selected");


            //if ascending, make descending etc.

            var triangle = sort_order === "asc" ? "\u25BC" : "\u25B2";
            var new_sort_order = sort_order === "asc" ? "desc" : "asc";



            // sort the resorts array
            sorting.sortResortsArray(sort_by, sort_order);

            $(".sort_triangle", clicked_sort).text(triangle);

            clicked_sort.toggleClass("sort_order_asc sort_order_desc").attr("sort_order", new_sort_order);


        });
    }


}



module.exports = sorting;
},{"./print_Resorts.js":6}],9:[function(require,module,exports){
/** when "more" link is clicked, gets widget for that resort and appends it to resort snippet */

var toggleWidgetDisplaySetup = function(){
    
    
    $(".toggle_widget_link").click(function(){        
        if ($(this).text() === "show current stats"){
            
            var conditions_widget_container = document.createElement("div");
                conditions_widget_container.className = "conditions_widget_container";
            
            var conditions_widget_snowcountry_link = document.createElement("a");
                conditions_widget_snowcountry_link.className = "conditions_widget_snowcountry_link";
                conditions_widget_snowcountry_link.textContent ="Powered by www.snocountry.com";
                conditions_widget_snowcountry_link.href = "http://www.snocountry.com";
                conditions_widget_snowcountry_link.target = "_blank";
            
            
            var conditions_widget = document.createElement("iframe");
                conditions_widget.className = "conditions_widget";
                conditions_widget.src = $(this).attr("widget_link");
                conditions_widget.height = "280";
                conditions_widget.width = "590";
                conditions_widget.seamless= "seamless";
                conditions_widget.frameBorder="0";
                conditions_widget.scrolling = "no";
            
            
            conditions_widget_container.appendChild(conditions_widget_snowcountry_link);
            conditions_widget_container.appendChild(conditions_widget);
            
            
            $(this).text("hide current stats")
                .closest(".resort_snippet").append(conditions_widget_container);
                
        }else{
            $(this).text("show current stats")
                .closest(".resort_snippet").find(".conditions_widget_container").remove();
            
        }
       
        
    });
    
    
}


module.exports = toggleWidgetDisplaySetup;
},{}],10:[function(require,module,exports){
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
              return image_name.replace('.png', '_sm.png').replace('.jpg', '_sm.jpg').replace('.jpeg', '_sm.jpeg');
          },

          /** return modded language for weather description */
          weatherDescriptor: function (string) {
              return string.replace("overcast clouds", "overcast").replace("sky is clear", "clear skies");
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
          }

      }


      module.exports = utils;
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzX3NyYy9hcHAuanMiLCJzY3JpcHRzX3NyYy9hcmVhX3NlbGVjdG9yLmpzIiwic2NyaXB0c19zcmMvYnVpbGRfUmVzb3J0X0JyaWVmX0Rpdi5qcyIsInNjcmlwdHNfc3JjL2luc2VydF9DdXJyZW50X1dlYXRoZXIuanMiLCJzY3JpcHRzX3NyYy9sb2FkX1Jlc29ydHMuanMiLCJzY3JpcHRzX3NyYy9wcmludF9SZXNvcnRzLmpzIiwic2NyaXB0c19zcmMvcmVxdWVzdF9DdXJyZW50X1dlYXRoZXIuanMiLCJzY3JpcHRzX3NyYy9zb3J0aW5nLmpzIiwic2NyaXB0c19zcmMvdG9nZ2xlX1dpZGdldF9EaXNwbGF5X3NldHVwLmpzIiwic2NyaXB0c19zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBsb2FkUmVzb3J0cyA9IHJlcXVpcmUoXCIuL2xvYWRfUmVzb3J0cy5qc1wiKTtcbnZhciBwcmludFJlc29ydHMgPSByZXF1aXJlKFwiLi9wcmludF9SZXNvcnRzLmpzXCIpO1xudmFyIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCA9IHJlcXVpcmUoXCIuL3RvZ2dsZV9XaWRnZXRfRGlzcGxheV9zZXR1cC5qc1wiKTtcbnZhciBzb3J0aW5nID0gcmVxdWlyZShcIi4vc29ydGluZy5qc1wiKTtcbnZhciBhcmVhX3NlbGVjdG9yID0gcmVxdWlyZShcIi4vYXJlYV9zZWxlY3Rvci5qc1wiKTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGFyZWEgPSBhcmVhX3NlbGVjdG9yLnBhZ2VMb2FkKCk7XG5cbiAgICAvKiogZ2V0IHRoZSByZXNvcnQganNvbiBmcm9tIHNlbGVjdGVkIGFyZWEgKi9cbiAgICBsb2FkUmVzb3J0cyhhcmVhLCBmdW5jdGlvbiAoanNvbiwgYXJlYSkge1xuXG4gICAgICAgIHByaW50UmVzb3J0cyhqc29uLCBhcmVhKTtcbiAgICAgICAgdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwKCk7XG4gICAgICAgIHNvcnRpbmcuc2V0U2VsZWN0ZWQoanNvbiwgYXJlYSk7XG4gICAgICAgIHNvcnRpbmcuc29ydEJhckluaXQoKTtcblxuICAgICAgICAvL2luaXRpYWxpemUgYXJlIGRyb3Bkb3duIG1lbnU7XG5cbiAgICAgICAgYXJlYV9zZWxlY3Rvci5kcm9wZG93bkluaXQoKTtcblxuICAgIH0pO1xuXG5cblxuXG5cbn0pOyIsInZhciBsb2FkUmVzb3J0cyA9IHJlcXVpcmUoXCIuL2xvYWRfUmVzb3J0cy5qc1wiKTtcbnZhciBwcmludFJlc29ydHMgPSByZXF1aXJlKFwiLi9wcmludF9SZXNvcnRzLmpzXCIpO1xudmFyIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCA9IHJlcXVpcmUoXCIuL3RvZ2dsZV9XaWRnZXRfRGlzcGxheV9zZXR1cC5qc1wiKTtcbnZhciBzb3J0aW5nID0gcmVxdWlyZShcIi4vc29ydGluZy5qc1wiKTtcblxuXG52YXIgYXJlYV9zZWxlY3RvciA9IHtcblxuICAgIHBhZ2VMb2FkOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy9sb29rIGF0IGluaXRpYWwgcGFnZSB1cmwgYW5kIHEgc3RyaW5nIHRvIGdldCBhcmVhXG5cbiAgICAgICAgdmFyIGFyZWEgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKSB8fCBcIm1pZF9hdGxhbnRpY1wiO1xuXG4gICAgICAgIC8vc2V0IGluaXRpYWwgdmFsdWUgb2YgcmVzb3J0X3NlbGVjdGlvbl9kcm9wZG93biBcbiAgICAgICAgJChcIiNyZXNvcnRfc2VsZWN0aW9uX2Ryb3Bkb3duXCIpLnZhbChhcmVhKTtcblxuICAgICAgICByZXR1cm4gYXJlYTtcblxuICAgIH0sXG5cbiAgICBkcm9wZG93bkluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJChcIiNyZXNvcnRfc2VsZWN0aW9uX2Ryb3Bkb3duXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJlYSA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IGFyZWE7XG5cblxuICAgICAgICAgICAgLyoqIGdldCB0aGUgcmVzb3J0IGpzb24gZnJvbSBzZWxlY3RlZCBhcmVhICovXG4gICAgICAgICAgICBsb2FkUmVzb3J0cyhhcmVhLCBmdW5jdGlvbiAoanNvbiwgYXJlYSkge1xuICAgICAgICAgICAgICAgIHNvcnRpbmcuc2V0U2VsZWN0ZWQoanNvbiwgYXJlYSk7XG4gICAgICAgICAgICAgICAgc29ydGluZy5zb3J0UmVzb3J0c0FycmF5KCk7IC8vbm90IHN1cHBseWluZyBzb3J0X2J5IGFuZCBzb3J0X29yZGVyIHRvIHVzZSBmdW5jdGlvbiBjYWNoZTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXAoKTtcblxuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJlYV9zZWxlY3RvcjsiLCJ2YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzLmpzJyk7XG4vKiogYnVpbGRzIGh0bWwgZnJvbSBfcmVzb3J0cy5qc29uIGFuZCByZXR1cm5zIGl0IGFzIGEgLnJlc29ydF9zbmlwcGV0IGRpdiovXG5cbnZhciBidWlsZFJlc29ydEJyaWVmRGl2ID0gZnVuY3Rpb24gKHJlc29ydF9vYmosIHBhcnNlZF9hZGRyZXNzKSB7XG4gICAgXG5cblxuICAgIHZhciBuYW1lX2FuZF9sb2dvID0gXCI8YSBjbGFzcyA9ICdyZXNvcnRfbmFtZScgdGFyZ2V0ID0nX2JsYW5rJyBocmVmID0nXCIgKyB1dGlscy51cmxGb3JtYXQocmVzb3J0X29iai5jb250YWN0X2luZm8udXJsKSArIFwiJz48aDM+PGltZyBjbGFzcyA9J3Jlc29ydF9sb2dvX2ltZycgc3JjID0gJ2ltYWdlcy9yZXNvcnRfbG9nb3MvXCIgKyByZXNvcnRfb2JqLmltYWdlcy5sb2dvICsgXCInLz5cIiArIHJlc29ydF9vYmoubmFtZSArIFwiIDxzcGFuIGNsYXNzPSdyZXNvcnRfc3RhdGUnPlwiICsgcGFyc2VkX2FkZHJlc3Muc3RhdGUgKyBcIjwvc3Bhbj48L2gzPjwvYT5cIjtcblxuICAgIHZhciB0cmFpbHMgPSBcIjxzcGFuIGNsYXNzID0gJ3RyYWlscyByZXBvcnQnPlwiICsgcmVzb3J0X29iai5zdGF0cy50cmFpbHMgKyBcIiZuYnNwO3RyYWlscyA8L3NwYW4+XCI7XG5cbiAgICB2YXIgbGlmdHMgPSBcIjxzcGFuIGNsYXNzID0gJ2xpZnRzIHJlcG9ydCc+XCIgKyByZXNvcnRfb2JqLnN0YXRzLmxpZnRzICsgXCImbmJzcDtsaWZ0cyA8L3NwYW4+XCI7XG5cbiAgICB2YXIgYWNyZXMgPSBcIjxzcGFuIGNsYXNzID0gJ2FjcmVzIHJlcG9ydCc+XCIgKyB1dGlscy5hZGRDb21tYXMocmVzb3J0X29iai5zdGF0cy5za2lhYmxlX2FjcmVzKSArIFwiJm5ic3A7YWNyZXM8L3NwYW4+XCI7XG5cbiAgICB2YXIgdmVydCA9IFwiPHNwYW4gY2xhc3MgPSAndmVydCByZXBvcnQnPlwiICsgdXRpbHMuYWRkQ29tbWFzKHJlc29ydF9vYmouc3RhdHMudmVydGljYWxfZHJvcF9mdCkgKyBcIicmbmJzcDt2ZXJ0aWNhbCZuYnNwO2Ryb3A8L3NwYW4+XCI7XG5cbiAgICB2YXIgZnVsbF9hZGRyZXNzID0gXCI8YSB0YXJnZXQgPSdfYmxhbmsnIGhyZWYgPSdcIiArIHJlc29ydF9vYmouY29udGFjdF9pbmZvLmFkZHJlc3NfdXJsICsgXCInPjxzcGFuIGNsYXNzID0gJ2Z1bGxfYWRkcmVzcyc+XCIgKyBwYXJzZWRfYWRkcmVzcy5mdWxsX2FkZHJlc3MgKyBcIjwvc3Bhbj48L2E+IFwiO1xuXG4gICAgdmFyIHJhdGVzID0gXCJSYXRlcyAobWlkd2VlayAvIHdlZWtlbmQpOiA8c3BhbiBjbGFzcyA9ICdyYXRlc19hZHVsdCByZXBvcnQnPkFkdWx0OiZuYnNwOyRcIiArIHJlc29ydF9vYmoucmF0ZXMuYWR1bHRzX21pZHdlZWsgKyBcIiZuYnNwOy8mbmJzcDskXCIgKyByZXNvcnRfb2JqLnJhdGVzLmFkdWx0c19wcmltZSArIFwiJm5ic3A7PC9zcGFuPlxcXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3MgPSAncmF0ZXNfanVuaW9yIHJlcG9ydCc+SnVuaW9yOiZuYnNwOyRcIiArIHJlc29ydF9vYmoucmF0ZXMuanVuaW9yc19taWR3ZWVrICsgXCImbmJzcDsvJm5ic3A7JFwiICsgcmVzb3J0X29iai5yYXRlcy5qdW5pb3JzX3ByaW1lICsgXCI8L3NwYW4+IDxhIGNsYXNzID0gJ3JhdGVzX3VybCcgdGFyZ2V0ID0nX2JsYW5rJyBocmVmID0nXCIgKyByZXNvcnRfb2JqLnJhdGVzLnJhdGVzX3VybCArIFwiJz5HZXQgdGlja2V0czwvYT5cIjtcblxuICAgIHZhciBwaG9uZSA9IFwiPHNwYW4gY2xhc3MgPSdyZXNvcnRfcGhvbmVfbnVtYmVyJz5cIiArIHV0aWxzLnBob25lRm9ybWF0KHJlc29ydF9vYmouY29udGFjdF9pbmZvLnBob25lKSArIFwiPC9zcGFuPlwiO1xuXG5cbiAgICB2YXIgdG9nZ2xlX3dpZGdldF9saW5rID0gXCI8c3BhbiBjbGFzcyA9ICd0b2dnbGVfd2lkZ2V0X2xpbmsgcmVwb3J0JyB3aWRnZXRfbGluayA9IFwiICsgcmVzb3J0X29iai5zdGF0cy53aWRnZXRfbGluayArIFwiPnNob3cgY3VycmVudCBzdGF0czwvc3Bhbj5cIlxuXG4gICAgdmFyIG1hcF90aHVtYm5haWwgPSBcIjxkaXYgY2xhc3M9J21hcF90aHVtYm5haWwnPiA8YSB0YXJnZXQgPSdfYmxhbmsnIGhyZWY9J2ltYWdlcy9yZXNvcnRfbWFwcy9cIiArIHJlc29ydF9vYmouaW1hZ2VzLm1hcCArIFwiJz48aW1nIHNyYz0naW1hZ2VzL3Jlc29ydF9tYXBzL1wiICsgdXRpbHMudGh1bWJuYWlsTmFtZShyZXNvcnRfb2JqLmltYWdlcy5tYXApICsgXCInLz48L2E+PC9kaXY+XCI7XG5cblxuICAgIHZhciBzbmlwcGV0ID0gXCI8ZGl2IGNsYXNzPSdyZXNvcnRfc25pcHBldCcgaWQgPSdcIiArIHJlc29ydF9vYmouaWQgKyBcIicgPlwiICsgbmFtZV9hbmRfbG9nbyArIFwiXFxcbiAgICAgICAgXCIgKyBtYXBfdGh1bWJuYWlsICsgXCI8ZGl2IGNsYXNzPSdyZXNvcnRfc25pcHBldF90ZXh0Jz5cXFxuICAgICAgICA8c3BhbiBjbGFzcz0nc3RhdHNfcmVwb3J0Jz5cIiArIHRyYWlscyArIGxpZnRzICsgYWNyZXMgKyB2ZXJ0ICsgXCI8L3NwYW4+PGJyLz5cXFxuICAgICAgICBcIiArIHJhdGVzICsgXCI8YnI+PHAgY2xhc3M9J2NvbnRhY3RfaW5mbyc+XFxcbiAgICAgICAgXCIgKyBmdWxsX2FkZHJlc3MgKyBwaG9uZSArIFwiPC9wPlxcXG4gICAgICAgIFwiICsgdG9nZ2xlX3dpZGdldF9saW5rICsgXCI8L2Rpdj5cXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz0nY2xlYXJfZmxvYXQnPjwvZGl2PlxcXG4gICAgICAgIDwvZGl2PlwiO1xuXG5cblxuICAgIHJldHVybiBzbmlwcGV0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ1aWxkUmVzb3J0QnJpZWZEaXY7IiwidmFyIHV0aWxzID0gcmVxdWlyZShcIi4vdXRpbHMuanNcIik7XG5cbi8qKiBidWlsZHMgaHRtbCBmcm9tIHdlYXRoZXIganNvbiBhbmQgaW5zZXJ0cyB3ZWF0aGVyIHJlcG9ydCBzcGFuICovXG5cbnZhciBpbnNlcnRDdXJyZW50V2VhdGhlciA9IGZ1bmN0aW9uIChqc29uLCByZXNvcnRfb2JqKSB7XG5cbiAgICAkKFwiI1wiICsgcmVzb3J0X29iai5pZCArIFwiIC53ZWF0aGVyX3JlcG9ydFwiKS5yZW1vdmUoKTtcblxuICAgIHZhciB3ZWF0aGVyX3JlcG9ydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIHdlYXRoZXJfcmVwb3J0LmNsYXNzTmFtZSA9IFwid2VhdGhlcl9yZXBvcnRcIjtcblxuICAgIHZhciBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICBpY29uLmNsYXNzTmFtZSA9IFwid2VhdGhlcl9pY29uXCI7XG4gICAgaWNvbi5zcmMgPSBcImh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3cvXCIgKyBqc29uLndlYXRoZXJbMF0uaWNvbiArIFwiLnBuZ1wiO1xuXG4gICAgdmFyIGRlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgZGVzY3JpcHRpb24uY2xhc3NOYW1lID0gXCJ3ZWF0aGVyX2Rlc2NyaXB0aW9uXCI7XG4gICAgZGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB1dGlscy53ZWF0aGVyRGVzY3JpcHRvcihqc29uLndlYXRoZXJbMF0uZGVzY3JpcHRpb24pICsgXCIgXCI7XG5cbiAgICB2YXIgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIHRlbXAuY2xhc3NOYW1lID0gXCJ3ZWF0aGVyX3RlbXBcIjtcbiAgICB0ZW1wLnRleHRDb250ZW50ID0ganNvbi5tYWluLnRlbXAudG9GaXhlZCgxKSArIFwiXFx1MjEwOSBcIjsgLy9zeW1ib2wgZm9yIGRlZ3JlZXMgRlxuXG4gICAgdmFyIHdpbmRfc3BlZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICB3aW5kX3NwZWVkLmNsYXNzTmFtZSA9IFwid2VhdGhlcl93aW5kX3NwZWVkXCI7XG4gICAgd2luZF9zcGVlZC50ZXh0Q29udGVudCA9IFwid2luZDpcXHUwMGEwXCIgKyBqc29uLndpbmQuc3BlZWQudG9GaXhlZCgxKSArIFwiXFx1MDBhMG1waFwiO1xuXG4gICAgdmFyIGZpdmVfZGF5X2ZvcmNhc3Rfc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIHZhciBmaXZlX2RheV9mb3JjYXN0X2xpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICBmaXZlX2RheV9mb3JjYXN0X2xpbmsuY2xhc3NOYW1lID0gXCJmaXZlX2RheV9mb3JjYXN0X2xpbmtcIjtcbiAgICBmaXZlX2RheV9mb3JjYXN0X2xpbmsudGV4dENvbnRlbnQgPSBcIjVcXHUyMDExZGF5XFx1MDBBMGZvcmNhc3RcIjtcblxuICAgIC8vaWYgbW9yZSBhY2N1cmF0ZSB3ZWF0aGVyIGxpbmsgaXMgYXZhaWxhYmxlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHppcCBjb2RlXG4gICAgaWYgKHR5cGVvZiByZXNvcnRfb2JqLndlYXRoZXJfZm9yY2FzdF91cmwgIT0gXCJ1bmRlZmluZWRcIiAmJiByZXNvcnRfb2JqLndlYXRoZXJfZm9yY2FzdF91cmwubGVuZ3RoID4gMSkge1xuICAgICAgICBmaXZlX2RheV9mb3JjYXN0X2xpbmsuaHJlZiA9IHJlc29ydF9vYmoud2VhdGhlcl9mb3JjYXN0X3VybDtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIGZpdmVfZGF5X2ZvcmNhc3RfbGluay5ocmVmID0gXCJodHRwOi8vd3d3LndlYXRoZXIuY29tL3dlYXRoZXIvNWRheS9sL1wiICsgcmVzb3J0X29iai5jb250YWN0X2luZm8uemlwICsgXCI6NDpVU1wiO1xuICAgIH1cblxuXG4gICAgZml2ZV9kYXlfZm9yY2FzdF9saW5rLnRhcmdldCA9IFwiX2JsYW5rXCI7XG4gICAgZml2ZV9kYXlfZm9yY2FzdF9zcGFuLmFwcGVuZENoaWxkKGZpdmVfZGF5X2ZvcmNhc3RfbGluayk7XG5cblxuXG5cbiAgICB3ZWF0aGVyX3JlcG9ydC5hcHBlbmRDaGlsZChpY29uKTtcbiAgICB3ZWF0aGVyX3JlcG9ydC5hcHBlbmRDaGlsZChkZXNjcmlwdGlvbik7XG4gICAgd2VhdGhlcl9yZXBvcnQuYXBwZW5kQ2hpbGQodGVtcCk7XG4gICAgd2VhdGhlcl9yZXBvcnQuYXBwZW5kQ2hpbGQod2luZF9zcGVlZCk7XG4gICAgd2VhdGhlcl9yZXBvcnQuYXBwZW5kQ2hpbGQoZml2ZV9kYXlfZm9yY2FzdF9zcGFuKTtcblxuICAgICQod2VhdGhlcl9yZXBvcnQpLmluc2VydEJlZm9yZSgkKFwiI1wiICsgcmVzb3J0X29iai5pZCArIFwiIC50b2dnbGVfd2lkZ2V0X2xpbmtcIikpO1xuXG5cblxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0Q3VycmVudFdlYXRoZXI7IiwiLyoqIGdldHMgc3RhdGljIHJlc29ydCBjb25kaXRpb24gZnJvbSAuanNvbiBmaWxlICovXG5cbnZhciBsb2FkUmVzb3J0cyA9IGZ1bmN0aW9uIChhcmVhLCBjYWxsYmFjaykge1xuXG4gICAgdmFyIGZpbGUgPSBcImpzb24vXCIgKyBhcmVhICsgXCJfcmVzb3J0cy5qc29uXCI7XG5cbiAgICAkLmdldEpTT04oZmlsZSlcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGpzb24pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGpzb24sIGFyZWEpO1xuICAgICAgICB9KVxuICAgICAgICAuZmFpbChmdW5jdGlvbiAoanF4aHIsIHRleHRTdGF0dXMsIGVycm9yKSB7XG4gICAgICAgICAgICB2YXIgZXJyID0gdGV4dFN0YXR1cyArIFwiLCBcIiArIGVycm9yO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IEZhaWxlZDogXCIgKyBlcnIpO1xuICAgICAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxvYWRSZXNvcnRzOyIsInZhciBidWlsZFJlc29ydEJyaWVmRGl2ID0gcmVxdWlyZShcIi4vYnVpbGRfUmVzb3J0X0JyaWVmX0Rpdi5qc1wiKTtcbnZhciByZXF1ZXN0Q3VycmVudFdlYXRoZXIgPSByZXF1aXJlKFwiLi9yZXF1ZXN0X0N1cnJlbnRfV2VhdGhlci5qc1wiKTtcbnZhciBpbnNlcnRDdXJyZW50V2VhdGhlciA9IHJlcXVpcmUoXCIuL2luc2VydF9DdXJyZW50X1dlYXRoZXIuanNcIik7XG52YXIgdXRpbHMgPSByZXF1aXJlKFwiLi91dGlscy5qc1wiKTtcblxuLyoqIGNhbGxzIGJ1aWxkZXIgYW5kIGluc2VydHMgbmV3IHJlc29ydCBzbmlwcGV0cyBvbiBwYWdlICovXG5cbnZhciBwcmludFJlc29ydHMgPSBmdW5jdGlvbiAoanNvbiwgYXJlYSkge1xuICAgIFxuICAgICQoXCIucmVnaW9uX3NlbGVjdGVkXCIpLnRleHQoYXJlYS50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoL18vZyxcIiBcIikpO1xuICAgIFxuICAgIHZhciAkcmVzb3J0c19yZXN1bHRzX2RpdiA9ICQoXCIjcmVzb3J0c19yZXN1bHRzX2RpdlwiKTtcblxuICAgICRyZXNvcnRzX3Jlc3VsdHNfZGl2LmVtcHR5KCk7XG5cbiAgICB2YXIgcmVzb3J0c19hcnIgPSBqc29uW2FyZWFdO1xuICAgIHZhciBhbGxSZXNvcnRzID0gXCJcIjtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmVzb3J0c19hcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblxuICAgICAgICByZXNvcnRzX2FycltpXS5pZCA9IHJlc29ydHNfYXJyW2ldLm5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC8gL2csIFwiX1wiKS5yZXBsYWNlKC9cXC4vZywgXCJcIik7XG4gICAgICAgIFxuICAgICAgICB2YXIgcGFyc2VkX2FkZHJlc3MgPSB1dGlscy5wYXJzZUFkZHJlc3MocmVzb3J0c19hcnJbaV0pO1xuICAgICAgICBcbiAgICAgICAgdmFyIHJlc29ydF9icmllZl9kaXYgPSBidWlsZFJlc29ydEJyaWVmRGl2KHJlc29ydHNfYXJyW2ldLCBwYXJzZWRfYWRkcmVzcyk7XG4gICAgICAgIGFsbFJlc29ydHMgPSBhbGxSZXNvcnRzICsgcmVzb3J0X2JyaWVmX2RpdjtcblxuICAgICAgICByZXF1ZXN0Q3VycmVudFdlYXRoZXIocmVzb3J0c19hcnJbaV0sIHBhcnNlZF9hZGRyZXNzLCBmdW5jdGlvbiAoanNvbiwgbmFtZSkge1xuICAgICAgICAgICAgaW5zZXJ0Q3VycmVudFdlYXRoZXIoanNvbiwgbmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vaW5zZXJ0IGFsbCByZXNvcnRzIG9uIHBhZ2VcbiAgICAkcmVzb3J0c19yZXN1bHRzX2Rpdi5hcHBlbmQoYWxsUmVzb3J0cyk7XG4gICAgXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBwcmludFJlc29ydHM7IiwiXG5cbi8qKiBnZXRzIGN1cnJlbnQgd2VhdGhlciBjb25kaXRpb25zIGZyb20gb3BlbndlYXRoZXJtYXAub3JnICovXG5cbnZhciByZXF1ZXN0Q3VycmVudFdlYXRoZXIgPSBmdW5jdGlvbiAocmVzb3J0X29iaiwgcGFyc2VkX2FkZHJlc3MsIGNhbGxiYWNrKSB7XG5cblxuICAgICAgICB2YXIgdXJsID0gXCJodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP3ppcD1cIiArIHBhcnNlZF9hZGRyZXNzLnppcCArIFwiLHVzJnVuaXRzPUltcGVyaWFsJmFwcGlkPWNjYTcwMWEwMjU0MTA3MmRlOGFlODkyMDZjOWZhZWU5XCI7XG4gICBcbiAgICAkLmdldEpTT04odXJsKVxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoanNvbikge1xuXG4gICAgICAgICAgICBjYWxsYmFjayhqc29uLCByZXNvcnRfb2JqKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmZhaWwoZnVuY3Rpb24gKGpxeGhyLCB0ZXh0U3RhdHVzLCBlcnJvcikge1xuICAgICAgICAgICAgdmFyIGVyciA9IHRleHRTdGF0dXMgKyBcIiwgXCIgKyBlcnJvcjtcbiAgICAgICAgfSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1ZXN0Q3VycmVudFdlYXRoZXI7IiwidmFyIHByaW50UmVzb3J0cyA9IHJlcXVpcmUoXCIuL3ByaW50X1Jlc29ydHMuanNcIik7XG5cblxuLyoqIHNldCB1cCB0aGUgc29ydCBiYXIgZnVuY3Rpb25hbGl0eSAqL1xuXG52YXIgc29ydGluZyA9IHtcbiAgICBcbiAgICAvL2hhdmUgYSBjb3B5IG9mIHRoZSBzZWxlY3RlZCBqc29uIGFuZCBhcmVhIGluIHRoaXMgb2JqZWN0IHRvIHVzZSBpbiBzb3J0UmVzb3J0c0FycmF5KCk7XG4gICAgc2VsZWN0ZWRfanNvbjoge30sXG4gICAgc2VsZWN0ZWRfYXJlYToge30sXG4gICAgXG4gICAgc2V0U2VsZWN0ZWQ6IGZ1bmN0aW9uKGpzb24sIGFyZWEpe1xuICAgICAgICB0aGlzLnNlbGVjdGVkX2pzb24gPSBqc29uO1xuICAgICAgICB0aGlzLnNlbGVjdGVkX2FyZWEgPSBhcmVhO1xuICAgIH0sXG4gICAgXG4gICAgXG4gICAgXG4gICAgXG5cbiAgICAvL3NvcnRzIHJlc29ydCBqc29uLiBjYWxsZWQgd2hlbiBzb3J0IGxpbmsgaXMgY2xpY2tlZCBvciByZWdpb24gZHJvcGRvd24gaXMgY2hhbmdlZFxuICAgIHNvcnRSZXNvcnRzQXJyYXk6IGZ1bmN0aW9uIChzb3J0X2J5LCBzb3J0X29yZGVyKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzb3J0X2J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBzb3J0X2J5ID0gdGhpcy5jYWNoZWQgPyB0aGlzLmNhY2hlZC5zb3J0X2J5IDogXCJuYW1lXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzb3J0X29yZGVyID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBzb3J0X29yZGVyID0gdGhpcy5jYWNoZWQgPyB0aGlzLmNhY2hlZC5zb3J0X29yZGVyIDogXCJkZXNjXCI7XG4gICAgICAgIH1cblxuICAgICAgICBcbiAgICAgICAgdmFyIHRoaXNSZXNvcnRBcnJheSA9IHRoaXMuc2VsZWN0ZWRfanNvblt0aGlzLnNlbGVjdGVkX2FyZWFdO1xuICAgICAgICBpZiAoc29ydF9ieSA9PT0gXCJuYW1lXCIpIHtcbiAgICAgICAgICAgIHRoaXNSZXNvcnRBcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFbc29ydF9ieV0ubG9jYWxlQ29tcGFyZShiW3NvcnRfYnldKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgeyAvL2ZvciBudW1iZXJlZCBzb3J0cyBpbiB0d28gbGV2ZWxzXG5cbiAgICAgICAgICAgIHZhciBzb3J0X3Nwb3QgPSBzb3J0X2J5LnNwbGl0KFwiLlwiKTtcblxuICAgICAgICAgICAgdGhpc1Jlc29ydEFycmF5LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYVtzb3J0X3Nwb3RbMF1dW3NvcnRfc3BvdFsxXV0gLSBiW3NvcnRfc3BvdFswXV1bc29ydF9zcG90WzFdXTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmIChzb3J0X29yZGVyID09PSBcImFzY1wiKSB7XG4gICAgICAgICAgICB0aGlzUmVzb3J0QXJyYXkucmV2ZXJzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWNoZWQgPSB7XG4gICAgICAgICAgICBzb3J0X29yZGVyOiBzb3J0X29yZGVyLFxuICAgICAgICAgICAgc29ydF9ieTogc29ydF9ieVxuICAgICAgICB9XG5cbiAgICAgICAvL3JlYnVpbGQgcmVzb3J0cyBsaXN0IG9uIHNjcmVlblxuICAgICAgICAgICAgcHJpbnRSZXNvcnRzKHRoaXMuc2VsZWN0ZWRfanNvbiwgdGhpcy5zZWxlY3RlZF9hcmVhKTtcbiAgICB9LFxuXG4gICAgLy9zb3J0IGJhciBpbml0aWFsaXplciAtIGNhbGxlZCB3aGVuIHBhZ2UgbG9hZHNcbiAgICBzb3J0QmFySW5pdDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICQoXCIjc29ydF9iYXIgLnNvcnRfbGlua1wiKS5jbGljayhmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHZhciBjbGlja2VkX3NvcnQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNvcnRfYnkgPSBjbGlja2VkX3NvcnQuYXR0cihcInNvcnRfYnlcIik7XG4gICAgICAgICAgICB2YXIgc29ydF9vcmRlciA9IGNsaWNrZWRfc29ydC5hdHRyKFwic29ydF9vcmRlclwiKTtcblxuICAgICAgICAgICAgJChcIiNzb3J0X2JhciAuc29ydF9saW5rX3NlbGVjdGVkXCIpLnJlbW92ZUNsYXNzKFwic29ydF9saW5rX3NlbGVjdGVkXCIpO1xuICAgICAgICAgICAgY2xpY2tlZF9zb3J0LmFkZENsYXNzKFwic29ydF9saW5rX3NlbGVjdGVkXCIpO1xuXG5cbiAgICAgICAgICAgIC8vaWYgYXNjZW5kaW5nLCBtYWtlIGRlc2NlbmRpbmcgZXRjLlxuXG4gICAgICAgICAgICB2YXIgdHJpYW5nbGUgPSBzb3J0X29yZGVyID09PSBcImFzY1wiID8gXCJcXHUyNUJDXCIgOiBcIlxcdTI1QjJcIjtcbiAgICAgICAgICAgIHZhciBuZXdfc29ydF9vcmRlciA9IHNvcnRfb3JkZXIgPT09IFwiYXNjXCIgPyBcImRlc2NcIiA6IFwiYXNjXCI7XG5cblxuXG4gICAgICAgICAgICAvLyBzb3J0IHRoZSByZXNvcnRzIGFycmF5XG4gICAgICAgICAgICBzb3J0aW5nLnNvcnRSZXNvcnRzQXJyYXkoc29ydF9ieSwgc29ydF9vcmRlcik7XG5cbiAgICAgICAgICAgICQoXCIuc29ydF90cmlhbmdsZVwiLCBjbGlja2VkX3NvcnQpLnRleHQodHJpYW5nbGUpO1xuXG4gICAgICAgICAgICBjbGlja2VkX3NvcnQudG9nZ2xlQ2xhc3MoXCJzb3J0X29yZGVyX2FzYyBzb3J0X29yZGVyX2Rlc2NcIikuYXR0cihcInNvcnRfb3JkZXJcIiwgbmV3X3NvcnRfb3JkZXIpO1xuXG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbn1cblxuXG5cbm1vZHVsZS5leHBvcnRzID0gc29ydGluZzsiLCIvKiogd2hlbiBcIm1vcmVcIiBsaW5rIGlzIGNsaWNrZWQsIGdldHMgd2lkZ2V0IGZvciB0aGF0IHJlc29ydCBhbmQgYXBwZW5kcyBpdCB0byByZXNvcnQgc25pcHBldCAqL1xuXG52YXIgdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwID0gZnVuY3Rpb24oKXtcbiAgICBcbiAgICBcbiAgICAkKFwiLnRvZ2dsZV93aWRnZXRfbGlua1wiKS5jbGljayhmdW5jdGlvbigpeyAgICAgICAgXG4gICAgICAgIGlmICgkKHRoaXMpLnRleHQoKSA9PT0gXCJzaG93IGN1cnJlbnQgc3RhdHNcIil7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lci5jbGFzc05hbWUgPSBcImNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lclwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsuY2xhc3NOYW1lID0gXCJjb25kaXRpb25zX3dpZGdldF9zbm93Y291bnRyeV9saW5rXCI7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluay50ZXh0Q29udGVudCA9XCJQb3dlcmVkIGJ5IHd3dy5zbm9jb3VudHJ5LmNvbVwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsuaHJlZiA9IFwiaHR0cDovL3d3dy5zbm9jb3VudHJ5LmNvbVwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsudGFyZ2V0ID0gXCJfYmxhbmtcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY29uZGl0aW9uc193aWRnZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaWZyYW1lXCIpO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LmNsYXNzTmFtZSA9IFwiY29uZGl0aW9uc193aWRnZXRcIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5zcmMgPSAkKHRoaXMpLmF0dHIoXCJ3aWRnZXRfbGlua1wiKTtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5oZWlnaHQgPSBcIjI4MFwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LndpZHRoID0gXCI1OTBcIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5zZWFtbGVzcz0gXCJzZWFtbGVzc1wiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LmZyYW1lQm9yZGVyPVwiMFwiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0LnNjcm9sbGluZyA9IFwibm9cIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIuYXBwZW5kQ2hpbGQoY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGluayk7XG4gICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIuYXBwZW5kQ2hpbGQoY29uZGl0aW9uc193aWRnZXQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQodGhpcykudGV4dChcImhpZGUgY3VycmVudCBzdGF0c1wiKVxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KFwiLnJlc29ydF9zbmlwcGV0XCIpLmFwcGVuZChjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICQodGhpcykudGV4dChcInNob3cgY3VycmVudCBzdGF0c1wiKVxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KFwiLnJlc29ydF9zbmlwcGV0XCIpLmZpbmQoXCIuY29uZGl0aW9uc193aWRnZXRfY29udGFpbmVyXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICBcbiAgICAgICAgXG4gICAgfSk7XG4gICAgXG4gICAgXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXA7IiwiICAgICAgdmFyIHV0aWxzID0ge1xuXG4gICAgICAgICAgLyoqIGFkZCBjb21tYXMgZnVuY3Rpb24gKi9cbiAgICAgICAgICBhZGRDb21tYXM6IGZ1bmN0aW9uICh2YWwpIHtcblxuICAgICAgICAgICAgICBpZiAoaXNOYU4odmFsKSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICgodmFsID4gOTk5KSB8fCAodmFsIDwgLTk5OSkpIHtcbiAgICAgICAgICAgICAgICAgIHdoaWxlICgvKFxcZCspKFxcZHszfSkvLnRlc3QodmFsLnRvU3RyaW5nKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFsID0gdmFsLnRvU3RyaW5nKCkucmVwbGFjZSgvKFxcZCspKFxcZHszfSkvLCAnJDEnICsgJywnICsgJyQyJyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgLyoqIHJldHVybiBfc20gZm9yIGltYWdlIG5hbWUgKi9cbiAgICAgICAgICB0aHVtYm5haWxOYW1lOiBmdW5jdGlvbiAoaW1hZ2VfbmFtZSkge1xuICAgICAgICAgICAgICByZXR1cm4gaW1hZ2VfbmFtZS5yZXBsYWNlKCcucG5nJywgJ19zbS5wbmcnKS5yZXBsYWNlKCcuanBnJywgJ19zbS5qcGcnKS5yZXBsYWNlKCcuanBlZycsICdfc20uanBlZycpO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICAvKiogcmV0dXJuIG1vZGRlZCBsYW5ndWFnZSBmb3Igd2VhdGhlciBkZXNjcmlwdGlvbiAqL1xuICAgICAgICAgIHdlYXRoZXJEZXNjcmlwdG9yOiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZShcIm92ZXJjYXN0IGNsb3Vkc1wiLCBcIm92ZXJjYXN0XCIpLnJlcGxhY2UoXCJza3kgaXMgY2xlYXJcIiwgXCJjbGVhciBza2llc1wiKTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgcGhvbmVGb3JtYXQ6IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9cXCh8XFwpL2csIFwiXCIpLnJlcGxhY2UoLy18IC9nLCBcIiYjODIwOTtcIik7XG4gICAgICAgICAgfSxcblxuXG4gICAgICAgICAgcGFyc2VBZGRyZXNzOiBmdW5jdGlvbiAocmVzb3J0X29iaikge1xuICAgICAgICAgICAgICB2YXIgcGFyc2VkX2FkZHJlc3MgPSB7fTtcblxuICAgICAgICAgICAgICAvL2lmIHBhcnRzIGFyZSB0aGVyZSwgdXNlIHRob3NlXG4gICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLnN0cmVldF9hZHJlc3MgPSByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5zdHJlZXRfYWRkcmVzcyB8fCBcIlwiO1xuICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5jaXR5ID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uY2l0eSB8fCBcIlwiO1xuICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5zdGF0ZSA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0YXRlIHx8IFwiXCI7XG4gICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLnppcCA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnppcCB8fCBcIlwiO1xuXG4gICAgICAgICAgICAgIC8vZnVsbCBhZGRyZXNzIHVzZXMgZnVsbCBpZiBpdHMgdGhlcmUsIG9yIGEgY29tYmluYXRpb24gaWYgaXQncyBub3RcbiAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuZnVsbF9hZGRyZXNzID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uZnVsbF9hZGRyZXNzIHx8IHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0cmVldF9hZGRyZXNzICsgXCIsIFwiICsgcmVzb3J0X29iai5jb250YWN0X2luZm8uY2l0eSArIFwiLCBcIiArIHJlc29ydF9vYmouY29udGFjdF9pbmZvLnN0YXRlICsgXCIgXCIgKyByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby56aXA7XG5cbiAgICAgICAgICAgICAgLy9pZiBmdWxsIGFkZHJlc3MgaXMgdGhlcmUsIHBhcnNlIGl0IGZvciBwYXJ0cyBvZiB0aGUgYWRkcmVzc1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlc29ydF9vYmouY29udGFjdF9pbmZvLmZ1bGxfYWRkcmVzcyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgdmFyIGFkZHJlc3NfYXJyID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uZnVsbF9hZGRyZXNzLnNwbGl0KFwiLFwiKTtcblxuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuemlwID0gYWRkcmVzc19hcnJbYWRkcmVzc19hcnIubGVuZ3RoIC0gMV0uc2xpY2UoMyk7XG4gICAgICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5zdGF0ZSA9IGFkZHJlc3NfYXJyW2FkZHJlc3NfYXJyLmxlbmd0aCAtIDFdLnNsaWNlKDEsIDMpO1xuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuY2l0eSA9IGFkZHJlc3NfYXJyW2FkZHJlc3NfYXJyLmxlbmd0aCAtIDJdO1xuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3Muc3RyZWV0X2FkcmVzcyA9IGFkZHJlc3NfYXJyLnNsaWNlKDAsIGFkZHJlc3NfYXJyLmxlbmd0aCAtIDIpLmpvaW4oXCIsXCIpO1xuXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gcGFyc2VkX2FkZHJlc3M7XG5cbiAgICAgICAgICB9LFxuICAgICAgICAgIFxuXG4gICAgICAgICAgdXJsRm9ybWF0OiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICAgIGlmIChzdHJpbmcuc2xpY2UoMCwgMykgPT09IFwid3d3XCIpIHtcbiAgICAgICAgICAgICAgICAgIHN0cmluZyA9IFwiaHR0cDovL1wiICsgc3RyaW5nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICAgICAgfVxuXG4gICAgICB9XG5cblxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSB1dGlsczsiXX0=
