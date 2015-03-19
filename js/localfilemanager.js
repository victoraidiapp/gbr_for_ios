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
		
		//Creamos la carpeta de imagenes de productos
		
		
		LocalFileManager.createDirectory(dirEntry,"src");
		LocalFileManager.createDirectory(dirEntry.getDirectory("/src"),"img_prod");
		LocalFileManager.createDirectory(dirEntry.getDirectory("/src"),"img_main");
		
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
	readCatalogue:function(callback){
		console.log("Iniciamos la lectura");
		LocalFileManager.catalogueFile.file(function(file) {
       var reader = new FileReader();
		console.log("Hemos creado el FileReader");
       reader.onloadend = function(e) {
		   callback(reader.result);
		   
		 
       };
	reader.onerror=function(){
	console.log("Ha ocurrido un error al leer");	
	}
       reader.readAsText(file);
    }, function(err){
	console.log("Ha ocurrido un error al obtener el file");	
	});
  
	},
	getLocalFile:function(file,success,error){
		LocalFileManager.docDirectory.getFile(file,{create:false},success,error)
	},
	downloadFile:function(remote,local){
		DataManager.getRemoteBlob(remote,function(blob){
			LocalFileManager.docDirectory.getFile(local,{create:true},function(fEntry){
				fEntry.createWriter(function(fWriter){
					fWriter.write(blob);
				},function(err){
					//Error al crear el file writer	
				})
				
			},function(err){
				
			})
		})
	},
	createDirectory:function(rootDirEntry, name) {
  // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
  
  rootDirEntry.getDirectory(name, {create: true}, function(dirEntry) {
    console.log("Creado el directorio "+name);
  }, errorHandler);
}

};