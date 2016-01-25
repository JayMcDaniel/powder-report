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
    
    var peak = "<span class = 'peak report'>" + utils.addCommas(resort_obj.stats.peak) + "'&nbsp;peak</span>";

    var vert = "<span class = 'vert report'>" + utils.addCommas(resort_obj.stats.vertical_drop_ft) + "'&nbsp;vertical&nbsp;drop</span>";

    var full_address = "<a target ='_blank' href ='" + resort_obj.contact_info.address_url + "'><span class = 'full_address'>" + parsed_address.full_address + "</span></a> ";

    var rates = "Rates (midweek / weekend): <span class = 'rates_adult report'>Adult:&nbsp;$" + resort_obj.rates.adults_midweek + "&nbsp;/&nbsp;$" + resort_obj.rates.adults_prime + "&nbsp;</span>\
                <span class = 'rates_junior report'>Junior:&nbsp;$" + resort_obj.rates.juniors_midweek + "&nbsp;/&nbsp;$" + resort_obj.rates.juniors_prime + "</span> <a class = 'rates_url' target ='_blank' href ='" + resort_obj.rates.rates_url + "'>Get tickets</a>";

    var phone = "<span class ='resort_phone_number'>" + utils.phoneFormat(resort_obj.contact_info.phone) + "</span>";


    var toggle_widget_link = "<span class = 'toggle_widget_link report' widget_link = " + resort_obj.stats.widget_link + ">show current stats</span>"

    var map_thumbnail = "<div class='map_thumbnail'> <a target ='_blank' href='images/resort_maps/" + resort_obj.images.map + "'><img src='images/resort_maps/" + utils.thumbnailName(resort_obj.images.map) + "'/></a></div>";


    var snippet = "<div class='resort_snippet' id ='" + resort_obj.id + "' >" + name_and_logo + "\
        " + map_thumbnail + "<div class='resort_snippet_text'>\
        <span class='stats_report'>" + trails + lifts + acres + peak + vert + "</span><br/>\
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

var insertCurrentWeather = function (json, resort_obj, parsed_address) {
    

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
    if (typeof resort_obj.weather_forcast_url != "undefined" && resort_obj.weather_forcast_url.length > 0) {
        five_day_forcast_link.href = resort_obj.weather_forcast_url;

    } else {
        five_day_forcast_link.href = "http://www.weather.com/weather/5day/l/" + parsed_address.zip + ":4:US";
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
            insertCurrentWeather(json, name, parsed_address);
        });
    }

    //insert all resorts on page
    $resorts_results_div.append(allResorts);
    
}


