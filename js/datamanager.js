// JavaScript Document
var DataManager={
	SERVER:{products:'http://datic.es/gahibre/img/bbdd/productos/',
	categorias:'http://datic.es/gahibre/img/bbdd/categorias/',
	normativas:'http://datic.es/gahibre/img/bbdd/normativas/',
	logotipos:'http://datic.es/gahibre/img/bbdd/logotipos/'},
	productCarrousel:new Array(),
	carouselObject:null,
	catalogueJSON:null,
	userDNI:null
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
				//console.log(DataManager.catalogueJSON.producto[p].fotoGrande)
				arrProds.push(DataManager.SERVER.products+DataManager.catalogueJSON.producto[p].fotoGrande);
				
			}
			
			//Vamos a descargar las imagenes de las categorias
			for(p in DataManager.catalogueJSON.categoria){
				//console.log("Imagen de categoria:"+DataManager.catalogueJSON.producto[p].fotoGrande)
				arrProds.push(DataManager.SERVER.categorias+DataManager.catalogueJSON.categoria[p].categoria);
			}
			
			//Incluimos tambien las imágenes de los logotipos
			for(p in DataManager.catalogueJSON.logotipo){
				arrProds.push(DataManager.SERVER.logotipos+DataManager.catalogueJSON.logotipo[p].logotipo);
			}
			
			//Cargamos los productos en el carrousel
			
			DataManager.updateImages(arrProds,function(onProgress){
				//console.log("quedan "+onProgress.left);
				if(onProgress.finished===true) {
					DataManager.initCatalogue();
					LoadingDialog.hide(300);
				return;
				}
				
		
				LoadingDialog.show('<strong>Actualizando base de datos</strong><p>Descargando imágenes de producto</br>Quedan '+onProgress.left);
			});
			
				
				
			
		
		});

	DataManager.userDNI=localStorage.getItem("dni");
	if(DataManager.userDNI==='undefined' || DataManager.userDNI===null){
		app.requestDNI();	
	}
		
	},
	initCatalogue:function(){
		console.log("Empieza la carga del catálogo");
		for(p in DataManager.catalogueJSON.producto){
				console.log(DataManager.catalogueJSON.producto[p].fotoGrande)
				/*console.log('<li><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				DataManager.catalogueJSON.producto[p].fotoGrande+'" height="100"/></li>');*/
				jQuery("#product-cat ul.list").append('<li class="nav comp"><aside><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				DataManager.catalogueJSON.producto[p].fotoGrande+'" height="25"/></aside><div><h2>'+DataManager.catalogueJSON.producto[p].modelo+'</h2></div></li>');
				
				DataManager.productCarrousel.push(
            '<h2>Modelo '+DataManager.catalogueJSON.producto[p].modelo+'</h2>'+
            '<div class="center"><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				DataManager.catalogueJSON.producto[p].fotoGrande+'"/></div>'+
            '<div class="center"><span class="material">'+DataManager.gamaName(DataManager.catalogueJSON.producto[p].idGama)+'</span></div>'+
            '<div class="details"><h3>DESCRIPCIÓN</h3>'+
            '<p>'+DataManager.catalogueJSON.producto[p].descripcion+'</p>'+
            '<h3>USO</h3>'+
            '<p>'+DataManager.catalogueJSON.producto[p].uso+'</p>'+
            '<h3 class="inline">TALLA: </h3><span class="value">9</span>'+
            '<h3 class="inline">EMPAQUETADO: </h3><span class="value">120 pares</span>'+
            '<h3 class="inline">P.V.P: </h3><span class="value">9</span></div>');
			}
			
		$.UISetupCarousel({ target: '#product-viewer', panels: DataManager.productCarrousel, loop: true,pagination:true });
		// $.UISetupCarousel({ target: '#product-carrousel', panels: DataManager.productCarrousel, loop: false });
		DataManager.carouselObject=$('#product-viewer').data('carousel');
		 //console.log("El contenido del carrousel es "+DataManager.productCarrousel+" en "+DataManager.productCarrousel.length);
		 $('#product-carrousel').removeClass('navigable');
		 console.log("El numero de familias es "+DataManager.catalogueJSON.familia.length)
		 
		 for(f in DataManager.catalogueJSON.familia){
				
				
				//console.log("Queremos cargar la familia "+DataManager.catalogueJSON.familia[f].familia);
				var idP=DataManager.searchFirstProductOfFamily(DataManager.catalogueJSON.familia[f].idFamilia);
				//console.log("Queremos cargar la familia "+DataManager.catalogueJSON.familia[f].familia+" cuyo primer producto tiene el id "+idP);
				
				jQuery("#product-fam ul.list").append('<li class="nav comp" data-gotoproduct="'+idP+'"><aside><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				DataManager.catalogueJSON.producto[idP].fotoGrande+'" height="25"/></aside><div><h2>'+DataManager.catalogueJSON.familia[f].familia+'</h2></div></li>');
				
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
	updateImages:function(arrProds,onProgCallback){
		//console.log("Quedan "+arrProds.length);
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
		
		//console.log("Intentamos descargar la imagen "+arrProds[0]);
		LocalFileManager.getLocalFile("src/img_prod/"+pathParts[pathParts.length-1],function(fEntry){
					//console.log("Hemos encontrado la imagen en "+fEntry.toURL());
					
				
				arrProds.shift();
				DataManager.updateImages(arrProds,onProgCallback);	
				//jQuery("#img_prods").append('<img src="Documents/src/img_prod/'+jresponse.producto[p].fotoGrande+'" width=50 />');	
				//jQuery("#img_prods").append('<img src="../Documents/src/img_prod/'+jresponse.producto[p].fotoGrande+'" width=50 />');	
				},function(err){
					//Como el archivo no existe en local hay que descargarlo
					//console.log("No hemos podido encontrar el archivo en local "+arrProds[0]);
					if(pathParts[pathParts.length-1] === undefined || pathParts[pathParts.length-1] == null || pathParts[pathParts.length-1].length <= 3) {
			
							
							
						arrProds.shift();
				DataManager.updateImages(arrProds,onProgCallback);
							return;	
					}
		
					LocalFileManager.downloadFile(arrProds[0],"src/img_prod/"+pathParts[pathParts.length-1],function(){
						//console.log("Hemos descargado el archivo "+pathParts[pathParts.length-1]);
						var onProgData={
						finished:false,
						left:arrProds.length	
						}
						onProgCallback(onProgData);
						arrProds.shift();
				DataManager.updateImages(arrProds,onProgCallback);
					},function(err){
						//console.log("Hemos encontrado el error "+err+" aldescargar el archivo "+arrProds[0]);
						arrProds.shift();
				DataManager.updateImages(arrProds,onProgCallback);
					})
					//jQuery("#img_prods").append('<img src="/src/img_prod/'+jresponse.producto[p].fotoGrande+'" width=50 />');	
				})
	},
	gamaName:function(idGama){
		for(g in DataManager.catalogueJSON.gama){
			if(DataManager.catalogueJSON.gama[g].idGama==idGama){
			return DataManager.catalogueJSON.gama[g].gama;	
			}
		}
	},
	searchModel:function(model){
		var i=0;
		for(g in DataManager.catalogueJSON.producto){
			
			if(DataManager.catalogueJSON.producto[g].modelo==model){
			return i;	
			}
			i++;
		}
		
		return null;
	},
	searchFirstProductOfFamily:function(idFamily){
		var idSubfamilia;
		for(g in DataManager.catalogueJSON.subfamilia){
			if(DataManager.catalogueJSON.subfamilia[g].idFamilia==idFamily){
			idSubfamilia=DataManager.catalogueJSON.subfamilia[g].idSubFamilia;
			break;
			}
		}
		
		var idGama;
		for(g in DataManager.catalogueJSON.gama){
			if(DataManager.catalogueJSON.gama[g].idSubFamilia==idSubfamilia){
			idGama=DataManager.catalogueJSON.gama[g].idGama;
			break;
			}
		}
		
		var i=0;
		for(g in DataManager.catalogueJSON.producto){
			
			if(DataManager.catalogueJSON.producto[g].idGama==idGama){
			return i;	
			}
			i++;
		}
		
	}
	
};