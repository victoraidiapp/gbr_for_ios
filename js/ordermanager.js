// JavaScript Document
var OrderManager={
	
	init:function(){
		$('#order-details').on('update','li',function(){
			console.log("La expresión es "+$(this).find('.price-value').val()+'*'+$(this).find('.quantity-value').val())
			var subtotal=eval($(this).find('.price-value').val()+'*'+$(this).find('.quantity-value').val());
			
			var desc=$(this).find('.discount-value').val();
			DataManager.shopCart[$(this).data('idproduct')].tallas[$(this).data('idtalla')].descuento=desc;
			if(desc>0){
			subtotal=subtotal-(subtotal*(desc/100));	
			}
			$(this).find('.subtotal').text(subtotal);
			DataManager.shopCart[$(this).data('idproduct')].tallas[$(this).data('idtalla')].subtotal=subtotal;
			OrderManager.updateTotal();
		})
		
		$(document).on('tap','#send-order',function(e){
			console.log("Queremos mandar el pedido");
			if(DataManager.clientsJSON.cliente[0].tipo=="REPRESENTANTE"){
				console.log("Es representante");
				console.log("El valor es "+$('#customerSelect').val()-1);
					customer=DataManager.clientsJSON.cliente[0].representado[$('#customerSelect').val()-1];
					
			}else{
				customer=DataManager.clientsJSON.cliente[0];
			}
			console.log("El cliente seleccionado es "+customer.nombre);
			var output=PDFGenerator.create(DataManager.clientsJSON.cliente[0].nombre,customer,DataManager.shopCart,$('#observaciones').val());
			
			console.log("Ya hemos generado el PDF");
			
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
		
		$('#order-details').on('blur','.updater',function(){
			console.log("Quremos actualizar esta linea de pedido");
			$(this).parents('li').trigger('update');
			
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
				$('#order-details').append('<li data-idproduct="'+x+'" data-idtalla="'+tt+'">'+
							'<div class="first-line">'+
							'	<span class="article">'+x+'</span>'+
								'<span class="size-label">Talla</span>'+
								'<span class="size-value">'+DataManager.shopCart[x].tallas[tt].talla+'</span>'+
								'<span class="discount-label">% Dto:</span>'+
								'<input type="number" class="discount-value updater" value="0"/>'+
								'</div>'+
							'<div class="second-line" data-idproduct="'+x+'" data-idtalla="'+tt+'">'+
								'<input type="number" class="quantity-value updater" value="'+DataManager.shopCart[x].tallas[tt].cantidad+'"/>'+
								'<span class="quantity-label">uds</span>'+
								'<input type="number" class="price-value updater" value="'+DataManager.shopCart[x].detail.precio+'"/>'+
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
	
	},
	updateTotal:function(){
		var total=0;
	$('#order-details .subtotal').each(function(){
		total+=parseFloat($(this).text());
	})
	$('#order-summary .total-value').text(total);
	
	}
	
};