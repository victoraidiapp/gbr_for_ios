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
		//console.log(cordova.file);
		LocalFileManager.init();
		DataManager.init();
		
		
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    manejadores: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
		$(document).on("tap singletap click","a.external",function(e){
			e.preventDefault();
			window.open($(this).attr('href'), "_system");
	return false;
		} )
		
		$(document).on("tap singletap click","#searchByCatalogo",function(e){
			e.preventDefault();
		console.log("Queremos cargar la sección de catalogo");
		app.navProducts("product-cat",true);
		return false;
		})
		
		$("#product-cat").on("tap singletap click","li",function(e){
			e.preventDefault();
			app.navProducts("product-carrousel",true);
		return false;
	
	})
	
	
	//Back button Productos
	$("nav.productos").on("tap",".back-button",function(e){
		if($("#product-cat").hasClass("current")){
			app.navProducts("product-init",false);
			return false;
		}
		
		if($("#product-carrousel").hasClass("current")){
			app.navProducts("product-cat",true);
			return false;
		}
		
		
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
	navProducts:function(section,backEnabled){
		$("#productos section.current").addClass("next").removeClass("current");
		$("#"+section).addClass("current").removeClass("next");
		if(backEnabled){
			$("nav.productos .back-button").show();
		}else{
			$("nav.productos .back-button").hide();
		}
	}
};


