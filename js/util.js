// JavaScript Document
calculateDistance = function(sourcePos,newLatLng) {
   // setup our variables
   var lat1 = sourcePos.lat();
   var radianLat1 = lat1 * ( Math.PI  / 180 );
   var lng1 = sourcePos.lng();
   var radianLng1 = lng1 * ( Math.PI  / 180 );
   var lat2 = newLatLng.lat();
   var radianLat2 = lat2 * ( Math.PI  / 180 );
   var lng2 = newLatLng.lng();
   var radianLng2 = lng2 * ( Math.PI  / 180 );
   // sort out the radius, MILES or KM?
   var earth_radius = 3959; // (km = 6378.1) OR (miles = 3959) - radius of the earth
 
   // sort our the differences
   var diffLat =  ( radianLat1 - radianLat2 );
   var diffLng =  ( radianLng1 - radianLng2 );
   // put on a wave (hey the earth is round after all)
   var sinLat = Math.sin( diffLat / 2  );
   var sinLng = Math.sin( diffLng / 2  ); 
 
   // maths - borrowed from http://www.opensourceconnections.com/wp-content/uploads/2009/02/clientsidehaversinecalculation.html
   var a = Math.pow(sinLat, 2.0) + Math.cos(radianLat1) * Math.cos(radianLat2) * Math.pow(sinLng, 2.0);
 
   // work out the distance
   var distance = earth_radius * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
 
   // return the distance
   return distance;
}

var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 

//Function to convert hex format to a rgb color
function rgb2hex(rgb) {
 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 $val="#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])
 return $val.toUpperCase();
}

function hex(x) {
  return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
 }