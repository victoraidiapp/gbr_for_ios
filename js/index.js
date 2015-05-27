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
		LocalFileManager.init();
		DataManager.init();
		
		
		
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
		
		$(document).on("tap","#searchByCatalogo",function(e){
			e.preventDefault();
		console.log("Queremos cargar la sección de catalogo");
		app.navProducts("product-cat",false);
		return false;
		})
		
		$(document).on("tap","#showFamilia",function(e){
			e.preventDefault();
		
		app.navProducts("product-fam",false);
		return false;
		})
		
		
		
		$("#product-cat").on("tap","li",function(e){
			e.preventDefault();
			app.navProducts("product-carrousel",false);
			//DataManager.carouselObject.goToPanel($(this).index()-1);
			DataManager.carouselObject.goToPanel($(this).index());
		return false;
	
	})
	
	$("#product-fam").on("tap","li",function(e){
			e.preventDefault();
			app.navProducts("product-carrousel");
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
			app.navProducts("product-carrousel",false);
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
	//Back button Productos
	$("nav.productos").on("tap",".back-button",function(e){
		e.preventDefault();
		
		app.navProducts($("#productos section.current").data('backto'),true);
		/*if($("#product-cat").hasClass("current")){
			app.navProducts("product-init",false);
			return false;
		}
		
		if($("#product-fam").hasClass("current")){
			app.navProducts("product-init",false);
			return false;
		}
		
		if($("#product-carrousel").hasClass("current")){
			app.navProducts("product-cat",true);
			return false;
		}*/
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
	navProducts:function(section,backing){
		var id=$("#productos section.current").attr("id");
		
		$("#productos section.current").addClass("next").removeClass("current");
		$("#"+section).addClass("current").removeClass("next");
		if(!backing) $("#"+section).data('backto',id);
		console.log("El contenido del product destino es "+$("#"+section).html());
		console.log("El backEnabled es "+$("#"+section).data('backenabled'));
		if($("#"+section).data('backenabled')===true){
			$("nav.productos .back-button").show();
		}else{
			$("nav.productos .back-button").hide();
		}
	},
	requestDNI:function(){
		$.UIPopup({
          id: "requestDNI",
          title: 'NIF NECESARIO', 
          message: 'Por favor introduzca dni para poder realizar pedidos<br/><input type="text" placeholder="dni o nif" id="dni"/>', 
          cancelButton: 'Ahora no', 
          continueButton: 'Conectar', 
          callback: function() {
            
			
          }
        });
	}
};


