      ///////add commas function

var utils = {
    
    addCommas: function (val) {
				
				if(isNaN(val)){
					return val;
				}else if ((val>999)|| (val<-999) ){
					while (/(\d+)(\d{3})/.test(val.toString())) {
						val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
					}
				}
                return val;
           }
    
}

            