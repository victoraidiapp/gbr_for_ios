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
        this.manejadores();
		
		LoadingDialog.init();
		$.UIGoToArticle("#mapa");
		
		setTimeout(MapManager.init("gmapa"),3000);
		
		$("nav.zonas h1").text(Lang[$lang]["CARRILES BICI"]);


		
		
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    manejadores: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		jQuery(document).off("tap",".tabbar .button");
		jQuery(document).off("singletap",".tabbar .button");
		$('body').find('.tabbar').off('singletap', '.button');
		$(document).on("tap singletap click","a.external",function(e){
			e.preventDefault();
			window.open($(this).attr('href'), "_system");
	return false;
		} )
		
		
		//Manejamos el singletap en el home button para que muestre el diálogo con los créditos
		$(document).on("singletap",".home-button",function(event){
			console.log("El idioma es "+$lang);
			$.UIPopup({
			id:'creditsDialog',
			title:'<div class="dialogZone" style="background-color:#38a0f9;">Créditos</div>',
			message:'<div class="creditDialog">'+Lang[$lang]["Desarrollado por:"]+'<br> <a href="http://www.aidiapp.com" class="external"><img src="img/logoaidiapp.png"/></a></div>'+
			'<div class="creditDialog">'+Lang[$lang]["Desarrolladores:"]+'<br></div>'+
			'<p class="creditDialogP" style="text-align:left; margin-top:10px;">Víctor Pérez Tapia <br> Álvaro Benéitez Martín</p>'+
			'<div class="creditDialog">'+Lang[$lang]["Agradecimientos:"]+'<br></div>'+'<p class="creditDialogP" style="text-align:left; margin-top:10px;">'+Lang[$lang]["agradecimientosT"]+'</p>',
			cancelButton:'Volver',
			continueButton:null
			
		})
		})
		
		$(document).on("singletap","li.listZoneDialog",function(event){
			$.UIGoToArticle("#mapa");
			
			
			//Como jquery nos devuelve el color en formato rgb lo tenemos que convertir a hexadecimal (Que es el valor que espera la función showBikeLaneDialog
			//La función rgb2hex está definida en el archivo util.js
			MapManager.showBikeLaneDialog(rgb2hex($(this).find("h3").css("borderColor")));
		})
		
		jQuery(document).on("singletap",".tabbar .button", function(event){
			//event.stopPropagation();
	if($(this).hasClass("estacion")){
		$(this).toggleClass("selected");
		if(MapManager.flagLanesList){
		MapManager.hideLaneList();	
		$(".tabbar .listado").removeClass("selected");
		}
		
			if(MapManager.flagStationLayer){
				MapManager.hideBikeStationLayer();
				
			}else{
		MapManager.showBikeStationLayer();
			}
		return false;
	}else if($(this).hasClass("ruta")){
		console.log("Pulsado ruta.");
		MapManager.showNearestStation();
		return false;
	}else if($(this).hasClass("carril")){
		console.log("Pulsado carril.");
		//alert("Paramos un momento");
		$(this).toggleClass("selected");
		if(MapManager.flagLanesList){
		MapManager.hideLaneList();	
		$(".tabbar .listado").removeClass("selected");
		}
			if(MapManager.flagLanesLayer){
				MapManager.hideBikeLaneLayer()
			}else{
		MapManager.showBikeLaneLayer();
			}
		return false;
	}else if($(this).hasClass("rutabici")){
		MapManager.showNearestLane();
		console.log("Pulsado Ruta en bici.");
		return false;
	}else if($(this).hasClass("listado")){
		$(this).toggleClass("selected");
		if(MapManager.flagLanesList){
		MapManager.hideLaneList();	
		}else{
		MapManager.showLaneList();
		}
		console.log("Pulsado Listado.");
		return false;
	}

});
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
        
    }
};


