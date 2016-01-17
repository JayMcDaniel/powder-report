var buildResortBriefDiv = function (resort_obj) {
    
    
    

    var name_and_logo = "<a target ='_blank' href ='http://" + resort_obj.contact_info.url + "'><h3><img class ='resort_logo_img' src = 'images/resort_logos/" + resort_obj.images.logo + "'/>" + resort_obj.name + "</h3></a>";
    
    var full_address = "<a target ='_blank' href ='" + resort_obj.contact_info.address_url + "'><span class = 'full_address'>" + resort_obj.contact_info.street_address + ", " + resort_obj.contact_info.city + ", " + resort_obj.contact_info.state + " " + resort_obj.contact_info.zip + "</span></a>";

    var phone = "<span class ='resort_phone_number'>" + resort_obj.contact_info.phone.replace(/-/g, "&#8209;") + "</span>";

    var trails_report = "<span class = 'trails_report'><span class = 'trails_open'>5</span> / " + resort_obj.stats.trails + " trails open</span>";
    
    var acres_report = "<span class = 'acres_report'><span class = 'acres_open'>5</span> / " + resort_obj.stats.skiable_acres + " acres open</span>";
    
    var map_thumbnail = "<div class='map_thumbnail'> <a target ='_blank' href='images/resort_maps/"+resort_obj.images.map+"'><img src='images/resort_maps/" + resort_obj.images.map.replace('.png', '_sm.png') + "'/></a></div>";


    var snippet = "<div class='resort_snippet' id ='"+ resort_obj.id +"'>" + name_and_logo + "\
        " + map_thumbnail  + "<div class='resort_snippet_text'><p>\
        " + trails_report + acres_report + "<br/>\
        " + full_address + " | " + phone + "</p></div>\
            <div class='clear_float'></div>\
        </div>";
    


    return snippet;
}

//module.exports = Resort_brief_div;