// JavaScript Document
var DataManager={
	SERVER:{products:'http://datic.es/gahibre/img/bbdd/productos/',
	categorias:'http://datic.es/gahibre/img/bbdd/categorias/',
	normativas:'http://datic.es/gahibre/img/bbdd/normativas/',
	logotipos:'http://datic.es/gahibre/img/bbdd/logotipos/'},
	catalogueJSON:null
	,
	init:function(){
		
		//HABRÍA QUE COMPROBAR SI TENEMOS LA ÚLTIMA VERSIÓN DE LA BASE DE DATOS PARA NO TENER QUE VOLVER A DESCARGARLA
		
		DataManager.getProductsFromServer(function(r){
			//console.log("Del servidor obtenemos "+r);
			
			LocalFileManager.writeToCatalogue(r);
			//LocalFileManager.readCatalogue();
			
			//Vamos a descargarnos las imágenes de los productos
			
			DataManager.catalogueJSON=jQuery.parseJSON(r);
			var arrProds=new Array();
			for(p in DataManager.catalogueJSON.producto){
				console.log(DataManager.catalogueJSON.producto[p].fotoGrande)
				arrProds.push(DataManager.SERVER.products+DataManager.catalogueJSON.producto[p].fotoGrande);
			}
			
			//Vamos a descargar las imagenes de las categorias
			for(p in DataManager.catalogueJSON.categoria){
				console.log("Imagen de categoria:"+DataManager.catalogueJSON.producto[p].fotoGrande)
				arrProds.push(DataManager.SERVER.categorias+DataManager.catalogueJSON.categoria[p].categoria);
			}
			
			//Incluimos tambien las imágenes de los logotipos
			for(p in DataManager.catalogueJSON.logotipo){
				arrProds.push(DataManager.SERVER.logotipos+DataManager.catalogueJSON.logotipo[p].logotipo);
			}
			
			DataManager.updateImages(arrProds,function(onProgress){
				console.log("quedan "+onProgress.left);
				if(onProgress.finished===true) {
					DataManager.initCatalogue();
					LoadingDialog.hide(300);
				return;
				}
				
		
				LoadingDialog.show('<strong>Actualizando base de datos</strong><p>Descargando imágenes de producto</br>Quedan '+onProgress.left);
			});
			
				
				
			
		
		});

	
		
	},
	initCatalogue:function(){
		for(p in DataManager.catalogueJSON.producto){
				console.log(DataManager.catalogueJSON.producto[p].fotoGrande)
				jQuery("#productos ul.list").append('<li><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				DataManager.catalogueJSON.producto[p].fotoGrande+'" height="100"/></li>');
			}
		
	},
	getProductsFromServer:function(callBack){
		var today = new Date();
		
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
console.log(today.dateFormat('Ymd')+'SecretoPublicoGahibre2014');
console.log(jQuery.sha256(today.dateFormat('Ymd')+'SecretoPublicoGahibre2014'));
var token=jQuery.sha256(today.dateFormat('Ymd')+'SecretoPublicoGahibre2014');
console.log("El token es "+token);

var values = { };
values['token']=token;

		$.ajax({
			type:"POST",
			url:"http://datic.es/gahibre/webservice/servicio.php",
			dataType:"text",
			data:values,
			success:function(r){
				console.log("El resultado obtenido es "+r);
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
	updateImages:function(arrProds,onProgCallback){
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
		pathParts=arrProds[0].split("/");
		
		console.log("Intentamos descargar la imagen "+arrProds[0]);
		LocalFileManager.getLocalFile("src/img_prod/"+pathParts[pathParts.length-1],function(fEntry){
					console.log("Hemos encontrado la imagen en "+fEntry.toURL());
					
				
				arrProds.shift();
				DataManager.updateImages(arrProds,onProgCallback);	
				//jQuery("#img_prods").append('<img src="Documents/src/img_prod/'+jresponse.producto[p].fotoGrande+'" width=50 />');	
				//jQuery("#img_prods").append('<img src="../Documents/src/img_prod/'+jresponse.producto[p].fotoGrande+'" width=50 />');	
				},function(err){
					//Como el archivo no existe en local hay que descargarlo
					console.log("No hemos podido encontrar el archivo en local "+arrProds[0]);
					if(pathParts[pathParts.length-1] === undefined || pathParts[pathParts.length-1] == null || pathParts[pathParts.length-1].length <= 3) {
			
							
							
						arrProds.shift();
				DataManager.updateImages(arrProds,onProgCallback);
							return;	
					}
		
					LocalFileManager.downloadFile(arrProds[0],"src/img_prod/"+pathParts[pathParts.length-1],function(){
						console.log("Hemos descargado el archivo "+pathParts[pathParts.length-1]);
						var onProgData={
						finished:false,
						left:arrProds.length	
						}
						onProgCallback(onProgData);
						arrProds.shift();
				DataManager.updateImages(arrProds,onProgCallback);
					},function(err){
						console.log("Hemos encontrado el error "+err+" aldescargar el archivo "+arrProds[0]);
						arrProds.shift();
				DataManager.updateImages(arrProds,onProgCallback);
					})
					//jQuery("#img_prods").append('<img src="/src/img_prod/'+jresponse.producto[p].fotoGrande+'" width=50 />');	
				})
	}
	
};