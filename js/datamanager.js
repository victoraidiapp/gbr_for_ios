// JavaScript Document
var DataManager={
	getBikeLanes:function(callBack){
		$.ajax({
    type: "GET",
    url: "assets/BikeLanesZones.xml",
    dataType: "xml",
    success: function(xml){
		callBack($(xml));
		
	}
  });
		
		
	},
	getBikeStations:function(callBack){
		$.ajax({
			type:"GET",
			url:"https://clientes.domoblue.es/onroll_data/infoMarquesinas.php?key=bdedb8602218ecd22136f9546942b00e",
			dataType:"xml",
			success:function(xml){
				callBack($(xml));
	}
	
	})
	},
	getDistance:function(sourcelat,sourcelng,targetlat,targetlng,callBack){
	
	var request="http://maps.googleapis.com/maps/api/directions/json?origin="+sourcelat+","+sourcelng+"&destination="+targetlat+","+targetlng+"&sensor=false&mode=walking";
	$.ajax({
			type:"GET",
			url:"http://maps.googleapis.com/maps/api/directions/json?origin="+sourcelat+","+sourcelng+"&destination="+targetlat+","+targetlng+"&sensor=false&mode=walking",
			dataType:"json",
			success:function(r){
				console.log("La petición es "+request);
				console.log("El resultado es "+r);
				callBack(r["routes"][0]["legs"][0]["distance"]["text"]);
	}
	
	})
	
		
	}
	
};