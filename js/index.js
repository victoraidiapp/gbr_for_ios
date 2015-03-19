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
		console.log(cordova.file);
		LocalFileManager.init();
		DataManager.getProductsFromServer(function(r){
			console.log("Del servidor obtenemos "+r);
			
			LocalFileManager.writeToCatalogue(r);
			//LocalFileManager.readCatalogue();
			
			//Vamos a descargarnos las imágenes de los productos
			
			var jresponse=jQuery.parseJSON(r);
			
			for(p in jresponse.producto){
				console.log("La fotoGrande es "+jresponse.producto[p].fotoGrande);
				LocalFileManager.getLocalFile("/src/img_prod/"+jresponse.producto[p].fotoGrande,function(fEntry){
					
				},function(err){
					//Como el archivo no existe en local hay que descargarlo
					LocalFileManager.downloadFile(DataManager.SERVER.products+jresponse.producto[p].fotoGrande,"/src/img_prod/"+jresponse.producto[p].fotoGrande)
				})
			}
		
		});

		
		
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


