var utils = require('./utils.js');
/** builds html from _resorts.json and returns it as a .resort_snippet div*/

var buildResortBriefDiv = function (resort_obj) {
    

    var name_and_logo = "<a target ='_blank' href ='http://" + resort_obj.contact_info.url + "'><h3><img class ='resort_logo_img' src = 'images/resort_logos/" + resort_obj.images.logo + "'/>" + resort_obj.name + "</h3></a>";
    
    var full_address = "<a target ='_blank' href ='" + resort_obj.contact_info.address_url + "'><span class = 'full_address'>" + resort_obj.contact_info.street_address + ", " + resort_obj.contact_info.city + ", " + resort_obj.contact_info.state + " " + resort_obj.contact_info.zip + "</span></a>";

    var phone = "<span class ='resort_phone_number'>" + resort_obj.contact_info.phone.replace(/-/g, "&#8209;") + "</span>";

    var trails = "<span class = 'trails report'>" + resort_obj.stats.trails + "&nbsp;trails </span>";
    
    var lifts =  "<span class = 'lifts report'>" + resort_obj.stats.lifts + "&nbsp;lifts </span>";
    
    var acres = "<span class = 'acres report'>" + resort_obj.stats.skiable_acres + "&nbsp;acres</span>";
    
    var vert = "<span class = 'vert report'>" + utils.addCommas(resort_obj.stats.vertical_drop_ft) + "'&nbsp;vertical&nbsp;drop</span>";
    
    var toggle_widget_link = "<span class = 'toggle_widget_link report' widget_link = " + resort_obj.stats.widget_link + ">more info</span>"
    
    var map_thumbnail = "<div class='map_thumbnail'> <a target ='_blank' href='images/resort_maps/"+resort_obj.images.map+"'><img src='images/resort_maps/" + resort_obj.images.map.replace('.png', '_sm.png') + "'/></a></div>";


    var snippet = "<div class='resort_snippet' id ='"+ resort_obj.id +"'>" + name_and_logo + "\
        " + map_thumbnail  + "<div class='resort_snippet_text'>\
        " + trails + lifts + acres + vert + "<br/>\
        " + full_address + " | " + phone + "<br/>\
        " + toggle_widget_link + "</div>\
            <div class='clear_float'></div>\
        </div>";
    


    return snippet;
}

module.exports = buildResortBriefDiv;