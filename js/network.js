var Purchase = function() {
	user_id: null,
	user_name: null,
	cart: null
}

function processIdentifier(identifier)
{
	$.ajax({
		url: "https://oskiosk.herokuapp.com:443/identifiers/" + identifier + ".json",
		headers: {
			'Authorization':'Bearer c02b4e4756ecab6837f1954c54ed7a36e1ec6f0bf07984829b39241dfdfdabc8',
			'Content-Type':'application/json'
		},
		beforeSend: function( xhr ) {
	    	xhr.setRequestHeader("Authorization: ");
	  	}
	})
	.done(function( data ) {
		if(data)
			handleIdentifierResponse(data);
	})
	.fail(function( xhr, textStatus, errorThrown ) {
		alert(xhr.status);
	});
}

function handleIdentifierResponse(data)
{
	switch(data.type)
	{
		case 'user':
			loginUser(response.id, response.name);
			break;
		case 'product':
			addProductToCart(response.pricings[0].id, response.pricings[0].price,response.name);
			break;
	}
}

function loginUser(id, name)
{
	// Login the user
	$('#usertext').text('Logged in as ' + name);
	Network.user_id = id;
	Network.user_name = name;
	setCartUser(id);
}

function addProductToCart(id, price, name)
{
	$('#producttext').text('Scanned product: ' + name + ', Price: ' + price);
	if(CurrentState.cart)
		items = CurrentState.cart.cart_items;
	else
		items = [];

	items.push({"pricing_id": id, "quantity": 1});
	updateCart({ "cart_items": items});
}