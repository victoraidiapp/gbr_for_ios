// JavaScript Document
var OrderManager={
	
	init:function(){
		$('#order-details').on('update','li',function(){
			console.log("La expresión es "+$(this).find('.price-value').val()+'*'+$(this).find('.quantity-value').val())
			var subtotal=eval($(this).find('.price-value').val()+'*'+$(this).find('.quantity-value').val());
			$(this).find('.subtotal').text(subtotal);
			
		})
		
		$('#order-details').on('tap','.del-button',function(e){
			var p=$(this).parent().data("idproduct");
			var t=$(this).parent().data("idtalla");
			console.log("Queremos eliminar la tall "+t+" del producto "+p);
			console.log("Antes de eliminar el numero de tallas de "+p+" es "+DataManager.shopCart[p].tallas.length);
			if(DataManager.shopCart[p].tallas.length==1)
			{ DataManager.shopCart[p].tallas.pop();
			}else{
			var tr=DataManager.shopCart[p].tallas.splice(t,1);
			}
			console.log("Hemos eliminado la talla "+tr.talla);
			for(t in DataManager.shopCart[p].tallas){
			console.log("Todavía queda la talla "+	DataManager.shopCart[p].tallas[t].talla);
			}
			$(this).parents('li').remove();
			console.log("Despues de eliminar el numero de tallas de "+p+" es "+DataManager.shopCart[p].tallas.length);
			OrderManager.summaryOrder();
		})
		
		$("#checkout").on('tap','#empty-order',function(e){
			$("#order-details li").each(function(){
				$(this).find('.del-button').trigger('tap');
			})
		})
		
		$("#checkout").on('tap','#more-products',function(e){
			$(".button.productos").trigger('singletap');
			app.navProducts("product-cat",true);
		})
		
		//OrderManager.summaryOrder();
		
	},
	addToCart:function(){
		console.log("Vamos a añadir el currentProduct al shopcart ");
	var product=Array();
	product["detail"]=DataManager.currentProduct;
	console.log("El current product "+DataManager.currentProduct);
	product["tallas"]=Array();
	
	$("#product-sizes li").each(function(i){
		var v=$(this).find('.quantity').val();
		
		var ta=$(this).find('.size-value').html();
		
		if(parseInt(v)>0){
		var t=Array();
		t["talla"]=	ta;
		t["cantidad"]=v;
console.log("El valor de la talla "+t["talla"]+" es "+t["cantidad"]);
		product["tallas"].push(t);
		}
	})
	
	DataManager.shopCart[DataManager.currentProduct.modelo]=product;
	//console.log("El contenido del shopcart es "+DataManager.shopCart);
	OrderManager.updateOrder();
		DataManager.currentProduct=null;
	},
	
	updateOrder:function(){
		console.log("Me han pedido actualizar la orden de pedido");
		$('#order-details').html('');
		
		for(x in DataManager.shopCart){
			console.log("Vamos a añadir el producto "+x)
				var t=0;
				for(tt in DataManager.shopCart[x].tallas){
				$('#order-details').append('<li>'+
							'<div class="first-line">'+
							'	<span class="article">'+x+'</span>'+
								'<span class="size-label">Talla</span>'+
								'<span class="size-value">'+DataManager.shopCart[x].tallas[tt].talla+'</span>'+
								'<span class="discount-label">% Dto:</span>'+
								'<input type="number" class="discount-value" value="0"/>'+
								'</div>'+
							'<div class="second-line" data-idproduct="'+x+'" data-idtalla="'+tt+'">'+
								'<input type="number" class="quantity-value" value="'+DataManager.shopCart[x].tallas[tt].cantidad+'"/>'+
								'<span class="quantity-label">uds</span>'+
								'<input type="number" class="price-value" value="'+DataManager.shopCart[x].detail.precio+'"/>'+
								'<span class="price-label">€/ud</span>'+
								'<span class="subtotal">0</span>'+
								'<span class="del-button">X</span>'+
							'</div>'+
					'</li>');	
				t++;	
				}
				
		}
		OrderManager.updateValues();
	},
	checkDNI:function(){
		DataManager.userDNI=localStorage.getItem("dni");
			if(DataManager.userDNI==='undefined' || DataManager.userDNI===null){
				console.log("No hay usuario asociado");
				return false;
				
			}else{
				console.log("SÍ hay usuario asociado");
				return true;
				
				
			}
	
	},
	updateValues:function(){
	$('#order-details li').trigger('update');	
	},
	getOrderSize:function(){
		var n=0;
		
		for(p in DataManager.shopCart){
			
		if(	DataManager.shopCart[p].tallas.length>0){
			n++;
		}
		}
		console.log("En este carro hay un total de pedidos "+n);
		return n;
	},
	summaryOrder:function(){
	if(OrderManager.getOrderSize()>0){
		$("#order-summary").show();
	}else{
		$("#order-summary").hide();
	}
	
	}
	
};