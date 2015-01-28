// JavaScript Document
var LoadingDialog={
init:function(){
	console.log("Inicializamos el LoadingDialog");
	jQuery('article section').prepend('<div class="loading"></div>');
	this.hide();	
	this.manejadores();
},
manejadores:function(){
	
},
show:function(texto){
	console.log(";ostramos el dialogo");
	$('article.current .loading').text(texto).addClass('visible');;
	$('article.current .loading').nextAll().addClass('whenloading');
},
hide:function(t){
	console.log("Ocultamos");
	$('article.current .loading').delay(t).removeClass('visible');	
	$('.whenloading').removeClass('whenloading');
}
	
}