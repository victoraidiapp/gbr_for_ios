// JavaScript Document
var DataManager={
	SERVER:{products:'http://datic.es/gahibre/img/bbdd/productos/'}
	,
	getProductsFromServer:function(callBack){
		var today = new Date();
		
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
console.log(today.dateFormat('Ymd')+'SecretoPublicoGahibre2014');
console.log(jQuery.sha256(today.dateFormat('Ymd')+'SecretoPublicoGahibre2014'));
var token=jQuery.sha256(today.dateFormat('Ymd')+'SecretoPublicoGahibre2014');
var values = { };
values[token]=null;

		$.ajax({
			type:"POST",
			url:"http://datic.es/gahibre/webservice/servicio.php",
			dataType:"text",
			data:values,
			success:function(r){
				//console.log("El resultado obtenido es "+r);
			callBack(r)	
			}
		})
	},
	getRemoteBlob:function(remote,callback){
		var xhr = new XMLHttpRequest();
xhr.open('GET', remote, true);
xhr.responseType = 'blob';

xhr.onload = function(e) {
  if (this.status == 200) {
    // Note: .response instead of .responseText
    var blob = new Blob([this.response], {type: 'image/png'});
    callback(blob);
  }
};

xhr.send();
		
	},
	updateProducts:function(){
		
	}
	
};