var PurchaseController = function () {
	this.user = null;
	this.cart = new Cart();
	this.view = null;

	// Initialize ajax settings
	$.ajaxSetup({
		contentType: "application/json; charset=utf-8",
    	dataType: "json",
		headers: {
			'Authorization':'Bearer c02b4e4756ecab6837f1954c54ed7a36e1ec6f0bf07984829b39241dfdfdabc8',
			'Content-Type':'application/json'
		}
	});

	// Base url
	this.base_url = "https://oskiosk.herokuapp.com:443/";
}

PurchaseController.prototype.processIdentifier = function (identifier)
{
	var reference = this;
	$.ajax({
		url: reference.base_url + "identifiers/" + identifier + ".json"
	})
	.done(function( data ) {
		if(data)
			reference.handleIdentifierResponse(data);
	})
	.fail(function( xhr, textStatus, errorThrown ) {
		reference.handleIdentifierUnknown()
	});

	this.view.setLoading();
}

PurchaseController.prototype.handleIdentifierUnknown = function ()
{
	this.view.setReady();
	this.view.showErrorUnknown();
}

PurchaseController.prototype.handleIdentifierResponse = function (response)
{
	switch(response.type)
	{
		case 'user':
			this.loginUser(response.id, response.name);
			return;
		case 'product':
			this.addProductToCart(response.pricings[0].id, response.pricings[0].price,response.name);
			return;
	}

	this.view.setReady();
}

PurchaseController.prototype.loginUser = function (id, name)
{
	// Login the user
	this.user = new User(id, name, 0);
	this.cart.setUser(id);
	this.view.updateUser(this.user);
	this.sendCart();
}

PurchaseController.prototype.addProductToCart = function (id, price, name)
{

	// Put item on cart
	item = new CartItem(id, name, 1, price);
	this.cart.addItem(item);
	this.cart.serialize();
	this.view.updateCart(this.cart);
	this.sendCart();

}

PurchaseController.prototype.handleCartDivergence = function () {
	this.view.showErrorCart();
}

PurchaseController.prototype.handleCartResponse = function (response)
{
	switch(response.type)
	{
		case 'cart':
			// Create new cart from response
			var newcart = new Cart();
			newcart.copyfrom(response);
			
			// Check for equality
			if(!this.cart.equals(newcart)) {
				this.handleCartDivergence();
			}

			// Use the new cart from now on
			this.cart = newcart;
			this.view.updateCart(this.cart);
			break;
	}
	this.view.setReady();
}

PurchaseController.prototype.sendCart = function ()
{
	var reference = this;
	var method = 'POST';
	var cart_url = 'carts.json';

	// Default method is POST. If cart already exists, PATCH instead.
	if (this.cart.id)
	{
		method = 'PATCH';
		cart_url = 'carts/' + this.cart.id + '.json';
	}

	$.ajax({
		url: reference.base_url + cart_url,
		type: method,
		data: reference.cart.serialize()
	})
	.done(function( data ) {
		if(data)
			reference.handleCartResponse(data);
	})
	.fail(function( xhr, textStatus, errorThrown ) {
		alert(xhr.status);
	});
}

PurchaseController.prototype.setView = function (view)
{
	this.view = view;
}

PurchaseController.prototype.checkout = function()
{
	if(!this.cart.id || !this.cart.user_id || this.cart.cart_items.length==0)
	{
		this.view.showErrorCheckout();
		return;
	}
	var reference = this;
	var method = 'POST';

	var object = new Object();
	object.cart_id = this.cart.id;

	$.ajax({
		url: reference.base_url + "transactions.json",
		type: method,
		data: JSON.stringify(object)
	})
	.done(function( data ) {
		// Reset UI
		location.reload();
	})
	.fail(function( xhr, textStatus, errorThrown ) {
		alert(xhr.status);
	});
}