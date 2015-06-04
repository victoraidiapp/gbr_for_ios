// JavaScript Document
var OrderManager={
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
		
	},
	
	updateOrder:function(){
		console.log("Me han pedido actualizar la orden de pedido");
		$('#order-details').html('');
		for(x in DataManager.shopCart){
			console.log("Vamos a añadir el producto "+x)
				for(tt in DataManager.shopCart[x].tallas){
				$('#order-details').append('<li>'+
							'<div class="first-line">'+
							'	<span class="article">'+x+'</span>'+
								'<span class="size-label">Talla</span>'+
								'<span class="size-value">'+DataManager.shopCart[x].tallas[tt].talla+'</span>'+
								'<span class="discount-label">% Dto:</span>'+
								'<input type="number" class="discount-value" value="0"/>'+
								'</div>'+
							'<div class="second-line">'+
								'<input type="number" class="quantity-value" value="'+DataManager.shopCart[x].tallas[tt].cantidad+'"/>'+
								'<span class="quantity-label">uds</span>'+
								'<input type="number" class="price-value" value="'+DataManager.shopCart[x].detail.precio+'"/>'+
								'<span class="price-label">€/ud</span>'+
								'<span class="subtotal">0</span>'+
								'<span class="del-button">X</span>'+
							'</div>'+
					'</li>');	
				}
		}
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
	
	}
	
};