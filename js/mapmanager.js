// JavaScript Document


var MapManager={
	//En este objeto almacenaremos el mapa de Google.
	flagStationLayer:false,
	flagLanesLayer:false,
	flagLanesList:false,
	mapObject:null,
	BikeLanes:null,
	BikeLanesPolyLine:new Array(),//Este array contiene una colección de google.maps.Polyline que luego se pintan en el mapa con el método setMap
	BikeLanesMarker:new Array(),
	NearestBikeLaneLatLng:null,
	BikeStations:null,
	BikeStationsMarker:new Array(),
	//Esta función inicializa y pinta el mapa Google, para ello recibe el identificador del contenedor donde pintar el mapa
	init:function(mapId){
		
		var homeControlDiv = document.createElement('div');
		
		var controlUI=document.createElement('div');;
		homeControlDiv.style.margin = '20px';
		controlUI.setAttribute("class","home-button");
		homeControlDiv.appendChild(controlUI);
		
		homeControlDiv.index = 1;
		var infoWindow=new google.maps.InfoWindow();
	 var height = $(window).height();
                var width = $(window).width();

                $("#"+mapId).height(height-50);
                $("#"+mapId).width(width);
		var mapOptions = {
			    zoom: 13,
			    center: new google.maps.LatLng(40.9705347,-5.6637995),
				maxZoom:15,
				minZoom:12,
				//overviewMapControl:false,
				streetViewControl:false,
				//draggable:false,
				mapTypeControl:false
			  };
		MapManager.mapObject=new google.maps.Map(document.getElementById(mapId),
			      mapOptions);
				  
				  MapManager.mapObject.controls[google.maps.ControlPosition.LEFT_TOP].push(homeControlDiv);
				  
		
	},
	//Esta función mostrará la capa con los intercambiadores
	showBikeStationLayer:function(){
		LoadingDialog.show(Lang[$lang]["Cargando contenido"]);
		if(MapManager.BikeStationsMarker.length>0){
			for(m in MapManager.BikeStationsMarker){
				MapManager.BikeStationsMarker[m].setMap(MapManager.mapObject);	
			}
		MapManager.flagStationLayer=true;
		LoadingDialog.hide();
		return;	
		}
		
		if(MapManager.BikeStations!=null){
			
		MapManager.BikeStations.find("parada").each(function(){
			console.log("Procesamos la parada "+$(this).attr("nombre"));
			var marker = new google.maps.Marker({
    position: new google.maps.LatLng($(this).attr("lat"),$(this).attr("lng")),
	title:$(this).attr("codigo"),
	icon:'icons/show_bike_stations.png'
  });
  google.maps.event.addListener(marker, 'click', function() {
    MapManager.showBikeStationDialog(marker.getTitle());
  });
  MapManager.BikeStationsMarker.push(marker);
		})
		MapManager.showBikeStationLayer();
		return;
		}
		
		DataManager.getBikeStations(function(bs){
			MapManager.BikeStations=bs;
			MapManager.showBikeStationLayer();
		})
			
		
	},
	//Esta función ocultará la capa con los intercambiadores,
	hideBikeStationLayer:function(){
		for(m in MapManager.BikeStationsMarker){
				MapManager.BikeStationsMarker[m].setMap(null);	
			}
		MapManager.flagStationLayer=false;
	},
	//Esta función mostrará la capa con los carriles bici
	showBikeLaneLayer:function(){
		
		
		LoadingDialog.show(Lang[$lang]["Cargando contenido"]);
		console.log("El tmaaño de las lineas es "+MapManager.BikeLanesPolyLine.length);
		if(MapManager.BikeLanesPolyLine.length>0){//Si ya tenemos las lineas guardadas, simplemente las pintamos
		
		for(l in this.BikeLanesPolyLine){
		this.BikeLanesPolyLine[l].setMap(this.mapObject);//Pintamos las lineas en el mapa	
		}
		MapManager.flagLanesLayer=true;
		LoadingDialog.hide();
			return;
		}
		
		if(MapManager.BikeLanes!=null){//Ya tenemos los datos convertidos en el objeto jQuery pero no los hemos pintado
		//Aquí hay que pintar las lineas recorriendo los nodos del jQuery parseado desde el XML
			console.log("Intentamos obtener");
			MapManager.BikeLanes.find("LanesZone").each(function(){
				var laneMarker=false;
				console.log("El título de esta zona es "+$(this).children("name").text());
				//console.log("Distancia "+$(this).children("length").text());
				//console.log("Descripccion "+$(this).children("description").text());
				var color = $(this).children("color").text();
				//console.log("Color: "+color);
				$(this).find("Folder").each(function(){
					$(this).find("Placemark").each(function(){
						//console.log("Nombre"+$(this).children("name").text())
						var tipoLinea = $(this).children("styleUrl").text();
						//console.log("Tipo de Línea: " + tipoLinea);
						$(this).find("LineString").each(function(){
							var coordinates = $(this).children("coordinates").text();
							var pareja = coordinates.split(",0.0");
							
							
							
							var flagCoordinates =new Array();
							for( c in pareja){
								var ll=pareja[c].split(",");
								//console.log("Vamos a añadir las coordenadas "+ll[0]+","+ll[1]);
															
								if(typeof(ll[1])=="undefined"){
									//console.log("Esta no la añadimos "+separador[c]);
								continue;	
								}
								flagCoordinates.push(new google.maps.LatLng(parseFloat(ll[1]), parseFloat(ll[0])))
							}
							var $icons;
							if(!laneMarker){
								$icons=[{
								  icon: {    path: google.maps.SymbolPath.CIRCLE,fillColor:color,scale:10,strokeColor:color  },
								  offset: '100%'
								},
								{
								  icon: {    path: google.maps.SymbolPath.CIRCLE,fillColor:color,scale:4,strokeColor:color  },
								  offset: '100%'
								}];
								laneMarker=true;
							}
							var polyline = new google.maps.Polyline ({
								path: flagCoordinates,
								strokeColor: color,
								strokeOpacity: 1.0,
								strokeWeight: 5,
								icons: $icons
							})
							google.maps.event.addListener(polyline, 'click', function()
								  {
									MapManager.showBikeLaneDialog(color);
								  });
							MapManager.BikeLanesPolyLine.push(polyline);
							//polyline.setMap(MapManager.mapObject);
							
						})
						
					})
					
				})
			})		
			MapManager.showBikeLaneLayer();
			return;
		}
		console.log("Vamos a obtener los carriles");
		
		DataManager.getBikeLanes(function(b){
			MapManager.BikeLanes=b;
			console.log("Ya estamos de vuelta");
			MapManager.showBikeLaneLayer();
			
		});
		//
		return;
		
	},
	//Esta función ocultará la capa con los carriles bici,
	hideBikeLaneLayer:function(){
		for(l in this.BikeLanesPolyLine){
		this.BikeLanesPolyLine[l].setMap(null);//Pintamos las lineas en el mapa	
		}
		MapManager.flagLanesLayer=false;
		
	},
	//Esta funcion muestra el cuadro de diálogo con la info del intercambiador seleccionado
	showBikeStationDialog:function(station){
		
		
		
		var $station=MapManager.BikeStations.find('parada[codigo="'+station+'"]');
		
		MapManager.getDistanceToStation($station.attr("lat"),$station.attr("lng"));
		var $href='maps://maps.apple.com/?daddr='+$station.attr("lat")+','+$station.attr("lng")+'&directionsmode=walking';
		
		//$href='comgooglemaps://?daddr='+$station.attr("lat")+','+$station.attr("lng")+'&directionsmode=walking';
		$.UIPopup({
			id:'bsDialog',
			title:$station.attr("nombre"),
			message:'<div class="dialogLine"><span class="icon icon_candados"></span>'+Lang[$lang]["Candados disponibles:"] +'<strong>'+$station.attr("candadosLibres")+'</strong></div>'+
			'<div class="dialogLine"><span class="icon icon_bicis"></span>'+Lang[$lang]["Bicis disponibles:"] +'<strong>'+$station.attr("bicicletas")+'</strong></div>'+
			'<div class="dialogLine"><span class="icon icon_length"></span>'+Lang[$lang]["Distancia a estación:"] +'<strong id="distanceToStation" class="calculating"></strong></div>',
			cancelButton:Lang[$lang]['Volver'],
			continueButton:Lang[$lang]['Ruta'],
			callback:function(){
				console.log("Queremos abrir la direccion "+$href);
				window.open($href, "_system");
			}
		})
	},
	//Esta funcion muestra el cuadro de diálogo con la info del intercambiador seleccionado
	showBikeLaneDialog:function(laneColor){
		if(MapManager.BikeLanes!=null){
		MapManager.NearestBikeLaneLatLng=null;
		console.log("Buscamos el color "+laneColor);
		var $lane=MapManager.BikeLanes.find('color:contains("'+laneColor+'")').parent();
		console.log("El lane seleccionado es "+$lane.children("name").text());
		MapManager.getDistanceToLane($lane);
		$.UIPopup({
			id:'bsDialog',
			title:'<div class="dialogZone" style="background-color:'+$lane.children("color").text()+';">'+$lane.children("name").text()+'</div>',
			message:'<div class="dialogLine"><span class="icon icon_length"></span>'+Lang[$lang]["Longitud:"]+'<strong>'+$lane.children("length").text()+'</strong></div>'+
			'<div class="dialogLine"><span class="icon icon_toLane"></span>'+Lang[$lang]["Distancia al carril:"]+'<strong id="distanceToLane" class="calculating"></strong></div>',
			cancelButton:Lang[$lang]['Volver'],
			continueButton:Lang[$lang]['Ruta'],
			callback:function(){MapManager.initRouteToLane($lane)}
		})
		
		return;
		}
		
		DataManager.getBikeLanes(function(b){
			MapManager.BikeLanes=b;
			console.log("Ya estamos de vuelta");
			MapManager.showBikeLaneDialog(laneColor);
			
		});
		//
		return;
		
	},
	
	getDistanceToStation:function(stLat,stLng){
		navigator.geolocation.getCurrentPosition(function(position){
			console.log("Hemos obtenido la posición");
			DataManager.getDistance(stLat,stLng,position.coords.latitude ,position.coords.longitude,function(d){
				$("#distanceToStation").text(d).removeClass("calculating");
			});
		})
	},
	getDistanceToLane:function($lane){
		console.log("getDistanceToLane invocada");
		if(MapManager.NearestBikeLaneLatLng!=null){
			navigator.geolocation.getCurrentPosition(function(position){
			console.log("Vamos a mostrar la distancia del lane");
			DataManager.getDistance(MapManager.NearestBikeLaneLatLng.lat(),MapManager.NearestBikeLaneLatLng.lng(),position.coords.latitude ,position.coords.longitude,function(d){
				console.log("El resultado es "+d);
				$("#distanceToLane").text(d).removeClass("calculating");
			});
			
		})
		return;
		
		
		}
		MapManager.getNearestLatLngOfLane($lane,MapManager.getDistanceToLane);
	},
	getNearestLatLngOfLane:function($lane,$function){
		console.log("getNearestLatLngOfLane invocada");
		navigator.geolocation.getCurrentPosition(function(position){
				var $href;	
				var distance=1000000;
				var latlng;
				 $lane.find("LineString").each(function(){
							var coordinates = $(this).children("coordinates").text();
							var pareja = coordinates.split(",0.0");
												
							var flagCoordinates =new Array();
							for( c in pareja){
								var ll=pareja[c].split(",");
								//console.log("Vamos a añadir las coordenadas "+ll[0]+","+ll[1]);
															
								if(typeof(ll[1])=="undefined"){
									//console.log("Esta no la añadimos "+separador[c]);
								continue;	
								}
								var d=calculateDistance(new google.maps.LatLng(position.coords.latitude,position.coords.longitude),new google.maps.LatLng(parseFloat(ll[1]), parseFloat(ll[0])));
								if(d<distance){
									distance=d;
									latlng=new google.maps.LatLng(parseFloat(ll[1]), parseFloat(ll[0]));
								}
							}
							
				})
				MapManager.NearestBikeLaneLatLng=latlng;
				console.log("Ya hemos calculado el nearestlatlng, ahora ejecutaremos la funcion que es de tipo "+typeof($function));
				if(typeof($function) !=="undefined"){
					$function($lane);
				}
		})
	},
	initRouteToLane:function($lane){
				if(MapManager.NearestBikeLaneLatLng!=null){
				var $href='maps://maps.apple.com/?daddr='+MapManager.NearestBikeLaneLatLng.lat()+','+MapManager.NearestBikeLaneLatLng.lng()+'&directionsmode=walking';
				console.log("Queremos abrir la direccion "+$href);
				window.open($href, "_system");
				return;
				}
				MapManager.getNearestLatLngOfLane($lane,MapManager.initRouteToLane);
				//MapManager.initRouteToLane($lane);
			},
	hideLaneList:function(){
		MapManager.flagLanesList=false;
		$.UIGoToArticle("#mapa");
		
	},
	
	//Esta función mostrará el listado de los carriles bici
	showLaneList:function() {
		
		if($("#listaZonas .role-content ul").length>0){
			$.UIGoToArticle("#listaZonas");
			MapManager.flagLanesList=true;
			return;
		}

		if(MapManager.BikeLanes!=null){
			$("#listaZonas .role-content").append("<ul class='list'></ul>");		
			console.log("Obtenemos las zonas");
			MapManager.BikeLanes.find("LanesZone").each(function(){
				var $zones = $(this).children("name").text();
				var $color = $(this).children("color").text();
				console.log("El título de esta zona es "+$zones);
				console.log("Color: "+$color);
				$("#listaZonas .role-content ul").append('<li class="listZoneDialog"><h3 style="border-color:'+$color+';">'+$zones+'</h3></li>');		
			})
			
		}
		
		DataManager.getBikeLanes(function(b){
			MapManager.BikeLanes=b;
			console.log("Ya estamos de vuelta");
			MapManager.showLaneList();			
		});
		return;
		
		//Al final si no se ha cumplido ninguna de las dos condiciones habrá que hacer una llamada a DataManager.getBikeLanes
		
	},
	showNearestStation:function(){
		LoadingDialog.show(Lang[$lang]["Buscando la estación más cercana"]);
		if(MapManager.BikeStations!=null){
		//$(".tabbar .button.estacion").trigger("singletap");	
		
		
		navigator.geolocation.getCurrentPosition(function(position){
			
			console.log("Hemos obtenido la posición");
			var distance=100000000;
			var codigo;
			MapManager.BikeStations.find("parada").each(function(){
				var d=calculateDistance(new google.maps.LatLng(position.coords.latitude,position.coords.longitude),new google.maps.LatLng($(this).attr("lat"),$(this).attr("lng")));
				
				if(d<distance){
					distance=d;
					codigo=$(this).attr("codigo");
				}
				
			});
			LoadingDialog.hide();
			MapManager.showBikeStationDialog(codigo);
			
		})
		return;
		}
		DataManager.getBikeStations(function(bs){
			MapManager.BikeStations=bs;
			MapManager.showNearestStation();
		})
		
	},
	showNearestLane:function(){
		LoadingDialog.show(Lang[$lang]["Buscando carril más cercano"]);
	if(MapManager.BikeLanes!=null){
	//$(".tabbar .button.carril").trigger("singletap");	
	
		navigator.geolocation.getCurrentPosition(function(position){
			
			console.log("Hemos obtenido la posición");
			var distance=100000000;
			var color;
			MapManager.BikeLanes.find("LanesZone").each(function(){
				var colorLane=$(this).children("color").text();
				$(this).find("LineString").each(function(){
							var coordinates = $(this).children("coordinates").text();
							var pareja = coordinates.split(",0.0");
												
							var flagCoordinates =new Array();
							for( c in pareja){
								var ll=pareja[c].split(",");
								//console.log("Vamos a añadir las coordenadas "+ll[0]+","+ll[1]);
															
								if(typeof(ll[1])=="undefined"){
									//console.log("Esta no la añadimos "+separador[c]);
								continue;	
								}
								var d=calculateDistance(new google.maps.LatLng(position.coords.latitude,position.coords.longitude),new google.maps.LatLng(parseFloat(ll[1]), parseFloat(ll[0])));
								if(d<distance){
									distance=d;
									color=colorLane;
								}
							}
							
				})
				
				
				
				
				
			});
			LoadingDialog.hide();
			MapManager.showBikeLaneDialog(color);
			
		})
		return;
		}
		
		DataManager.getBikeLanes(function(b){
			MapManager.BikeLanes=b;
			
			MapManager.showNearestLane();
		});
		
	}
	
	
}