/** when "more" link is clicked, gets widget for that resort and appends it to resort snippet */

var toggles = {


    widgetDisplaySetup: function () {

        $(".toggle_widget_link").click(function () {

            if ($(this).text() === "current stats +") {

                var conditions_widget_container = document.createElement("div");
                conditions_widget_container.className = "conditions_widget_container";

                var conditions_widget_snowcountry_link = document.createElement("a");
                conditions_widget_snowcountry_link.className = "conditions_widget_snowcountry_link";
                conditions_widget_snowcountry_link.textContent = "Powered by www.snocountry.com";
                conditions_widget_snowcountry_link.href = "http://www.snocountry.com";
                conditions_widget_snowcountry_link.target = "_blank";


                var conditions_widget = document.createElement("iframe");
                conditions_widget.className = "conditions_widget";
                conditions_widget.src = $(this).attr("widget_link");
                conditions_widget.height = "280";
                conditions_widget.width = "590";
                conditions_widget.seamless = "seamless";
                conditions_widget.frameBorder = "0";
                conditions_widget.scrolling = "no";


                conditions_widget_container.appendChild(conditions_widget_snowcountry_link);
                conditions_widget_container.appendChild(conditions_widget);


                $(this).html("<span class='underline'>current stats</span> <span class = 'hide_show_caret'>&minus;</span>")
                    .closest(".resort_snippet").append(conditions_widget_container);

            } else {
                $(this).html("<span class='underline'>current stats</span> <span class = 'hide_show_caret'>+</span>")
                    .closest(".resort_snippet").find(".conditions_widget_container").remove();

            }


        })


    },

    contactInfoDisplaySetup: function () {

        console.log("dsa");
        $(".toggle_contact_info_link").click(function () {
            console.log("dsa");
            if ($(this).text() === "contact info +") {

                $(this).html("<span class='underline'>contact info</span> <span class = 'hide_show_caret'>&minus;</span>")
                    .parents(".resort_snippet").children(".contact_info").show();

            } else {
                $(this).html("<span class='underline'>contact info</span> <span class = 'hide_show_caret'>+</span>")
                    .parents(".resort_snippet").children(".contact_info").hide();

            }
        });

    }
}


module.exports = toggles;