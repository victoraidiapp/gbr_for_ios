// JavaScript Document
var DataManager={
	SERVER:{products:'http://datic.es/gahibre/img/bbdd/productos/'}
	,
	init:function(){
		
		//HABRÍA QUE COMPROBAR SI TENEMOS LA ÚLTIMA VERSIÓN DE LA BASE DE DATOS PARA NO TENER QUE VOLVER A DESCARGARLA
		
		DataManager.getProductsFromServer(function(r){
			//console.log("Del servidor obtenemos "+r);
			
			LocalFileManager.writeToCatalogue(r);
			//LocalFileManager.readCatalogue();
			
			//Vamos a descargarnos las imágenes de los productos
			
			var jresponse=jQuery.parseJSON(r);
			var arrProds=new Array();
			for(p in jresponse.producto){
				arrProds.push(jresponse.producto[p].fotoGrande);
			}
			
			DataManager.updateProducts(arrProds,function(onProgress){
				console.log("quedan "+onProgress.left);
				if(onProgress.finished===true) {
					
					LoadingDialog.hide(300);
				return;
				}
				LoadingDialog.show('<strong>Actualizando base de datos</strong><p>Descargando imágenes de producto</br>Quedan '+onProgress.left);
			});
			
				
				
			
		
		});

		
	},
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
	getRemoteBlob:function(remote,callback,errorCallback){
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
xhr.onerror=errorCallback;	
xhr.send();
		
	},
	updateProducts:function(arrProds,onProgCallback){
		console.log("Quedan "+arrProds.length);
		if(arrProds.length==0){
			
			console.log("Ya nos quedan mas para descargar");
		var onProgData={
						finished:true,
						left:0	
						}
						
		onProgCallback(onProgData);	
			 return;
		}
		console.log("Intentamos descargar la imagen "+arrProds[0]);
		LocalFileManager.getLocalFile("src/img_prod/"+arrProds[0],function(fEntry){
					//console.log("Hemos encontrado la imagen en "+fEntry.toNativeURL());
					//console.log("La imagen existe en "+arrProds[0].toNativeURL());
				jQuery("#img_prods").append('<img src="'+fEntry.toURL()+'" width=50 />');
				arrProds.shift();
				DataManager.updateProducts(arrProds,onProgCallback);	
				//jQuery("#img_prods").append('<img src="Documents/src/img_prod/'+jresponse.producto[p].fotoGrande+'" width=50 />');	
				//jQuery("#img_prods").append('<img src="../Documents/src/img_prod/'+jresponse.producto[p].fotoGrande+'" width=50 />');	
				},function(err){
					//Como el archivo no existe en local hay que descargarlo
					//console.log("No hemos podido encontrar el archivo "+err.code);
					if(arrProds[0] === undefined || arrProds[0] == null || arrProds[0].length <= 3) {
			
							
							
						arrProds.shift();
				DataManager.updateProducts(arrProds,onProgCallback);
							return;	
					}
		
					LocalFileManager.downloadFile(DataManager.SERVER.products+arrProds[0],"src/img_prod/"+arrProds[0],function(){
						//console.log("Hemos descargado el archivo "+arrProds[0]);
						var onProgData={
						finished:false,
						left:arrProds.length	
						}
						onProgCallback(onProgData);
						arrProds.shift();
				DataManager.updateProducts(arrProds,onProgCallback);
					},function(err){
						console.log("Hemos encontrado el error "+err+" aldescargar el archivo "+arrProds[0]);
						arrProds.shift();
				DataManager.updateProducts(arrProds,onProgCallback);
					})
					//jQuery("#img_prods").append('<img src="/src/img_prod/'+jresponse.producto[p].fotoGrande+'" width=50 />');	
				})
	}
	
};