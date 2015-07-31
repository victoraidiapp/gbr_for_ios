// JavaScript Document
var LocalFileManager={
docDirectory:null,
catalogueFile:null,
clientesFile:null,
docsPath:null,
docsPath:"/Documents/",
    
    
init:function(callback){
    //Inicializamos el sistema
    //Inicializamos el sistema
    console.log("Inicializamos el localfilemanager");
    deviceDir={'iOS':cordova.file.documentsDirectory,'Android':cordova.file.dataDirectory};
    console.log("La plataforma es "+device.platform);
    window.resolveLocalFileSystemURL(deviceDir[device.platform], function(dirEntry){
                                     LocalFileManager.docDirectory=dirEntry;
                                     console.log("El directorio raiz es "+dirEntry.fullPath);
                                     dirEntry.getFile('catalogue.txt', {}, function(fileEntry) {
                                                      LocalFileManager.catalogueFile=fileEntry;
                                                      console.log("He asignado el arcihvo que ya existía "+fileEntry.fullPath );
                                                      },function(err){
                                                      dirEntry.getFile('catalogue.txt',{create: true, exclusive: true}, function(fileEntry) {
                                                                       LocalFileManager.catalogueFile=fileEntry;
                                                                       console.log("He creado el archivo");
                                                                       })
                                                      
                                                      
                                                      
                                                      })
                                     
                                     /*CREAMOS EL ARCHIVO DE CLIENTES*/
                                     dirEntry.getFile('clientes.txt', {}, function(fileEntry) {
                                                      LocalFileManager.clientesFile=fileEntry;
                                                      console.log("He asignado el arcihvo que ya existía "+fileEntry.fullPath );
                                                      },function(err){
                                                      dirEntry.getFile('clientes.txt',{create: true, exclusive: true}, function(fileEntry) {
                                                                       LocalFileManager.clientesFile=fileEntry;
                                                                       console.log("He creado el archivo de clientes");
                                                                       })
                                                      
                                                      
                                                      
                                                      })
                                     //LocalFileManager.docsPath=dirEntry.toURL();
                                     //Creamos la carpeta de imagenes de productos
                                     /*dirEntry.getDirectory("src",{create: true}, function(dirEntry) {
                                      console.log("He creado correctamente el directorio "+dirEntry.fullPath);
                                      
                                      },function(err){
                                      console.log("He tenido algunos problemas al crear el directorio "+err.code)
                                      })*/
                                     console.log("Vamos a crear los directorios en "+LocalFileManager.docDirectory.name);
                                     /*LocalFileManager.createDirectory(LocalFileManager.docDirectory,"src");
                                      LocalFileManager.createDirectory(LocalFileManager.docDirectory.getDirectory("src"),"img_prod");
                                      LocalFileManager.createDirectory(LocalFileManager.docDirectory.getDirectory("src"),"img_main");*/
                                     
                                     LocalFileManager.docDirectory.getDirectory('src',{},function(){
                                                                                console.log("El directorio SRC no existe");
                                                                                },function(err){
                                                                                LocalFileManager.createDirectory(LocalFileManager.docDirectory,'src',function(){
                                                                                                                 
                                                                                                                 LocalFileManager.createDirectory(LocalFileManager.docDirectory,'src/img_prod',null,null);
                                                                                                                 LocalFileManager.createDirectory(LocalFileManager.docDirectory,'src/img_main',null,null);
                                                                                                                 LocalFileManager.createDirectory(LocalFileManager.docDirectory,'src/albaranes',null,null);
                                                                                                                 
                                                                                                                 },null);
                                                                                
                                                                                
                                                                                });
                                     
                                     /*
                                      LocalFileManager.docDirectory.getDirectory('src/img_prod',{},function(){
                                      console.log("El directorio de img_prod ya existe");
                                      },function(err){
                                      console.log("El dir img_prod no existe");
                                      var path1='src/img_prod';
                                      LocalFileManager.createDirs(LocalFileManager.docDirectory,path1.split('/'));
                                      });
                                      
                                      LocalFileManager.docDirectory.getDirectory('src/img_main',{},function(){
                                      console.log("El direcotio img_main ya existe");
                                      },function(err){
                                      var path2='src/img_main';
                                      console.log("El directorio img_main no exite, lo vamos a crear");
                                      LocalFileManager.createDirs(LocalFileManager.docDirectory,path2.split('/'));
                                      })
                                      
                                      LocalFileManager.docDirectory.getDirectory('albaranes',{},function(){
                                      console.log("El direcotio albaranes ya existe");
                                      },function(err){
                                      var path2='src/albaranes';
                                      console.log("El directorio de albaranes no exite, lo vamos a crear");
                                      LocalFileManager.createDirs(LocalFileManager.docDirectory,path2.split('/'));
                                      })
                                      */
                                     
                                     callback();
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
writeToClients:function(r){
    console.log("Invocada la función para escribir en el archivo de clientes");
    //console.log("Queremos escribir "+r);
    LocalFileManager.clientesFile.createWriter(function(fileWriter) {
                                               
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
readCatalogue:function(callback,errorCallBack){
    console.log("Iniciamos la lectura");
    LocalFileManager.catalogueFile.file(function(file) {
                                        var reader = new FileReader();
                                        console.log("Hemos creado el FileReader");
                                        reader.onloadend = function(e) {
                                        callback(reader.result);
                                        
                                        
                                        };
                                        reader.onerror=function(){
                                        console.log("Ha ocurrido un error al leer");	
                                        errorCallBack();
                                        }
                                        reader.readAsText(file);
                                        }, function(err){
                                        console.log("Ha ocurrido un error al obtener el file");	
                                        errorCallBack();
                                        });
    
},
readClients:function(callback){
    console.log("Iniciamos la lectura");
    LocalFileManager.clientesFile.file(function(file) {
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
downloadFile:function(remote,local,success,errorf){
    
    DataManager.getRemoteBlob(remote,function(blob){
                              console.log("Ya hemos descargado el blob de "+remote);
                              LocalFileManager.docDirectory.getFile(local,{create:true,exclusive:true},function(fEntry){
                                                                    console.log("Queremos escribir en "+fEntry.toURL())
                                                                    fEntry.createWriter(function(fWriter){
                                                                                        fWriter.write(blob);
                                                                                        console.log("Hemos escrito en local en "+fEntry.toURL());
                                                                                        success();
                                                                                        },errorf)
                                                                    
                                                                    },errorf)
                              },errorf)
},
createDirectory:function(rootDirEntry, name,callBack,errorCallBack) {
    // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
    console.log("Creamos el directorio "+name);
    console.log(" en el directorio "+rootDirEntry.fullPath)
    rootDirEntry.getDirectory(name, {create: true}, function(dirEntry) {
                              console.log("Creado el directorio "+dirEntry.fullPath);
                              if(callBack!=null) callBack();
                              }, function(err){
                              console.log("Fallo al crear el directorio ");  
                              if(errorCallBack!=null) errorCallBack();
                              });
},
    
    
createDirs:function(rootDirEntry, folders) {
    // Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
    
    if (folders[0] == '.' || folders[0] == '') {
        folders = folders.slice(1);
    }
    rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
                              // Recursively add the new subfolder (if we still have another to create).
                              console.log("Creando "+folders[1]+" en "+folders[0])
                              if (folders.length) {
                              LocalFileManager.createDirs(dirEntry, folders.slice(1));
                              }
                              }, function(err){
                              console.log("Error al crear dir "+folders[0]);  
                              });
},
    
    
writePDF:function(customer,output,success){
    var f=new Date();
    var file_name='Alabaran_'+f.getFullYear()+f.getMonth()+f.getDay()+f.getHours()+f.getMinutes()+f.getSeconds()+'.pdf';
    console.log("Queremos crear el PDF "+file_name);
    LocalFileManager.docDirectory.getFile('src/albaranes/'+file_name,{create:true,exclusive:true},function(fEntry){
                                          console.log("Queremos escribir en "+fEntry.toURL())
                                          
                                          fEntry.createWriter(function(writer) {
                                                              console.log("Hemos creado un writer");
                                                              console.log("Empezamos a escribir");
                                                              writer.write(output);
                                                              console.log("Hemos escrito en local en "+fEntry.toURL());
                                                              success(fEntry.toURL());
                                                              
                                                              })
                                          
                                          
                                          
                                          
                                          
                                          
                                          
                                          },LocalFileManager.errorHandler)
    
},
errorHandler:function(e) {
    var msg = '';
    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    };
    
    console.log('ERROR '+msg);
}
};