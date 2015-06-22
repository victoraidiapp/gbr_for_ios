// JavaScript Document
var DataManager={
	SERVER:{products:'http://datic.es/gahibre/img/bbdd/productos/',
	categorias:'http://datic.es/gahibre/img/bbdd/categorias/',
	normativas:'http://datic.es/gahibre/img/bbdd/normativas/',
	logotipos:'http://datic.es/gahibre/img/bbdd/logotipos/',
	promociones:'http://datic.es/gahibre/img/bbdd/empresas/'},
	productCarrousel:new Array(),
	searchProductCarrousel:new Array(),
	outletProductCarrousel:new Array(),
	carouselObject:null,
	outletCarouselObject:null,
	searchCarouselObject:null,
	catalogueJSON:null,
	clientsJSON:null,
	userDNI:null,
	currentProduct:null,
	shopCart:Array(),
	init:function(callbackInit){
		
		//HABRÍA QUE COMPROBAR SI TENEMOS LA ÚLTIMA VERSIÓN DE LA BASE DE DATOS PARA NO TENER QUE VOLVER A DESCARGARLA
		console.log("Inicializa el DataManager");
		
		
		
		DataManager.getProductsFromServer(function(r){
			//console.log("Del servidor obtenemos "+r);
			if(r.exito==0){
			console.log("Algo ha fallado tenemos que leer");	
			LocalFileManager.readCatalogue(function(r){
			console.log("El resultado almacenado es "+r);
			DataManager.syncImages(r,callbackInit)	;
			});
			}else{
				console.log("Hay conexion así que aprovechamos para descargar el catalogo");
				LocalFileManager.writeToCatalogue(r);
				DataManager.syncImages(r,callbackInit);
			}
			
		},function(){
			console.log("Ha habido un problema de conexion");
			LocalFileManager.readCatalogue(function(r){
												console.log("El resultado almacenado es "+r);
												if(r!=null && typeof(r)!='undefined' && r.length>1){
												DataManager.syncImages(r,callbackInit)	;
												}else{
												console.log("No hay datos guardados en local");	
												navigator.splashscreen.hide();
												$.UIPopup({
          id: "NOTDATABASE",
          title: 'Sin datos', 
          message: 'La aplicación no ha podido descargarse los datos del servidor. Vuelva a intentarlo más tarde',
		  cancelButton:"Cerrar"
		  
				})
													
												}
										},function(){
												console.log("No hay datos guardados en local");	
				
										});
		});


//Desvinculamos el bnotón de pedidos del tabbar


//INTERCEPTAMOS LA CARGA DE PEDIDOS
/*$(document).on('singletap',".button.pedidos",function(e){
	console.log("Has picado en el botón de pedidos");
	e.preventDefault();
if(DataManager.userDNI==='undefined' || DataManager.userDNI===null){
	
	e.stopPropagation();
		console.log("No hay DNI");
		
		
		DataManager.requestDNI();
		return true;	
	}
});
*/
//INTERCEPTAMOS LA CARGA DEL HOME
$(document).on('singletap tap click',".button.gahibre",function(e){
	if($('#about').hasClass('current')){
	return true;	
	}
	
	app.navProducts('#home','about',true);
})
		
	},
	syncImages:function(r,callbackInit){
		console.log("Vamos a sincronizar las imagenes");
		
		DataManager.catalogueJSON=jQuery.parseJSON(r);
			var arrProds=new Array();
			
			//Incluimos la imagen de promocion
			for(pr in DataManager.catalogueJSON.promocion){
				//console.log("Quremos incluir la imagen "+DataManager.SERVER.promociones+DataManager.catalogueJSON.promocion[pr].portada);
				arrProds.push(DataManager.SERVER.promociones+DataManager.catalogueJSON.promocion[pr].portada);
			}
			
			for(p in DataManager.catalogueJSON.producto){
				//console.log(DataManager.catalogueJSON.producto[p].fotoGrande)
				arrProds.push(DataManager.SERVER.products+DataManager.catalogueJSON.producto[p].fotoGrande);
				
			}
			
			for(p in DataManager.catalogueJSON.outlet){
				//console.log(DataManager.catalogueJSON.producto[p].fotoGrande)
				arrProds.push(DataManager.SERVER.products+DataManager.catalogueJSON.outlet[p].fotoGrande);
				
			}
			
			//Vamos a descargar las imagenes de las categorias
			for(p in DataManager.catalogueJSON.categoria){
				//console.log("Imagen de categoria:"+DataManager.catalogueJSON.producto[p].fotoGrande)
				arrProds.push(DataManager.SERVER.categorias+DataManager.catalogueJSON.categoria[p].categoria);
			}
			
			//Vamos a descargar las imagenes de las normativas
			for(p in DataManager.catalogueJSON.normativa){
				//console.log("Imagen de categoria:"+DataManager.catalogueJSON.producto[p].fotoGrande)
				arrProds.push(DataManager.SERVER.normativas+DataManager.catalogueJSON.normativa[p].normativa);
			}
			
			//Incluimos tambien las imágenes de los logotipos
			for(p in DataManager.catalogueJSON.logotipo){
				arrProds.push(DataManager.SERVER.logotipos+DataManager.catalogueJSON.logotipo[p].logotipo);
			}
			
			//Incluimos la imagen de promocion
			for(pr in DataManager.catalogueJSON.promocion){
				//console.log("Quremos incluir la imagen "+DataManager.SERVER.promociones+DataManager.catalogueJSON.promocion[pr].portada);
				arrProds.push(DataManager.SERVER.promociones+DataManager.catalogueJSON.promocion[pr].portada);
			}
			
			
			//Cargamos los productos en el carrousel
			
			DataManager.updateImages(arrProds,function(onProgress){
				//console.log("quedan "+onProgress.left);
				if(onProgress.finished===true) {
					
					//navigator.splashscreen.hide();
					DataManager.initCatalogue();
					DataManager.initOutlet();
					LoadingDialog.hide(300);
					DataManager.initDNI();
					DataManager.initPromo();
					callbackInit();
					
				return;
				}
				
		
				LoadingDialog.show('<strong>Actualizando base de datos</strong><p>Descargando imágenes de producto</br>Quedan '+onProgress.left);
			});
		
	},
	initDNI:function(){
		console.log("Se ejecuta la función de initDNI");
		DataManager.userDNI=localStorage.getItem("dni");
		
	if(DataManager.userDNI==='undefined' || DataManager.userDNI===null){
		console.log("No hay DNI");
		DataManager.requestDNI();	
	}else{
		console.log("El dni es "+DataManager.userDNI);
		DataManager.syncClients(DataManager.userDNI);
	}
	},
	initPromo:function(){
		//CArgamos la promo
		console.log("Cargamos la imagen de promo como html "+'<img src="'+LocalFileManager.docsPath+'src/img_prod/'+DataManager.catalogueJSON.promocion[0].portada+'" class="promo"/>');
		
		$("#promo").html('<img src="'+LocalFileManager.docsPath+'src/img_prod/'+DataManager.catalogueJSON.promocion[0].portada+'" class="promo"/>');
		setTimeout(function(){
			app.navProducts('#home','promo',true);
	
		},3500);
		
		
	},
	
	initCatalogue:function(){
		console.log("Empieza la carga del catálogo");
		var nproduct=0;
		for(p in DataManager.catalogueJSON.producto){
				console.log(DataManager.catalogueJSON.producto[p].fotoGrande)
				/*console.log('<li><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				DataManager.catalogueJSON.producto[p].fotoGrande+'" height="100"/></li>');*/
				DataManager.addProductToList("#product-cat ul.list",DataManager.catalogueJSON.producto[p]);
				/*jQuery("#product-cat ul.list").append('<li class="nav comp"><aside><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				DataManager.catalogueJSON.producto[p].fotoGrande+'" class="img-inlist"/></aside><div><h2>'+DataManager.catalogueJSON.producto[p].modelo+'</h2></div></li>');*/
				
				/*normativas='';
				for(n in DataManager.catalogueJSON.producto[p].normativas){
					normativas+='<img class="mini-logo" src="'+LocalFileManager.docsPath+"src/img_prod/"+
				DataManager.catalogueJSON.producto[p].normativas[n]+'"/>';
				}*/
				
				DataManager.productCarrousel.push(DataManager.getProductDetail(nproduct,DataManager.catalogueJSON.producto[p]));
				nproduct++;
			}
			//console.log("EL LISTADO DE PRODUCTOS ES \n"+DataManager.productCarrousel);
			//console.log("EL LISTADO DE PRODUCTOS ES \n"+jQuery("#product-cat ul.list").html());
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
				DataManager.catalogueJSON.producto[idP].fotoGrande+'" class="img-inlist"/></aside><div><h2>'+DataManager.catalogueJSON.familia[f].familia+'</h2></div></li>');
				
		 }
	},
	initOutlet:function(){
		console.log("Empieza la carga del outlet");
		var nproduct=0;
		for(p in DataManager.catalogueJSON.outlet){
				console.log(DataManager.catalogueJSON.outlet[p].fotoGrande)
				/*console.log('<li><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				DataManager.catalogueJSON.producto[p].fotoGrande+'" height="100"/></li>');*/
				DataManager.addProductToList("#outlet-product-cat ul.list",DataManager.catalogueJSON.outlet[p]);
				/*jQuery("#outlet-product-cat ul.list").append('<li class="nav comp"><aside><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				DataManager.catalogueJSON.outlet[p].fotoGrande+'" class="img-inlist"/></aside><div><h2>'+DataManager.catalogueJSON.producto[p].outlet+'</h2></div></li>');*/
				
				/*normativas='';
				for(n in DataManager.catalogueJSON.outlet[p].normativas){
					normativas+='<img class="mini-logo" src="'+LocalFileManager.docsPath+"src/img_prod/"+
				DataManager.catalogueJSON.outlet[p].normativas[n]+'"/>';
				}*/
				
				DataManager.outletProductCarrousel.push(DataManager.getProductDetail(nproduct,DataManager.catalogueJSON.outlet[p]));
				nproduct++;
			}
			//console.log("EL LISTADO DE PRODUCTOS ES \n"+DataManager.productCarrousel);
			//console.log("EL LISTADO DE PRODUCTOS ES \n"+jQuery("#product-cat ul.list").html());
		$.UISetupCarousel({ target: '#outlet-product-viewer', panels: DataManager.outletProductCarrousel, loop: true,pagination:true });
		// $.UISetupCarousel({ target: '#product-carrousel', panels: DataManager.productCarrousel, loop: false });
		DataManager.outletCarouselObject=$('#outlet-product-viewer').data('carousel');
		 //console.log("El contenido del carrousel es "+DataManager.productCarrousel+" en "+DataManager.productCarrousel.length);
		 $('#outlet-product-carrousel').removeClass('navigable');
		
		 
		 
	},
	getClientsFromServer:function(dni,callBack,errorCallBack){
		var today = new Date();
		
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

var token=jQuery.sha256(today.dateFormat('Ymd')+'SecretoPublicoGahibre2014');

token=dni.trim()+"::"+token.trim();
console.log("El token es "+token);

var values = { };
values['token']=token;

		$.ajax({
			type:"POST",
			url:"http://datic.es/gahibre/webservice/cliente_ios.php",
			dataType:"text",
			data:values,
			success:function(r){
				console.log("El resultado obtenido de los clientes es "+r);
			callBack(r)	
			},
			error:function(r){
				
			errorCallBack(r);	
			}
		})
		
	},
	getProductsFromServer:function(callBack,errorCallBack){
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
			url:"http://datic.es/gahibre/webservice/servicio_ios.php",
			dataType:"text",
			data:values,
			success:function(r){
				//console.log("El resultado obtenido es "+r);
			callBack(r)	
			},
			error:function(r){
				errorCallBack(r);
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
		$('#search-model').blur();
		//console.log("Queremos buscar "+model);
		var regexp=new RegExp(".*"+model+".*","i");
		//console.log("La expresión regular es "+regexp.toString());
		
		var i=0;
		DataManager.searchProductCarrousel=new Array();
		for(g in DataManager.catalogueJSON.producto){
			//console.log("Recorremos el catálogo");
			//console.log("Vamos a comprobar la coincidencia con "+DataManager.catalogueJSON.producto[g].modelo);
			console.log("Comprobamos si "+regexp.toString()+" coincide con "+DataManager.catalogueJSON.producto[g].modelo);
			console.log("El resultado es "+regexp.test(DataManager.catalogueJSON.producto[g].modelo));
			if(regexp.test(DataManager.catalogueJSON.producto[g].modelo)){
				console.log("Hemos encontrado el producto "+DataManager.catalogueJSON.producto[g].modelo);
				DataManager.searchProductCarrousel.push(DataManager.getProductDetail(i,DataManager.catalogueJSON.producto[g]));
			i++;
			}
			
		}
		if(i>0){
			
			if(DataManager.searchCarouselObject!=null){
			console.log("Eliminamos el carousel del search");	
				 DataManager.searchCarouselObject.destroy();
				 $('#search-product-viewer').html('');
			}else{
			console.log("No es nulo");	
			}
			$('#search-product-carrousel').addClass('navigable');
			$.UISetupCarousel({ target: '#search-product-viewer', panels: DataManager.searchProductCarrousel, loop: true,pagination:true });
		// $.UISetupCarousel({ target: '#product-carrousel', panels: DataManager.productCarrousel, loop: false });
		DataManager.searchCarouselObject=$('#search-product-viewer').data('carousel');
		 //console.log("El contenido del carrousel es "+DataManager.productCarrousel+" en "+DataManager.productCarrousel.length);
		 $('#search-product-carrousel').removeClass('navigable');
		 console.log("Retornamos");
			return true;
			
			
			}
		return false;
	},
	searchFirstProductOfFamily:function(idFamily){
			
		var i=0;
		for(g in DataManager.catalogueJSON.producto){
			
			if(DataManager.catalogueJSON.producto[g].gama.idFamilia==idFamily){
			return i;	
			}
			i++;
		}
		
	},
	loadClients:function(dni,r){
		DataManager.clientsJSON=jQuery.parseJSON(r);
			console.log("Los datos de cliente son "+DataManager.clientsJSON.cliente);
			
			
			if(typeof(dni)!="undefined" && dni!==null){
				console.log("VAMOS A GUARDAR EL DNI "+dni);
				localStorage.setItem("dni",dni);	
				
			}else{
			return;	
			}
			
			/* cargamos los clientes en el select de pedidos*/
			console.log("Este perico tiene "+DataManager.clientsJSON.cliente.length);
			$("#customerSelect").html('');
			$("#customerSelect").append('<option value="-1">Seleccionar Cliente</option>');
			if(DataManager.clientsJSON.cliente[0].tipo=="REPRESENTANTE"){
				var clientes=DataManager.clientsJSON.cliente[0].representado;
				var idcli=1;
				$("#customerSelect").append('<option value="0">NUEVO CLIENTE</option>');
				for(cli in clientes){
					
					$("#customerSelect").append('<option value="'+idcli+'">'+clientes[cli].nombre+'</option>');
					idcli++;
				}
			
			}else{
				$("#customerSelect").append('<option value="0">'+DataManager.clientsJSON.cliente[0].nombre+'</option>');
			}
		
	},
	syncClients:function(dni){
		LoadingDialog.show("Comprobando credenciales...");
		DataManager.getClientsFromServer(dni,function(r){
		
		LoadingDialog.hide();
		console.log("El resultado que llega a syncClientes es "+r);
		cli=jQuery.parseJSON(r);
		console.log("El exito es "+cli.exito);
			if(cli.exito==0){
				console.log("No es el cliente correcto");
				DataManager.userDNI=null;
				$.UIPopup({
          id: "requestDNI",
          title: 'NIF INCORRECTO', 
          message: 'EL dni introducido no es correcto',
		  cancelButton:"Cerrar"
		  
				})
				/*LocalFileManager.readClients(function(r){
					DataManager.loadClients(dni,r);
				})*/
			}else{
				LocalFileManager.writeToClients(r);
				DataManager.loadClients(dni,r);	
				//Loguardamos en el localstorage
				
			}
			
		},function(r){
			console.log("Error al intentar conectar los clientes");
			LocalFileManager.readClients(function(r){
					DataManager.loadClients(dni,r);
				})
		})
	},
	requestDNI:function(){
		console.log("Me han pedido solicitar el DNI");
		$.UIPopup({
          id: "requestDNI",
          title: 'NIF NECESARIO', 
          message: 'Por favor introduzca dni para poder realizar pedidos<br/><input class="dnireq" type="text" placeholder="dni o nif" id="dni"/>', 
          cancelButton: 'Ahora no', 
          continueButton: 'Conectar', 
          callback: function() {
			  console.log("El dni escrito es "+$("#dni").val());
			  
            DataManager.userDNI=$("#dni").val();
			DataManager.syncClients(DataManager.userDNI);
          }
        });
	},
	getProductDetail:function(nproduct,product){
		
		normativas='';
				for(n in product.normativas){
					normativas+='<img class="mini-logo" src="'+LocalFileManager.docsPath+"src/img_prod/"+
				product.normativas[n]+'"/>';
				}
				
		return '<h2 data-nproduct="'+nproduct+'">Modelo '+product.modelo+'</h2>'+
            '<div class="center"><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				product.fotoGrande+'"/></div>'+
            '<div class="center"><span class="material" style="background-color:'+product.gama.color+';">'+product.gama.gama+'</span></div>'+
            '<div class="details"><h3>DESCRIPCIÓN</h3>'+
            '<p>'+product.descripcion+'</p>'+
            '<h3>USO</h3>'+
            '<p>'+product.uso+'</p>'+
            '<h3 class="inline">TALLA: </h3><span class="value">'+product.tallas.join()+'</span>'+
            '<h3 class="inline">EMPAQUETADO: </h3><span class="value">'+product.empaquetado+'</span>'+
            '<h3 class="inline">P.V.P: </h3><span class="value">'+product.precio+'</span>'+
			'<p><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				product.logotipo+'" class="mini-logo"/><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				product.categoria.categoria+'" class="mini-logo"/></p>'+
				'<p>'+normativas+'</p></div>';
	},
	addProductToList:function(list,product){
	
	jQuery(list).append('<li class="nav comp"><aside><img src="'+LocalFileManager.docsPath+"src/img_prod/"+
				product.fotoGrande+'" class="img-inlist"/></aside><div><h2>'+product.modelo+'</h2></div></li>');	
	}
	
};