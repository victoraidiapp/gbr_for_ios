// JavaScript Document
var LocalFileManager={
	docDirectory:null,
	catalogueFile:null,
	
	init:function(){
	//Inicializamos el sistema
	window.resolveLocalFileSystemURL(cordova.file.documentsDirectory, function(dirEntry){
		LocalFileManager.docDirectory=dirEntry;
		dirEntry.getFile('catalogue.txt', {}, function(fileEntry) {
			LocalFileManager.catalogueFile=fileEntry;
			console.log("He asignado el arcihvo que ya existía");
		},function(err){
			dirEntry.getFile('catalogue.txt',{create: true, exclusive: true}, function(fileEntry) {
				LocalFileManager.catalogueFile=fileEntry;
				console.log("He creado el archivo");
			})
		})
	});
		
	},
	writeToCatalogue:function(r){
		console.log("Invocada la función para escribir en el archivo");
		//console.log("Queremos escribir "+r);
		LocalFileManager.catalogueFile.createWriter(function(fileWriter) {

      fileWriter.onwriteend = function(e) {
        console.log('Write completed.');
      };

      fileWriter.onerror = function(e) {
        console.log('Write failed: ' + e.toString());
      };

      // Create a new Blob and write it to log.txt.
      var blob = new Blob([r], {type: "text/plain"});
	
      fileWriter.write(blob);
console.log("Ya he escrito el archivo");
    }, function(err){
	console.log("Ha ocurrido un error al crear el writer");	
	});	
	},
	readCatalogue:function(){
		console.log("Iniciamos la lectura");
		LocalFileManager.catalogueFile.file(function(file) {
       var reader = new FileReader();
		console.log("Hemos creado el FileReader");
       reader.onloadend = function(e) {
		   console.log("Termino la lectura");
         console.log("El contenido es "+reader.result);
		 var obj = jQuery.parseJSON( reader.result );
		 for(x in obj){
			console.log("El valorde "+x+" es "+obj[x]); 
		 }
		 
       };
	reader.onerror=function(){
	console.log("Ha ocurrido un error al leer");	
	}
       reader.readAsText(file);
    }, function(err){
	console.log("Ha ocurrido un error al obtener el file");	
	});
  
	}
};