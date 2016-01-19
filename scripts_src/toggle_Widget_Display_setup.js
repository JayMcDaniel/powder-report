var toggleWidgetDisplaySetup = function(){
    
    
    $(".toggle_widget_link").click(function(){        
        if ($(this).text() === "more"){
            
            var conditions_widget_container = document.createElement("div");
                conditions_widget_container.className = "conditions_widget_container";
            
            var conditions_widget_snowcountry_link = document.createElement("a");
                conditions_widget_snowcountry_link.className = "conditions_widget_snowcountry_link";
                conditions_widget_snowcountry_link.textContent ="Powered by www.snocountry.com";
                conditions_widget_snowcountry_link.href = "www.snocountry.com";
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
            
            
            $(this).text("less")
                .closest(".resort_snippet").append(conditions_widget_container);
                
        }else{
            $(this).text("more")
            .closest(".resort_snippet").find(".conditions_widget_container").remove();
            
        }
       
        
//        
//          <iframe id="conditions_widget" src="http://www.snocountry.com/widget/widget_resort.php?code=717015&state=PA" frameborder="0" height="590" width="470" scrolling="no">
//              
//            </iframe>
        
    });
    
    
}