module.exports = printResorts;
},{"./build_Resort_Brief_Div.js":3,"./insert_Current_Weather.js":4,"./request_Current_Weather.js":7,"./utils.js":10}],7:[function(require,module,exports){
/** gets current weather conditions from openweathermap.org */

var requestCurrentWeather = function (resort_obj, parsed_address, callback) {

    var lat_lon = resort_obj.contact_info.lat_lon;
    if (lat_lon.length > 0) {
        lat_lon = lat_lon.split(",");
        var lat = lat_lon[0];
        var lon = $.trim(lat_lon[1]);
        var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=Imperial&appid=cca701a02541072de8ae89206c9faee9";

    } else {
        var url = "http://api.openweathermap.org/data/2.5/weather?zip=" + parsed_address.zip + ",us&units=Imperial&appid=cca701a02541072de8ae89206c9faee9";


    }


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzX3NyYy9hcHAuanMiLCJzY3JpcHRzX3NyYy9hcmVhX3NlbGVjdG9yLmpzIiwic2NyaXB0c19zcmMvYnVpbGRfUmVzb3J0X0JyaWVmX0Rpdi5qcyIsInNjcmlwdHNfc3JjL2luc2VydF9DdXJyZW50X1dlYXRoZXIuanMiLCJzY3JpcHRzX3NyYy9sb2FkX1Jlc29ydHMuanMiLCJzY3JpcHRzX3NyYy9wcmludF9SZXNvcnRzLmpzIiwic2NyaXB0c19zcmMvcmVxdWVzdF9DdXJyZW50X1dlYXRoZXIuanMiLCJzY3JpcHRzX3NyYy9zb3J0aW5nLmpzIiwic2NyaXB0c19zcmMvdG9nZ2xlX1dpZGdldF9EaXNwbGF5X3NldHVwLmpzIiwic2NyaXB0c19zcmMvdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgbG9hZFJlc29ydHMgPSByZXF1aXJlKFwiLi9sb2FkX1Jlc29ydHMuanNcIik7XG52YXIgcHJpbnRSZXNvcnRzID0gcmVxdWlyZShcIi4vcHJpbnRfUmVzb3J0cy5qc1wiKTtcbnZhciB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXAgPSByZXF1aXJlKFwiLi90b2dnbGVfV2lkZ2V0X0Rpc3BsYXlfc2V0dXAuanNcIik7XG52YXIgc29ydGluZyA9IHJlcXVpcmUoXCIuL3NvcnRpbmcuanNcIik7XG52YXIgYXJlYV9zZWxlY3RvciA9IHJlcXVpcmUoXCIuL2FyZWFfc2VsZWN0b3IuanNcIik7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBhcmVhID0gYXJlYV9zZWxlY3Rvci5wYWdlTG9hZCgpO1xuXG4gICAgLyoqIGdldCB0aGUgcmVzb3J0IGpzb24gZnJvbSBzZWxlY3RlZCBhcmVhICovXG4gICAgbG9hZFJlc29ydHMoYXJlYSwgZnVuY3Rpb24gKGpzb24sIGFyZWEpIHtcblxuICAgICAgICBwcmludFJlc29ydHMoanNvbiwgYXJlYSk7XG4gICAgICAgIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCgpO1xuICAgICAgICBzb3J0aW5nLnNldFNlbGVjdGVkKGpzb24sIGFyZWEpO1xuICAgICAgICBzb3J0aW5nLnNvcnRCYXJJbml0KCk7XG5cbiAgICAgICAgLy9pbml0aWFsaXplIGFyZSBkcm9wZG93biBtZW51O1xuXG4gICAgICAgIGFyZWFfc2VsZWN0b3IuZHJvcGRvd25Jbml0KCk7XG5cbiAgICB9KTtcblxuXG5cblxuXG59KTsiLCJ2YXIgbG9hZFJlc29ydHMgPSByZXF1aXJlKFwiLi9sb2FkX1Jlc29ydHMuanNcIik7XG52YXIgcHJpbnRSZXNvcnRzID0gcmVxdWlyZShcIi4vcHJpbnRfUmVzb3J0cy5qc1wiKTtcbnZhciB0b2dnbGVXaWRnZXREaXNwbGF5U2V0dXAgPSByZXF1aXJlKFwiLi90b2dnbGVfV2lkZ2V0X0Rpc3BsYXlfc2V0dXAuanNcIik7XG52YXIgc29ydGluZyA9IHJlcXVpcmUoXCIuL3NvcnRpbmcuanNcIik7XG5cblxudmFyIGFyZWFfc2VsZWN0b3IgPSB7XG5cbiAgICBwYWdlTG9hZDogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vbG9vayBhdCBpbml0aWFsIHBhZ2UgdXJsIGFuZCBxIHN0cmluZyB0byBnZXQgYXJlYVxuXG4gICAgICAgIHZhciBhcmVhID0gd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkgfHwgXCJtaWRfYXRsYW50aWNcIjtcblxuICAgICAgICAvL3NldCBpbml0aWFsIHZhbHVlIG9mIHJlc29ydF9zZWxlY3Rpb25fZHJvcGRvd24gXG4gICAgICAgICQoXCIjcmVzb3J0X3NlbGVjdGlvbl9kcm9wZG93blwiKS52YWwoYXJlYSk7XG5cbiAgICAgICAgcmV0dXJuIGFyZWE7XG5cbiAgICB9LFxuXG4gICAgZHJvcGRvd25Jbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoXCIjcmVzb3J0X3NlbGVjdGlvbl9kcm9wZG93blwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFyZWEgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBhcmVhO1xuXG5cbiAgICAgICAgICAgIC8qKiBnZXQgdGhlIHJlc29ydCBqc29uIGZyb20gc2VsZWN0ZWQgYXJlYSAqL1xuICAgICAgICAgICAgbG9hZFJlc29ydHMoYXJlYSwgZnVuY3Rpb24gKGpzb24sIGFyZWEpIHtcbiAgICAgICAgICAgICAgICBzb3J0aW5nLnNldFNlbGVjdGVkKGpzb24sIGFyZWEpO1xuICAgICAgICAgICAgICAgIHNvcnRpbmcuc29ydFJlc29ydHNBcnJheSgpOyAvL25vdCBzdXBwbHlpbmcgc29ydF9ieSBhbmQgc29ydF9vcmRlciB0byB1c2UgZnVuY3Rpb24gY2FjaGU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwKCk7XG5cblxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFyZWFfc2VsZWN0b3I7IiwidmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscy5qcycpO1xuLyoqIGJ1aWxkcyBodG1sIGZyb20gX3Jlc29ydHMuanNvbiBhbmQgcmV0dXJucyBpdCBhcyBhIC5yZXNvcnRfc25pcHBldCBkaXYqL1xuXG52YXIgYnVpbGRSZXNvcnRCcmllZkRpdiA9IGZ1bmN0aW9uIChyZXNvcnRfb2JqLCBwYXJzZWRfYWRkcmVzcykge1xuICAgIFxuXG5cbiAgICB2YXIgbmFtZV9hbmRfbG9nbyA9IFwiPGEgY2xhc3MgPSAncmVzb3J0X25hbWUnIHRhcmdldCA9J19ibGFuaycgaHJlZiA9J1wiICsgdXRpbHMudXJsRm9ybWF0KHJlc29ydF9vYmouY29udGFjdF9pbmZvLnVybCkgKyBcIic+PGgzPjxpbWcgY2xhc3MgPSdyZXNvcnRfbG9nb19pbWcnIHNyYyA9ICdpbWFnZXMvcmVzb3J0X2xvZ29zL1wiICsgcmVzb3J0X29iai5pbWFnZXMubG9nbyArIFwiJy8+XCIgKyByZXNvcnRfb2JqLm5hbWUgKyBcIiA8c3BhbiBjbGFzcz0ncmVzb3J0X3N0YXRlJz5cIiArIHBhcnNlZF9hZGRyZXNzLnN0YXRlICsgXCI8L3NwYW4+PC9oMz48L2E+XCI7XG5cbiAgICB2YXIgdHJhaWxzID0gXCI8c3BhbiBjbGFzcyA9ICd0cmFpbHMgcmVwb3J0Jz5cIiArIHJlc29ydF9vYmouc3RhdHMudHJhaWxzICsgXCImbmJzcDt0cmFpbHMgPC9zcGFuPlwiO1xuXG4gICAgdmFyIGxpZnRzID0gXCI8c3BhbiBjbGFzcyA9ICdsaWZ0cyByZXBvcnQnPlwiICsgcmVzb3J0X29iai5zdGF0cy5saWZ0cyArIFwiJm5ic3A7bGlmdHMgPC9zcGFuPlwiO1xuXG4gICAgdmFyIGFjcmVzID0gXCI8c3BhbiBjbGFzcyA9ICdhY3JlcyByZXBvcnQnPlwiICsgdXRpbHMuYWRkQ29tbWFzKHJlc29ydF9vYmouc3RhdHMuc2tpYWJsZV9hY3JlcykgKyBcIiZuYnNwO2FjcmVzPC9zcGFuPlwiO1xuICAgIFxuICAgIHZhciBwZWFrID0gXCI8c3BhbiBjbGFzcyA9ICdwZWFrIHJlcG9ydCc+XCIgKyB1dGlscy5hZGRDb21tYXMocmVzb3J0X29iai5zdGF0cy5wZWFrKSArIFwiJyZuYnNwO3BlYWs8L3NwYW4+XCI7XG5cbiAgICB2YXIgdmVydCA9IFwiPHNwYW4gY2xhc3MgPSAndmVydCByZXBvcnQnPlwiICsgdXRpbHMuYWRkQ29tbWFzKHJlc29ydF9vYmouc3RhdHMudmVydGljYWxfZHJvcF9mdCkgKyBcIicmbmJzcDt2ZXJ0aWNhbCZuYnNwO2Ryb3A8L3NwYW4+XCI7XG5cbiAgICB2YXIgZnVsbF9hZGRyZXNzID0gXCI8YSB0YXJnZXQgPSdfYmxhbmsnIGhyZWYgPSdcIiArIHJlc29ydF9vYmouY29udGFjdF9pbmZvLmFkZHJlc3NfdXJsICsgXCInPjxzcGFuIGNsYXNzID0gJ2Z1bGxfYWRkcmVzcyc+XCIgKyBwYXJzZWRfYWRkcmVzcy5mdWxsX2FkZHJlc3MgKyBcIjwvc3Bhbj48L2E+IFwiO1xuXG4gICAgdmFyIHJhdGVzID0gXCJSYXRlcyAobWlkd2VlayAvIHdlZWtlbmQpOiA8c3BhbiBjbGFzcyA9ICdyYXRlc19hZHVsdCByZXBvcnQnPkFkdWx0OiZuYnNwOyRcIiArIHJlc29ydF9vYmoucmF0ZXMuYWR1bHRzX21pZHdlZWsgKyBcIiZuYnNwOy8mbmJzcDskXCIgKyByZXNvcnRfb2JqLnJhdGVzLmFkdWx0c19wcmltZSArIFwiJm5ic3A7PC9zcGFuPlxcXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3MgPSAncmF0ZXNfanVuaW9yIHJlcG9ydCc+SnVuaW9yOiZuYnNwOyRcIiArIHJlc29ydF9vYmoucmF0ZXMuanVuaW9yc19taWR3ZWVrICsgXCImbmJzcDsvJm5ic3A7JFwiICsgcmVzb3J0X29iai5yYXRlcy5qdW5pb3JzX3ByaW1lICsgXCI8L3NwYW4+IDxhIGNsYXNzID0gJ3JhdGVzX3VybCcgdGFyZ2V0ID0nX2JsYW5rJyBocmVmID0nXCIgKyByZXNvcnRfb2JqLnJhdGVzLnJhdGVzX3VybCArIFwiJz5HZXQgdGlja2V0czwvYT5cIjtcblxuICAgIHZhciBwaG9uZSA9IFwiPHNwYW4gY2xhc3MgPSdyZXNvcnRfcGhvbmVfbnVtYmVyJz5cIiArIHV0aWxzLnBob25lRm9ybWF0KHJlc29ydF9vYmouY29udGFjdF9pbmZvLnBob25lKSArIFwiPC9zcGFuPlwiO1xuXG5cbiAgICB2YXIgdG9nZ2xlX3dpZGdldF9saW5rID0gXCI8c3BhbiBjbGFzcyA9ICd0b2dnbGVfd2lkZ2V0X2xpbmsgcmVwb3J0JyB3aWRnZXRfbGluayA9IFwiICsgcmVzb3J0X29iai5zdGF0cy53aWRnZXRfbGluayArIFwiPnNob3cgY3VycmVudCBzdGF0czwvc3Bhbj5cIlxuXG4gICAgdmFyIG1hcF90aHVtYm5haWwgPSBcIjxkaXYgY2xhc3M9J21hcF90aHVtYm5haWwnPiA8YSB0YXJnZXQgPSdfYmxhbmsnIGhyZWY9J2ltYWdlcy9yZXNvcnRfbWFwcy9cIiArIHJlc29ydF9vYmouaW1hZ2VzLm1hcCArIFwiJz48aW1nIHNyYz0naW1hZ2VzL3Jlc29ydF9tYXBzL1wiICsgdXRpbHMudGh1bWJuYWlsTmFtZShyZXNvcnRfb2JqLmltYWdlcy5tYXApICsgXCInLz48L2E+PC9kaXY+XCI7XG5cblxuICAgIHZhciBzbmlwcGV0ID0gXCI8ZGl2IGNsYXNzPSdyZXNvcnRfc25pcHBldCcgaWQgPSdcIiArIHJlc29ydF9vYmouaWQgKyBcIicgPlwiICsgbmFtZV9hbmRfbG9nbyArIFwiXFxcbiAgICAgICAgXCIgKyBtYXBfdGh1bWJuYWlsICsgXCI8ZGl2IGNsYXNzPSdyZXNvcnRfc25pcHBldF90ZXh0Jz5cXFxuICAgICAgICA8c3BhbiBjbGFzcz0nc3RhdHNfcmVwb3J0Jz5cIiArIHRyYWlscyArIGxpZnRzICsgYWNyZXMgKyBwZWFrICsgdmVydCArIFwiPC9zcGFuPjxici8+XFxcbiAgICAgICAgXCIgKyByYXRlcyArIFwiPGJyPjxwIGNsYXNzPSdjb250YWN0X2luZm8nPlxcXG4gICAgICAgIFwiICsgZnVsbF9hZGRyZXNzICsgcGhvbmUgKyBcIjwvcD5cXFxuICAgICAgICBcIiArIHRvZ2dsZV93aWRnZXRfbGluayArIFwiPC9kaXY+XFxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9J2NsZWFyX2Zsb2F0Jz48L2Rpdj5cXFxuICAgICAgICA8L2Rpdj5cIjtcblxuXG5cbiAgICByZXR1cm4gc25pcHBldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBidWlsZFJlc29ydEJyaWVmRGl2OyIsInZhciB1dGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzLmpzXCIpO1xuXG4vKiogYnVpbGRzIGh0bWwgZnJvbSB3ZWF0aGVyIGpzb24gYW5kIGluc2VydHMgd2VhdGhlciByZXBvcnQgc3BhbiAqL1xuXG52YXIgaW5zZXJ0Q3VycmVudFdlYXRoZXIgPSBmdW5jdGlvbiAoanNvbiwgcmVzb3J0X29iaiwgcGFyc2VkX2FkZHJlc3MpIHtcbiAgICBcblxuICAgICQoXCIjXCIgKyByZXNvcnRfb2JqLmlkICsgXCIgLndlYXRoZXJfcmVwb3J0XCIpLnJlbW92ZSgpO1xuXG4gICAgdmFyIHdlYXRoZXJfcmVwb3J0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgd2VhdGhlcl9yZXBvcnQuY2xhc3NOYW1lID0gXCJ3ZWF0aGVyX3JlcG9ydFwiO1xuXG4gICAgdmFyIGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgIGljb24uY2xhc3NOYW1lID0gXCJ3ZWF0aGVyX2ljb25cIjtcbiAgICBpY29uLnNyYyA9IFwiaHR0cDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy9cIiArIGpzb24ud2VhdGhlclswXS5pY29uICsgXCIucG5nXCI7XG5cbiAgICB2YXIgZGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICBkZXNjcmlwdGlvbi5jbGFzc05hbWUgPSBcIndlYXRoZXJfZGVzY3JpcHRpb25cIjtcbiAgICBkZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHV0aWxzLndlYXRoZXJEZXNjcmlwdG9yKGpzb24ud2VhdGhlclswXS5kZXNjcmlwdGlvbikgKyBcIiBcIjtcblxuICAgIHZhciB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgdGVtcC5jbGFzc05hbWUgPSBcIndlYXRoZXJfdGVtcFwiO1xuICAgIHRlbXAudGV4dENvbnRlbnQgPSBqc29uLm1haW4udGVtcC50b0ZpeGVkKDEpICsgXCJcXHUyMTA5IFwiOyAvL3N5bWJvbCBmb3IgZGVncmVlcyBGXG5cbiAgICB2YXIgd2luZF9zcGVlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIHdpbmRfc3BlZWQuY2xhc3NOYW1lID0gXCJ3ZWF0aGVyX3dpbmRfc3BlZWRcIjtcbiAgICB3aW5kX3NwZWVkLnRleHRDb250ZW50ID0gXCJ3aW5kOlxcdTAwYTBcIiArIGpzb24ud2luZC5zcGVlZC50b0ZpeGVkKDEpICsgXCJcXHUwMGEwbXBoXCI7XG5cbiAgICB2YXIgZml2ZV9kYXlfZm9yY2FzdF9zcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgdmFyIGZpdmVfZGF5X2ZvcmNhc3RfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgIGZpdmVfZGF5X2ZvcmNhc3RfbGluay5jbGFzc05hbWUgPSBcImZpdmVfZGF5X2ZvcmNhc3RfbGlua1wiO1xuICAgIGZpdmVfZGF5X2ZvcmNhc3RfbGluay50ZXh0Q29udGVudCA9IFwiNVxcdTIwMTFkYXlcXHUwMEEwZm9yY2FzdFwiO1xuXG4gICAgLy9pZiBtb3JlIGFjY3VyYXRlIHdlYXRoZXIgbGluayBpcyBhdmFpbGFibGUsIHVzZSB0aGF0IGluc3RlYWQgb2YgemlwIGNvZGVcbiAgICBpZiAodHlwZW9mIHJlc29ydF9vYmoud2VhdGhlcl9mb3JjYXN0X3VybCAhPSBcInVuZGVmaW5lZFwiICYmIHJlc29ydF9vYmoud2VhdGhlcl9mb3JjYXN0X3VybC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZpdmVfZGF5X2ZvcmNhc3RfbGluay5ocmVmID0gcmVzb3J0X29iai53ZWF0aGVyX2ZvcmNhc3RfdXJsO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZml2ZV9kYXlfZm9yY2FzdF9saW5rLmhyZWYgPSBcImh0dHA6Ly93d3cud2VhdGhlci5jb20vd2VhdGhlci81ZGF5L2wvXCIgKyBwYXJzZWRfYWRkcmVzcy56aXAgKyBcIjo0OlVTXCI7XG4gICAgfVxuXG5cbiAgICBmaXZlX2RheV9mb3JjYXN0X2xpbmsudGFyZ2V0ID0gXCJfYmxhbmtcIjtcbiAgICBmaXZlX2RheV9mb3JjYXN0X3NwYW4uYXBwZW5kQ2hpbGQoZml2ZV9kYXlfZm9yY2FzdF9saW5rKTtcblxuXG5cblxuICAgIHdlYXRoZXJfcmVwb3J0LmFwcGVuZENoaWxkKGljb24pO1xuICAgIHdlYXRoZXJfcmVwb3J0LmFwcGVuZENoaWxkKGRlc2NyaXB0aW9uKTtcbiAgICB3ZWF0aGVyX3JlcG9ydC5hcHBlbmRDaGlsZCh0ZW1wKTtcbiAgICB3ZWF0aGVyX3JlcG9ydC5hcHBlbmRDaGlsZCh3aW5kX3NwZWVkKTtcbiAgICB3ZWF0aGVyX3JlcG9ydC5hcHBlbmRDaGlsZChmaXZlX2RheV9mb3JjYXN0X3NwYW4pO1xuXG4gICAgJCh3ZWF0aGVyX3JlcG9ydCkuaW5zZXJ0QmVmb3JlKCQoXCIjXCIgKyByZXNvcnRfb2JqLmlkICsgXCIgLnRvZ2dsZV93aWRnZXRfbGlua1wiKSk7XG5cblxuXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRDdXJyZW50V2VhdGhlcjsiLCIvKiogZ2V0cyBzdGF0aWMgcmVzb3J0IGNvbmRpdGlvbiBmcm9tIC5qc29uIGZpbGUgKi9cblxudmFyIGxvYWRSZXNvcnRzID0gZnVuY3Rpb24gKGFyZWEsIGNhbGxiYWNrKSB7XG5cbiAgICB2YXIgZmlsZSA9IFwianNvbi9cIiArIGFyZWEgKyBcIl9yZXNvcnRzLmpzb25cIjtcblxuICAgICQuZ2V0SlNPTihmaWxlKVxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgY2FsbGJhY2soanNvbiwgYXJlYSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uIChqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSB0ZXh0U3RhdHVzICsgXCIsIFwiICsgZXJyb3I7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3QgRmFpbGVkOiBcIiArIGVycik7XG4gICAgICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbG9hZFJlc29ydHM7IiwidmFyIGJ1aWxkUmVzb3J0QnJpZWZEaXYgPSByZXF1aXJlKFwiLi9idWlsZF9SZXNvcnRfQnJpZWZfRGl2LmpzXCIpO1xudmFyIHJlcXVlc3RDdXJyZW50V2VhdGhlciA9IHJlcXVpcmUoXCIuL3JlcXVlc3RfQ3VycmVudF9XZWF0aGVyLmpzXCIpO1xudmFyIGluc2VydEN1cnJlbnRXZWF0aGVyID0gcmVxdWlyZShcIi4vaW5zZXJ0X0N1cnJlbnRfV2VhdGhlci5qc1wiKTtcbnZhciB1dGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzLmpzXCIpO1xuXG4vKiogY2FsbHMgYnVpbGRlciBhbmQgaW5zZXJ0cyBuZXcgcmVzb3J0IHNuaXBwZXRzIG9uIHBhZ2UgKi9cblxudmFyIHByaW50UmVzb3J0cyA9IGZ1bmN0aW9uIChqc29uLCBhcmVhKSB7XG4gICAgXG4gICAgJChcIi5yZWdpb25fc2VsZWN0ZWRcIikudGV4dChhcmVhLnRvVXBwZXJDYXNlKCkucmVwbGFjZSgvXy9nLFwiIFwiKSk7XG4gICAgXG4gICAgdmFyICRyZXNvcnRzX3Jlc3VsdHNfZGl2ID0gJChcIiNyZXNvcnRzX3Jlc3VsdHNfZGl2XCIpO1xuXG4gICAgJHJlc29ydHNfcmVzdWx0c19kaXYuZW1wdHkoKTtcblxuICAgIHZhciByZXNvcnRzX2FyciA9IGpzb25bYXJlYV07XG4gICAgdmFyIGFsbFJlc29ydHMgPSBcIlwiO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByZXNvcnRzX2Fyci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXG4gICAgICAgIHJlc29ydHNfYXJyW2ldLmlkID0gcmVzb3J0c19hcnJbaV0ubmFtZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLyAvZywgXCJfXCIpLnJlcGxhY2UoL1xcLi9nLCBcIlwiKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBwYXJzZWRfYWRkcmVzcyA9IHV0aWxzLnBhcnNlQWRkcmVzcyhyZXNvcnRzX2FycltpXSk7XG4gICAgICAgIFxuICAgICAgICB2YXIgcmVzb3J0X2JyaWVmX2RpdiA9IGJ1aWxkUmVzb3J0QnJpZWZEaXYocmVzb3J0c19hcnJbaV0sIHBhcnNlZF9hZGRyZXNzKTtcbiAgICAgICAgYWxsUmVzb3J0cyA9IGFsbFJlc29ydHMgKyByZXNvcnRfYnJpZWZfZGl2O1xuXG4gICAgICAgIHJlcXVlc3RDdXJyZW50V2VhdGhlcihyZXNvcnRzX2FycltpXSwgcGFyc2VkX2FkZHJlc3MsIGZ1bmN0aW9uIChqc29uLCBuYW1lKSB7XG4gICAgICAgICAgICBpbnNlcnRDdXJyZW50V2VhdGhlcihqc29uLCBuYW1lLCBwYXJzZWRfYWRkcmVzcyk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vaW5zZXJ0IGFsbCByZXNvcnRzIG9uIHBhZ2VcbiAgICAkcmVzb3J0c19yZXN1bHRzX2Rpdi5hcHBlbmQoYWxsUmVzb3J0cyk7XG4gICAgXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBwcmludFJlc29ydHM7IiwiLyoqIGdldHMgY3VycmVudCB3ZWF0aGVyIGNvbmRpdGlvbnMgZnJvbSBvcGVud2VhdGhlcm1hcC5vcmcgKi9cblxudmFyIHJlcXVlc3RDdXJyZW50V2VhdGhlciA9IGZ1bmN0aW9uIChyZXNvcnRfb2JqLCBwYXJzZWRfYWRkcmVzcywgY2FsbGJhY2spIHtcblxuICAgIHZhciBsYXRfbG9uID0gcmVzb3J0X29iai5jb250YWN0X2luZm8ubGF0X2xvbjtcbiAgICBpZiAobGF0X2xvbi5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxhdF9sb24gPSBsYXRfbG9uLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgdmFyIGxhdCA9IGxhdF9sb25bMF07XG4gICAgICAgIHZhciBsb24gPSAkLnRyaW0obGF0X2xvblsxXSk7XG4gICAgICAgIHZhciB1cmwgPSBcImh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PVwiICsgbGF0ICsgXCImbG9uPVwiICsgbG9uICsgXCImdW5pdHM9SW1wZXJpYWwmYXBwaWQ9Y2NhNzAxYTAyNTQxMDcyZGU4YWU4OTIwNmM5ZmFlZTlcIjtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB1cmwgPSBcImh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/emlwPVwiICsgcGFyc2VkX2FkZHJlc3MuemlwICsgXCIsdXMmdW5pdHM9SW1wZXJpYWwmYXBwaWQ9Y2NhNzAxYTAyNTQxMDcyZGU4YWU4OTIwNmM5ZmFlZTlcIjtcblxuXG4gICAgfVxuXG5cbiAgICAkLmdldEpTT04odXJsKVxuICAgICAgICAuZG9uZShmdW5jdGlvbiAoanNvbikge1xuICAgICAgICAgICAgY2FsbGJhY2soanNvbiwgcmVzb3J0X29iaik7XG4gICAgICAgIH0pXG4gICAgICAgIC5mYWlsKGZ1bmN0aW9uIChqcXhociwgdGV4dFN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBlcnIgPSB0ZXh0U3RhdHVzICsgXCIsIFwiICsgZXJyb3I7XG4gICAgICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWVzdEN1cnJlbnRXZWF0aGVyOyIsInZhciBwcmludFJlc29ydHMgPSByZXF1aXJlKFwiLi9wcmludF9SZXNvcnRzLmpzXCIpO1xuXG5cbi8qKiBzZXQgdXAgdGhlIHNvcnQgYmFyIGZ1bmN0aW9uYWxpdHkgKi9cblxudmFyIHNvcnRpbmcgPSB7XG4gICAgXG4gICAgLy9oYXZlIGEgY29weSBvZiB0aGUgc2VsZWN0ZWQganNvbiBhbmQgYXJlYSBpbiB0aGlzIG9iamVjdCB0byB1c2UgaW4gc29ydFJlc29ydHNBcnJheSgpO1xuICAgIHNlbGVjdGVkX2pzb246IHt9LFxuICAgIHNlbGVjdGVkX2FyZWE6IHt9LFxuICAgIFxuICAgIHNldFNlbGVjdGVkOiBmdW5jdGlvbihqc29uLCBhcmVhKXtcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9qc29uID0ganNvbjtcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9hcmVhID0gYXJlYTtcbiAgICB9LFxuICAgIFxuICAgIFxuICAgIFxuICAgIFxuXG4gICAgLy9zb3J0cyByZXNvcnQganNvbi4gY2FsbGVkIHdoZW4gc29ydCBsaW5rIGlzIGNsaWNrZWQgb3IgcmVnaW9uIGRyb3Bkb3duIGlzIGNoYW5nZWRcbiAgICBzb3J0UmVzb3J0c0FycmF5OiBmdW5jdGlvbiAoc29ydF9ieSwgc29ydF9vcmRlcikge1xuXG4gICAgICAgIGlmICh0eXBlb2Ygc29ydF9ieSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgc29ydF9ieSA9IHRoaXMuY2FjaGVkID8gdGhpcy5jYWNoZWQuc29ydF9ieSA6IFwibmFtZVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc29ydF9vcmRlciA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgc29ydF9vcmRlciA9IHRoaXMuY2FjaGVkID8gdGhpcy5jYWNoZWQuc29ydF9vcmRlciA6IFwiZGVzY1wiO1xuICAgICAgICB9XG5cbiAgICAgICAgXG4gICAgICAgIHZhciB0aGlzUmVzb3J0QXJyYXkgPSB0aGlzLnNlbGVjdGVkX2pzb25bdGhpcy5zZWxlY3RlZF9hcmVhXTtcbiAgICAgICAgaWYgKHNvcnRfYnkgPT09IFwibmFtZVwiKSB7XG4gICAgICAgICAgICB0aGlzUmVzb3J0QXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhW3NvcnRfYnldLmxvY2FsZUNvbXBhcmUoYltzb3J0X2J5XSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHsgLy9mb3IgbnVtYmVyZWQgc29ydHMgaW4gdHdvIGxldmVsc1xuXG4gICAgICAgICAgICB2YXIgc29ydF9zcG90ID0gc29ydF9ieS5zcGxpdChcIi5cIik7XG5cbiAgICAgICAgICAgIHRoaXNSZXNvcnRBcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFbc29ydF9zcG90WzBdXVtzb3J0X3Nwb3RbMV1dIC0gYltzb3J0X3Nwb3RbMF1dW3NvcnRfc3BvdFsxXV07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cblxuICAgICAgICBpZiAoc29ydF9vcmRlciA9PT0gXCJhc2NcIikge1xuICAgICAgICAgICAgdGhpc1Jlc29ydEFycmF5LnJldmVyc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FjaGVkID0ge1xuICAgICAgICAgICAgc29ydF9vcmRlcjogc29ydF9vcmRlcixcbiAgICAgICAgICAgIHNvcnRfYnk6IHNvcnRfYnlcbiAgICAgICAgfVxuXG4gICAgICAgLy9yZWJ1aWxkIHJlc29ydHMgbGlzdCBvbiBzY3JlZW5cbiAgICAgICAgICAgIHByaW50UmVzb3J0cyh0aGlzLnNlbGVjdGVkX2pzb24sIHRoaXMuc2VsZWN0ZWRfYXJlYSk7XG4gICAgfSxcblxuICAgIC8vc29ydCBiYXIgaW5pdGlhbGl6ZXIgLSBjYWxsZWQgd2hlbiBwYWdlIGxvYWRzXG4gICAgc29ydEJhckluaXQ6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAkKFwiI3NvcnRfYmFyIC5zb3J0X2xpbmtcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICB2YXIgY2xpY2tlZF9zb3J0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBzb3J0X2J5ID0gY2xpY2tlZF9zb3J0LmF0dHIoXCJzb3J0X2J5XCIpO1xuICAgICAgICAgICAgdmFyIHNvcnRfb3JkZXIgPSBjbGlja2VkX3NvcnQuYXR0cihcInNvcnRfb3JkZXJcIik7XG5cbiAgICAgICAgICAgICQoXCIjc29ydF9iYXIgLnNvcnRfbGlua19zZWxlY3RlZFwiKS5yZW1vdmVDbGFzcyhcInNvcnRfbGlua19zZWxlY3RlZFwiKTtcbiAgICAgICAgICAgIGNsaWNrZWRfc29ydC5hZGRDbGFzcyhcInNvcnRfbGlua19zZWxlY3RlZFwiKTtcblxuXG4gICAgICAgICAgICAvL2lmIGFzY2VuZGluZywgbWFrZSBkZXNjZW5kaW5nIGV0Yy5cblxuICAgICAgICAgICAgdmFyIHRyaWFuZ2xlID0gc29ydF9vcmRlciA9PT0gXCJhc2NcIiA/IFwiXFx1MjVCQ1wiIDogXCJcXHUyNUIyXCI7XG4gICAgICAgICAgICB2YXIgbmV3X3NvcnRfb3JkZXIgPSBzb3J0X29yZGVyID09PSBcImFzY1wiID8gXCJkZXNjXCIgOiBcImFzY1wiO1xuXG5cblxuICAgICAgICAgICAgLy8gc29ydCB0aGUgcmVzb3J0cyBhcnJheVxuICAgICAgICAgICAgc29ydGluZy5zb3J0UmVzb3J0c0FycmF5KHNvcnRfYnksIHNvcnRfb3JkZXIpO1xuXG4gICAgICAgICAgICAkKFwiLnNvcnRfdHJpYW5nbGVcIiwgY2xpY2tlZF9zb3J0KS50ZXh0KHRyaWFuZ2xlKTtcblxuICAgICAgICAgICAgY2xpY2tlZF9zb3J0LnRvZ2dsZUNsYXNzKFwic29ydF9vcmRlcl9hc2Mgc29ydF9vcmRlcl9kZXNjXCIpLmF0dHIoXCJzb3J0X29yZGVyXCIsIG5ld19zb3J0X29yZGVyKTtcblxuXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG59XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHNvcnRpbmc7IiwiLyoqIHdoZW4gXCJtb3JlXCIgbGluayBpcyBjbGlja2VkLCBnZXRzIHdpZGdldCBmb3IgdGhhdCByZXNvcnQgYW5kIGFwcGVuZHMgaXQgdG8gcmVzb3J0IHNuaXBwZXQgKi9cblxudmFyIHRvZ2dsZVdpZGdldERpc3BsYXlTZXR1cCA9IGZ1bmN0aW9uKCl7XG4gICAgXG4gICAgXG4gICAgJChcIi50b2dnbGVfd2lkZ2V0X2xpbmtcIikuY2xpY2soZnVuY3Rpb24oKXsgICAgICAgIFxuICAgICAgICBpZiAoJCh0aGlzKS50ZXh0KCkgPT09IFwic2hvdyBjdXJyZW50IHN0YXRzXCIpe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY29uZGl0aW9uc193aWRnZXRfY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9jb250YWluZXIuY2xhc3NOYW1lID0gXCJjb25kaXRpb25zX3dpZGdldF9jb250YWluZXJcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9zbm93Y291bnRyeV9saW5rLmNsYXNzTmFtZSA9IFwiY29uZGl0aW9uc193aWRnZXRfc25vd2NvdW50cnlfbGlua1wiO1xuICAgICAgICAgICAgICAgIGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmsudGV4dENvbnRlbnQgPVwiUG93ZXJlZCBieSB3d3cuc25vY291bnRyeS5jb21cIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9zbm93Y291bnRyeV9saW5rLmhyZWYgPSBcImh0dHA6Ly93d3cuc25vY291bnRyeS5jb21cIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldF9zbm93Y291bnRyeV9saW5rLnRhcmdldCA9IFwiX2JsYW5rXCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGNvbmRpdGlvbnNfd2lkZ2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5jbGFzc05hbWUgPSBcImNvbmRpdGlvbnNfd2lkZ2V0XCI7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXQuc3JjID0gJCh0aGlzKS5hdHRyKFwid2lkZ2V0X2xpbmtcIik7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXQuaGVpZ2h0ID0gXCIyODBcIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC53aWR0aCA9IFwiNTkwXCI7XG4gICAgICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXQuc2VhbWxlc3M9IFwic2VhbWxlc3NcIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5mcmFtZUJvcmRlcj1cIjBcIjtcbiAgICAgICAgICAgICAgICBjb25kaXRpb25zX3dpZGdldC5zY3JvbGxpbmcgPSBcIm5vXCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXRfY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbmRpdGlvbnNfd2lkZ2V0X3Nub3djb3VudHJ5X2xpbmspO1xuICAgICAgICAgICAgY29uZGl0aW9uc193aWRnZXRfY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbmRpdGlvbnNfd2lkZ2V0KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAkKHRoaXMpLnRleHQoXCJoaWRlIGN1cnJlbnQgc3RhdHNcIilcbiAgICAgICAgICAgICAgICAuY2xvc2VzdChcIi5yZXNvcnRfc25pcHBldFwiKS5hcHBlbmQoY29uZGl0aW9uc193aWRnZXRfY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAkKHRoaXMpLnRleHQoXCJzaG93IGN1cnJlbnQgc3RhdHNcIilcbiAgICAgICAgICAgICAgICAuY2xvc2VzdChcIi5yZXNvcnRfc25pcHBldFwiKS5maW5kKFwiLmNvbmRpdGlvbnNfd2lkZ2V0X2NvbnRhaW5lclwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgXG4gICAgICAgIFxuICAgIH0pO1xuICAgIFxuICAgIFxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gdG9nZ2xlV2lkZ2V0RGlzcGxheVNldHVwOyIsIiAgICAgIHZhciB1dGlscyA9IHtcblxuICAgICAgICAgIC8qKiBhZGQgY29tbWFzIGZ1bmN0aW9uICovXG4gICAgICAgICAgYWRkQ29tbWFzOiBmdW5jdGlvbiAodmFsKSB7XG5cbiAgICAgICAgICAgICAgaWYgKGlzTmFOKHZhbCkpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoKHZhbCA+IDk5OSkgfHwgKHZhbCA8IC05OTkpKSB7XG4gICAgICAgICAgICAgICAgICB3aGlsZSAoLyhcXGQrKShcXGR7M30pLy50ZXN0KHZhbC50b1N0cmluZygpKSkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhbCA9IHZhbC50b1N0cmluZygpLnJlcGxhY2UoLyhcXGQrKShcXGR7M30pLywgJyQxJyArICcsJyArICckMicpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIC8qKiByZXR1cm4gX3NtIGZvciBpbWFnZSBuYW1lICovXG4gICAgICAgICAgdGh1bWJuYWlsTmFtZTogZnVuY3Rpb24gKGltYWdlX25hbWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGltYWdlX25hbWUucmVwbGFjZSgnLnBuZycsICdfc20ucG5nJykucmVwbGFjZSgnLmpwZycsICdfc20uanBnJykucmVwbGFjZSgnLmpwZWcnLCAnX3NtLmpwZWcnKTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgLyoqIHJldHVybiBtb2RkZWQgbGFuZ3VhZ2UgZm9yIHdlYXRoZXIgZGVzY3JpcHRpb24gKi9cbiAgICAgICAgICB3ZWF0aGVyRGVzY3JpcHRvcjogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoXCJvdmVyY2FzdCBjbG91ZHNcIiwgXCJvdmVyY2FzdFwiKS5yZXBsYWNlKFwic2t5IGlzIGNsZWFyXCIsIFwiY2xlYXIgc2tpZXNcIik7XG4gICAgICAgICAgfSxcblxuICAgICAgICAgIHBob25lRm9ybWF0OiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvXFwofFxcKS9nLCBcIlwiKS5yZXBsYWNlKC8tfCAvZywgXCImIzgyMDk7XCIpO1xuICAgICAgICAgIH0sXG5cblxuICAgICAgICAgIHBhcnNlQWRkcmVzczogZnVuY3Rpb24gKHJlc29ydF9vYmopIHtcbiAgICAgICAgICAgICAgdmFyIHBhcnNlZF9hZGRyZXNzID0ge307XG5cbiAgICAgICAgICAgICAgLy9pZiBwYXJ0cyBhcmUgdGhlcmUsIHVzZSB0aG9zZVxuICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy5zdHJlZXRfYWRyZXNzID0gcmVzb3J0X29iai5jb250YWN0X2luZm8uc3RyZWV0X2FkZHJlc3MgfHwgXCJcIjtcbiAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3MuY2l0eSA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLmNpdHkgfHwgXCJcIjtcbiAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3Muc3RhdGUgPSByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5zdGF0ZSB8fCBcIlwiO1xuICAgICAgICAgICAgICBwYXJzZWRfYWRkcmVzcy56aXAgPSByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby56aXAgfHwgXCJcIjtcblxuICAgICAgICAgICAgICAvL2Z1bGwgYWRkcmVzcyB1c2VzIGZ1bGwgaWYgaXRzIHRoZXJlLCBvciBhIGNvbWJpbmF0aW9uIGlmIGl0J3Mgbm90XG4gICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLmZ1bGxfYWRkcmVzcyA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLmZ1bGxfYWRkcmVzcyB8fCByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5zdHJlZXRfYWRkcmVzcyArIFwiLCBcIiArIHJlc29ydF9vYmouY29udGFjdF9pbmZvLmNpdHkgKyBcIiwgXCIgKyByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5zdGF0ZSArIFwiIFwiICsgcmVzb3J0X29iai5jb250YWN0X2luZm8uemlwO1xuXG4gICAgICAgICAgICAgIC8vaWYgZnVsbCBhZGRyZXNzIGlzIHRoZXJlLCBwYXJzZSBpdCBmb3IgcGFydHMgb2YgdGhlIGFkZHJlc3NcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZXNvcnRfb2JqLmNvbnRhY3RfaW5mby5mdWxsX2FkZHJlc3MgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhZGRyZXNzX2FyciA9IHJlc29ydF9vYmouY29udGFjdF9pbmZvLmZ1bGxfYWRkcmVzcy5zcGxpdChcIixcIik7XG5cbiAgICAgICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLnppcCA9IGFkZHJlc3NfYXJyW2FkZHJlc3NfYXJyLmxlbmd0aCAtIDFdLnNsaWNlKDMpO1xuICAgICAgICAgICAgICAgICAgcGFyc2VkX2FkZHJlc3Muc3RhdGUgPSBhZGRyZXNzX2FyclthZGRyZXNzX2Fyci5sZW5ndGggLSAxXS5zbGljZSgxLCAzKTtcbiAgICAgICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLmNpdHkgPSBhZGRyZXNzX2FyclthZGRyZXNzX2Fyci5sZW5ndGggLSAyXTtcbiAgICAgICAgICAgICAgICAgIHBhcnNlZF9hZGRyZXNzLnN0cmVldF9hZHJlc3MgPSBhZGRyZXNzX2Fyci5zbGljZSgwLCBhZGRyZXNzX2Fyci5sZW5ndGggLSAyKS5qb2luKFwiLFwiKTtcblxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZF9hZGRyZXNzO1xuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcblxuICAgICAgICAgIHVybEZvcm1hdDogZnVuY3Rpb24gKHN0cmluZykge1xuICAgICAgICAgICAgICBpZiAoc3RyaW5nLnNsaWNlKDAsIDMpID09PSBcInd3d1wiKSB7XG4gICAgICAgICAgICAgICAgICBzdHJpbmcgPSBcImh0dHA6Ly9cIiArIHN0cmluZztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgICAgICAgIH1cblxuICAgICAgfVxuXG5cbiAgICAgIG1vZHVsZS5leHBvcnRzID0gdXRpbHM7Il19
