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
	updateProducts:function(arrProds){
		if(arrProds.length==0) return;
		console.log("Intentamos descargar la imagen "+arrProds[0]);
		LocalFileManager.getLocalFile("src/img_prod/"+arrProds[0],function(fEntry){
					//console.log("Hemos encontrado la imagen en "+fEntry.toNativeURL());
					//console.log("La imagen existe en "+arrProds[0].toNativeURL());
				jQuery("#img_prods").append('<img src="'+fEntry.toURL()+'" width=50 />');
				arrProds.shift();
				DataManager.updateProducts(arrProds);	
				//jQuery("#img_prods").append('<img src="Documents/src/img_prod/'+jresponse.producto[p].fotoGrande+'" width=50 />');	
				//jQuery("#img_prods").append('<img src="../Documents/src/img_prod/'+jresponse.producto[p].fotoGrande+'" width=50 />');	
				},function(err){
					//Como el archivo no existe en local hay que descargarlo
					//console.log("No hemos podido encontrar el archivo "+err.code);
					LocalFileManager.downloadFile(DataManager.SERVER.products+arrProds[0],"src/img_prod/"+arrProds[0],function(){
						console.log("Hemos descargado el archivo "+arrProds[0]);
						
						arrProds.shift();
				DataManager.updateProducts(arrProds);
					},function(err){
						console.log("Hemos encontrado el error "+err+" aldescargar el archivo "+arrProds[0]);
						arrProds.shift();
				DataManager.updateProducts(arrProds);
					})
					//jQuery("#img_prods").append('<img src="/src/img_prod/'+jresponse.producto[p].fotoGrande+'" width=50 />');	
				})
	}
	
};