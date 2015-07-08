// JavaScript Document
var LoadingDialog={
init:function(){
    console.log("Inicializamos el LoadingDialog");
    jQuery('article').prepend('<div class="loading"></div>');
    this.hide();
    this.manejadores();
},
manejadores:function(){
    
},
show:function(texto){
    console.log(";ostramos el dialogo");
    //$('section.current').scrollTop(0);
    $('article.current .loading').html(texto).addClass('visible');;
    $('article.current .loading').nextAll().addClass('whenloading');
    
},
hide:function(t){
    console.log("Ocultamos");
    $('article.current .loading').delay(t).removeClass('visible');
    $('.whenloading').removeClass('whenloading');
}
    
}