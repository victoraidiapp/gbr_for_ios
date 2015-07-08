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
    console.log("Se inicializa la aplicación");
    
    //Añadimos el estilo dinámico para el precio
    $('head').append(
                     $('<style/>', {
                       id: 'pricestyle',
                       html: '.product_price {visibility: hidden }'
                       })
                     );
    this.manejadores();
    LoadingDialog.init();
    //console.log(cordova.file);
    LocalFileManager.init(function(){
                          DataManager.init(function(){
                                           OrderManager.init();
                                           });
                          });
    
    
    
    
},
orientationChange:function(){
    
    console.log("Ha ocurrido un cambio de orientación");
    $('#product-carrousel').addClass('navigable');
    DataManager.carouselObject.resize();
    $('#product-carrousel').removeClass('navigable');
    
    $('#outlet-product-carrousel').addClass('navigable');
    DataManager.outletCarouselObject.resize();
    $('#outlet-product-carrousel').removeClass('navigable');
    
    if(DataManager.searchCarouselObject!=null){
        $('#search-product-carrousel').addClass('navigable');
        DataManager.searchCarouselObject.resize();
        $('#search-product-carrousel').removeClass('navigable');
        
    }
},
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
manejadores: function() {
    
    
    
    
    document.addEventListener('deviceready', this.onDeviceReady, false);
    
    $('article').on('navigationend', function(e) {
                    // e.target is the current article that loaded
                    
                    app.checkNavButtons();
                    })
    
    
    $(document).on("tap","a.external",function(e){
                   e.preventDefault();
                   window.open($(this).attr('href'), "_system");
                   return false;
                   })
    
    $(document).on("singletap",".more-products",function(e){
                   $('.popup').UIPopupClose();
                   
                   $("nav.current .back-button").trigger("singletap");
                   
                   })
    
    $(document).on("scroll","section",function(e){
                   console.log("Estas haciendo scroll en una section");
                   
                   })
    
    $(document).on("scroll","article",function(e){
                   console.log("Estas haciendo scroll en una article");
                   
                   })
    
    $(document).on("singletap",".goto-checkout",function(e){
                   //Hay que comprobar si hay productos añadidos
                   
                   var totalCheckout=$('section.current .sizes-list input[type="checkbox"]:checked').length;
                   console.log("Se han marcado "+totalCheckout);
                   
                   if(totalCheckout>0){
                   $.UIPopup({
                             id: "addToCart",
                             title: 'PRODUCTO AÑADIDO',
                             message: '<div class="popup-buttons"><span class="popup-button more-products">Añadir más</span><span class="popup-button goto-checkout-popup">Ir al pedido</span></div>',
                             });
                   OrderManager.addToCart();
                   }else{
                   
                   $.UIPopup({
                             id: "noItemsSelected",
                             title: 'PEDIDO',
                             message: 'No ha seleccionado ningún producto',
                             continueButton:'ACEPTAR'
                             });
                   }
                   
                   /*
                    var totalCheckout=$('section.current .sizes-list input[type="checkbox"]:checked').length;
                    console.log("Se han marcado "+totalCheckout);
                    
                    if(totalCheckout>0){
                    $('.popup').UIPopupClose();
                    OrderManager.addToCart();
                    //$.UIGoToArticle("#pedidos");
                    $(".button.pedidos").trigger('singletap');
                    OrderManager.checkoutEnabled=false;
                    //app.navProducts("#productos","product-cat",true);
                    setTimeout(function f(){ console.log("Activamos los input del chekout");OrderManager.checkoutEnabled=true},500);
                    }else{
                    
                    $.UIPopup({
                    id: "noItemsSelected",
                    title: 'PEDIDO',
                    message: 'No ha seleccionado ningún producto',
                    continueButton:'ACEPTAR'
                    });
                    }
                    
                    */
                   
                   
                   })
    
    $(document).on("singletap",".goto-checkout-popup",function(e){
                   //DEsahibilitamos los inut del checkout
                   OrderManager.disableInputs();
                   $('.popup').UIPopupClose();
                   OrderManager.emptyProductSizes();
                   $(".button.pedidos").trigger('singletap');
                   OrderManager.checkoutEnabled=false;
                   //app.navProducts("#productos","product-cat",true);
                   setTimeout(function f(){
                              OrderManager.enableInputs();
                              },500);
                   
                   })
    
    $(document).on("tap","#searchByCatalogo",function(e){
                   
                   console.log("Queremos cargar la sección de catalogo");
                   app.navProducts("#productos","product-cat",false);
                   return false;
                   })
    
    $(document).on("singletap","#showFamilia",function(e){
                   
                   
                   app.navProducts("#productos","product-fam",false);
                   return false;
                   })
    
    
    
    $("#product-cat").on("singletap","li",function(e){
                         console.log("Has picado en un item del product list");
                         app.navProducts("#productos","product-carrousel",false);
                         //DataManager.carouselObject.goToPanel($(this).index()-1);
                         DataManager.carouselObject.goToPanel($(this).index());
                         return false;
                         
                         })
    
    $("#outlet-product-cat").on("singletap","li",function(e){
                                e.preventDefault();
                                app.navProducts("#outlet","outlet-product-carrousel",false);
                                //DataManager.carouselObject.goToPanel($(this).index()-1);
                                DataManager.outletCarouselObject.goToPanel($(this).index());
                                return false;
                                
                                })
    
    $("#product-fam").on("singletap","li",function(e){
                         e.preventDefault();
                         app.navProducts("#productos","product-carrousel");
                         //DataManager.carouselObject.goToPanel($(this).index()-1);
                         DataManager.carouselObject.goToPanel($(this).data('gotoproduct'),false);
                         return false;
                         
                         })
    
    
    
    
    window.addEventListener('orientationchange',app.orientationChange);
    
    $(document).on("search","#search-model",function(e){
                   e.preventDefault();
                   console.log("Quieres buscar");
                   var sr=DataManager.searchModel($(this).val());
                   
                   if(sr!=false){
                   console.log("Hay Resultados");
                   app.navProducts("#productos","search-product-carrousel",false);
                   
                   }else{
                   console.log("No hay productos encontrados");
                   $.UIPopup({
                             id: "noResults",
                             title: 'MODELO NO ENCONTRADO',
                             message: 'Ningún producto coincide con la cadena de búsqueda',
                             cancelButton:"Cerrar"
                             
                             })
                   }
                   /*if(sr!=null){
                    app.navProducts("#productos","product-carrousel",false);
                    DataManager.carouselObject.goToPanel(sr);
                    $(this).blur();
                    }else{
                    console.log("No lo encuentro");
                    };*/
                   return true;
                   })
    $(document).on("searh submit","#form-search",function(e){
                   e.preventDefault();
                   console.log("Quieres buscar desde el form");
                   })
    
    $("nav.productos").on("singletap",".add-button",function(e){
                          //Hay que comprobar si hay productos añadidos
                          
                          var totalCheckout=$('section.current .sizes-list input[type="checkbox"]:checked').length;
                          console.log("Se han marcado "+totalCheckout);
                          
                          if(totalCheckout>0){
                          $.UIPopup({
                                    id: "addToCart",
                                    title: 'PRODUCTO AÑADIDO',
                                    message: '<div class="popup-buttons"><span class="popup-button more-products">Añadir más</span><span class="popup-button goto-checkout-popup">Ir al pedido</span></div>',
                                    });
                          OrderManager.addToCart();
                          }else{
                          
                          $.UIPopup({
                                    id: "noItemsSelected",
                                    title: 'PEDIDO',
                                    message: 'No ha seleccionado ningún producto',
                                    continueButton:'ACEPTAR'
                                    });
                          }
                          
                          })
    
    $("nav.productos").on("singletap",".shop-button.catalogue",function(e){
                          if(DataManager.userDNI==='undefined' || DataManager.userDNI===null){
                          DataManager.requestDNI();
                          return;
                          }
                          
                          var n=$("section.current .product-viewer .carousel-panel-active h2").data("nproduct");
                          var tallas=DataManager.catalogueJSON.producto[n].tallas;
                          $("#productos #product-sizes").html('');
                          
                          
                          for(t in tallas){
                          $("#productos #product-sizes").append('<li><div class="first-line"><input type="checkbox" id="add"/><span class="article">'+DataManager.catalogueJSON.producto[n].modelo+'</span><span class="size-label">Talla</span><span class="size-value">'+tallas[t]+'</span></div>                <div class="second-line"><input type="text" class="quantity" placeholder="0"/><span class="quantity-button plus" data-operation="+'+DataManager.catalogueJSON.producto[n].cantidad+'">+</span><span class="quantity-button minor" data-operation="-'+DataManager.catalogueJSON.producto[n].cantidad+'">-</span></div></li>')
                          }
                          
                          DataManager.currentProduct=DataManager.catalogueJSON.producto[n];
                          
                          app.navProducts("#productos","add-to-cart",false);
                          console.log("La lista de tallas del pedido es "+$("#product-sizes").html());
                          })
    
    $("nav.productos").on("singletap",".shop-button.outlet",function(e){
                          if(DataManager.userDNI==='undefined' || DataManager.userDNI===null){
                          DataManager.requestDNI();
                          return;
                          }
                          
                          var n=$("#outlet-product-viewer .carousel-panel-active h2").data("nproduct");
                          var tallas=DataManager.catalogueJSON.outlet[n].tallas;
                          $("#outlet #product-sizes").html('');
                          for(t in tallas){
                          $("#outlet #product-sizes").append('<li><div class="first-line"><input type="checkbox" id="add"/><span class="article">'+DataManager.catalogueJSON.outlet[n].modelo+'</span><span class="size-label">Talla</span><span class="size-value">'+tallas[t]+'</span></div>                <div class="second-line"><input type="text" class="quantity" placeholder="0"/><span class="quantity-button plus" data-operation="+'+DataManager.catalogueJSON.outlet[n].cantidad+'">+</span><span class="quantity-button minor" data-operation="-'+DataManager.catalogueJSON.outlet[n].cantidad+'">-</span></div></li>')
                          }
                          
                          DataManager.currentProduct=DataManager.catalogueJSON.outlet[n];
                          
                          app.navProducts("#outlet","outlet-add-to-cart",false);
                          console.log("La lista de tallas del pedido es "+$("#outlet #product-sizes").html());
                          })
    
    
    
    //Quantity-Buttons
    $(".sizes-list").on("singletap",".quantity-button",function(e){
                        console.log("Has picado en un boton de cantidad");
                        $(this).siblings('.quantity').trigger('updateVal',[$(this).data('operation')]);
                        })
    
    $('.sizes-list').on('change','input.quantity',function(){
                        var v=$(this).val();
                        var patron=new RegExp('[0-9,.]*');
                        if(patron.test($(this).val())){
                        console.log("El valor es correcto");
                        if(parseInt(v)>0){
                        
                        }else{
                        $(this).val('');
                        }
                        }else{
                        console.log("El valor introducido no es correcto");
                        $(this).val('');
                        }
                        
                        $(this).parents('li').trigger("updateCheck");
                        })
    
    $('.sizes-list').on("updateVal",".quantity",function(e,operation){
                        var v=$(this).val();
                        console.log("El valor actual es "+v);
                        console.log("El valor recibido "+operation);
                        v=eval(v+operation);
                        if(v<0) return;
                        $(this).val(v);
                        $(this).parents('li').trigger("updateCheck");
                        })
    $('.sizes-list').on("updateCheck","li",function(e){
                        var v=$(this).find('.quantity').val();
                        console.log("El valor de la talla es "+v);
                        if(v>0){
                        console.log("Marcamos el checkbox");
                        $(this).find('#add').prop('checked',true);
                        
                        }
                        
                        })
    
    //Back button Productos
    $("nav.productos").on("singletap",".back-button",function(e){
                          e.preventDefault();
                          var article=$(this).parent().next().attr('id');
                          console.log("El article es "+article);
                          app.navProducts("#"+article,$("#"+article+" section.current").data('backto'),true);
                          
                          return false;
                          
                          
                          })
    
    //Asociamos Función de preexecute en el tabbar pedidos
    
    $('.tabbar .button.pedidos').data('nav-pre-execute','app.nav_pre_pedidos');
    //Asociamos Funciónd e preexecute en el tabbar de productos
    $('.tabbar .button.productos').data('nav-pre-execute','app.nav_pre_productos');
    //Asociamos Funciónd e preexecute en el tabbar de home
    $('.tabbar .button.gahibre').data('nav-pre-execute','app.nav_pre_home');
    //Asociamos Funciónd e preexecute en el tabbar de outlet
    $('.tabbar .button.outlet').data('nav-pre-execute','app.nav_pre_outlet');
    
    $('article').on('navigationend',function(e){
                    console.log("Comprobamos los botones de navegación");
                    app.checkNavButtons();
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
navProducts:function(article,section,backing){
    var id=$(article+" section.current").attr("id");
    
    $(article+" section.current").addClass("next").removeClass("current");
    $("#"+section).addClass("current").removeClass("next");
    if(!backing) $("#"+section).data('backto',id);
    //console.log("El contenido del product destino es "+$("#"+section).html());
    //console.log("El backEnabled es "+$("#"+section).data('backenabled'));
    console.log("Vamos a la section "+section+" cuyo backenabled es "+$("#"+section).data('backenabled'));
    //$("section.current").scrollTop(0);
    app.checkNavButtons();
    
},
checkNavButtons:function(){
    console.log("Checamos los nav buttons");
    $("nav.current.productos .shop-button").hide();
    $("nav.current.productos .add-button").hide();
    
    if($("article.current section.current").data('backenabled')===true){
        $("nav.current.productos .back-button").show();
    }else{
        $("nav.current.productos .back-button").hide();
    }
    
    if($("article.current section.current").data('shopenabled')===true){
        $("nav.current.productos .shop-button").show();
    }else{
        $("nav.current.productos .shop-button").hide();
    }
    
    if($("article.current section.current").data('addenabled')===true){
        $("nav.current.productos .add-button").show();
    }else{
        $("nav.current.productos .add-button").hide();
    }
    
},
nav_pre_productos:function(){
    if(!$('#product-init').hasClass('current')){
        //Hay que ir hasta la portada de productos
        app.navProducts('#productos','product-init',true);
        
    }
    
    return false;
},
nav_pre_outlet:function(){
    if(!$('#outlet-product-cat').hasClass('current')){
        //Hay que ir hasta la portada de productos
        app.navProducts('#outlet','outlet-product-cat',true);
        
    }
    
    return false;
},
nav_pre_home:function(){
    if(!$('#about').hasClass('current')){
        app.navProducts('#home','about',true);	
    }else{
        app.navProducts('#home','promo',true);
    }
    
    return false;
},
    
nav_pre_pedidos:function(){
    
    console.log("Ejecutamos la función nav_pre_pedidos");
    console.log("En el carrito hay "+OrderManager.getOrderSize());
    if(OrderManager.getOrderSize()>0){
        
    }else{
        //El carrito de la compra notiene pedidos
        $.UIPopup({
                  id: "noArticles",
                  title: 'PEDIDO', 
                  message: 'No hay artículos en el pedido',
                  cancelButton:"ACEPTAR"
                  
                  })
        return true;	
    }
    if(DataManager.userDNI==='undefined' || DataManager.userDNI===null){
        
        
        console.log("No hay DNI");
        
        
        DataManager.requestDNI();
        return true;	
    }
    return false;
    
}
    
};


