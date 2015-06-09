/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var $loc;
var app = {
	
    // Application Constructor
    initialize: function() {
		console.log("Se inicializa la aplicación");
        this.manejadores();
		LoadingDialog.init();
		//console.log(cordova.file);
		LocalFileManager.init(function(){
			DataManager.init(function(){
				OrderManager.init();
			});
		});
		
		
		
		
    },
	orientationChange:function(){
		
		console.log("Ha ocurrido un cambio de orientación");
		$('#product-carrousel').addClass('navigable');
		DataManager.carouselObject.resize();
		$('#product-carrousel').removeClass('navigable');
	},
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    manejadores: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
		$(document).on("tap","a.external",function(e){
			e.preventDefault();
			window.open($(this).attr('href'), "_system");
	return false;
		})
		
		$(document).on("singletap",".more-products",function(e){
			$('.popup').UIPopupClose();
			OrderManager.addToCart();
			app.navProducts("#productos","product-cat",true);
			
		})
		
		$(document).on("singletap",".goto-checkout",function(e){
			$(".button.pedidos").trigger('singletap');
			$('.popup').UIPopupClose();
			OrderManager.addToCart();
			//$.UIGoToArticle("#pedidos");
			
			OrderManager.checkoutEnabled=false;
			app.navProducts("#productos","product-cat",true);
			setTimeout(function f(){ console.log("Activamos los input del chekout");OrderManager.checkoutEnabled=true},500);
			
		})
		
		$(document).on("tap","#searchByCatalogo",function(e){
			e.preventDefault();
		console.log("Queremos cargar la sección de catalogo");
		app.navProducts("#productos","product-cat",false);
		return false;
		})
		
		$(document).on("tap","#showFamilia",function(e){
			e.preventDefault();
		
		app.navProducts("#productos","product-fam",false);
		return false;
		})
		
		
		
		$("#product-cat").on("tap","li",function(e){
			e.preventDefault();
			app.navProducts("#productos","product-carrousel",false);
			//DataManager.carouselObject.goToPanel($(this).index()-1);
			DataManager.carouselObject.goToPanel($(this).index());
		return false;
	
	})
	
	$("#outlet-product-cat").on("tap","li",function(e){
			e.preventDefault();
			app.navProducts("#outlet","outlet-product-carrousel",false);
			//DataManager.carouselObject.goToPanel($(this).index()-1);
			DataManager.outletCarouselObject.goToPanel($(this).index());
		return false;
	
	})
	
	$("#product-fam").on("tap","li",function(e){
			e.preventDefault();
			app.navProducts("#productos","product-carrousel");
			//DataManager.carouselObject.goToPanel($(this).index()-1);
			DataManager.carouselObject.goToPanel($(this).data('gotoproduct'),false);
		return false;
	
	})
	
	
	
	
	window.addEventListener('orientationchange',app.orientationChange);
	
	$(document).on("search","#search-model",function(e){
		e.preventDefault();
		console.log("Quieres buscar");
		var sr=DataManager.searchModel($(this).val());
		if(sr!=null){
			app.navProducts("#productos","product-carrousel",false);
			DataManager.carouselObject.goToPanel(sr);
			$(this).blur();
		}else{
		console.log("No lo encuentro");	
		};
		return true;
	})
	$(document).on("searh submit","#form-search",function(e){
		e.preventDefault();
		console.log("Quieres buscar desde el form");
	})
	
	$("nav.productos").on("tap",".add-button",function(e){
		
		$.UIPopup({
          id: "addToCart",
          title: 'PRODUCTO AÑADIDO', 
          message: '<div class="popup-buttons"><span class="popup-button more-products">Añadir más</span><span class="popup-button goto-checkout">Ir al pedido</span></div>', 
        });
		OrderManager.addToCart();
	})
	
	$("nav.productos").on("tap",".shop-button",function(e){
		if(DataManager.userDNI==='undefined' || DataManager.userDNI===null){
		DataManager.requestDNI();	
		return;
	}
		
		var n=$("#product-viewer .carousel-panel-active h2").data("nproduct");
		var tallas=DataManager.catalogueJSON.producto[n].tallas;
		$("#product-sizes").html('');
		for(t in tallas){
			$("#product-sizes").append('<li><div class="first-line"><input type="checkbox" id="add"/><span class="article">'+DataManager.catalogueJSON.producto[n].modelo+'</span><span class="size-label">Talla</span><span class="size-value">'+tallas[t]+'</span></div>                <div class="second-line"><input type="text" class="quantity" value="0"/><span class="quantity-button plus" data-operation="+'+DataManager.catalogueJSON.producto[n].cantidad+'">+</span><span class="quantity-button minor" data-operation="-'+DataManager.catalogueJSON.producto[n].cantidad+'">-</span></div></li>')
		}
		
		DataManager.currentProduct=DataManager.catalogueJSON.producto[n];
		
		app.navProducts("#productos","add-to-cart",false);
		console.log("La lista de tallas del pedido es "+$("#product-sizes").html());
	})
	
	$("#add-to-cart").on("tap","li",function(e){
		console.log("Alguien me ha picado y mi contenido es "+$(this).html());
	})
	//Quantity-Buttons
	$("#product-sizes").on("tap",".quantity-button",function(e){
		console.log("Has picado en un boton de cantidad");
		$(this).siblings('.quantity').trigger('updateVal',[$(this).data('operation')]);
	})
	
	
	
	$('#product-sizes').on("updateVal",".quantity",function(e,operation){
		var v=$(this).val();
		console.log("El valor actual es "+v);
		console.log("El valor recibido "+operation);
		v=eval(v+operation);
		if(v<0) return;
		$(this).val(v);
		$(this).parents('li').trigger("updateCheck");
	})
	$('#product-sizes').on("updateCheck","li",function(e){
		var v=$(this).find('.quantity').val();
		console.log("El valor de la talla es "+v);
		if(v>0){
			console.log("Marcamos el checkbox");
			 $(this).find('#add').prop('checked',true);
			 
		}else{
			$(this).find('#add').prop('checked',false);
			console.log("Marcamos el checkbox");
			
		}
		
	})
	
	//Back button Productos
	$("nav.productos").on("tap",".back-button",function(e){
		e.preventDefault();
		
		app.navProducts("#productos",$("#productos section.current").data('backto'),true);
		
		return false;
		
		
	})
		
		
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    },
	navProducts:function(article,section,backing){
		var id=$(article+" section.current").attr("id");
		
		$(article+" section.current").addClass("next").removeClass("current");
		$("#"+section).addClass("current").removeClass("next");
		if(!backing) $("#"+section).data('backto',id);
		//console.log("El contenido del product destino es "+$("#"+section).html());
		//console.log("El backEnabled es "+$("#"+section).data('backenabled'));
		if($("#"+section).data('backenabled')===true){
			$("nav.productos .back-button").show();
		}else{
			$("nav.productos .back-button").hide();
		}
		
		if($("#"+section).data('shopenabled')===true){
			$("nav.productos .shop-button").show();
		}else{
			$("nav.productos .shop-button").hide();
		}
		
		if($("#"+section).data('addenabled')===true){
			$("nav.productos .add-button").show();
		}else{
			$("nav.productos .add-button").hide();
		}
	}
	
};


