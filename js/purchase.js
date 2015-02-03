var PurchaseController = function () {
	this.user = null;
	this.cart = new Cart();
	this.view = null;
}

PurchaseController.prototype.processIdentifier = function (identifier)
{
	var reference = this;
	$.ajax({
		url: "https://oskiosk.herokuapp.com:443/identifiers/" + identifier + ".json",
		headers: {
			'Authorization':'Bearer c02b4e4756ecab6837f1954c54ed7a36e1ec6f0bf07984829b39241dfdfdabc8',
			'Content-Type':'application/json'
		}
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
			break;
		case 'product':
			this.addProductToCart(response.pricings[0].id, response.pricings[0].price,response.name);
			break;
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
	this.cart.addItem(id, name, price);
	this.view.updateCart(this.cart);
	this.sendCart();

}

PurchaseController.prototype.handleCartResponse = function (response)
{
	switch(response.type)
	{
		case 'cart':
			this.cart.setId(response.id);
			break;
	}
}

PurchaseController.prototype.sendCart = function ()
{
	var reference = this;
	var method = 'POST';
	var cart_url = 'https://oskiosk.herokuapp.com:443/carts.json';

	// Default method is POST. If cart already exists, PATCH instead.
	if (this.cart.id)
	{
		method = 'PATCH';
		cart_url = 'https://oskiosk.herokuapp.com:443/carts/' + this.cart.id + '.json';
	}

	$.ajax({
		url: cart_url,
		type: method,
		data: JSON.stringify(reference.cart),
		contentType: "application/json; charset=utf-8",
    	dataType: "json",
		headers: {
			'Authorization':'Bearer c02b4e4756ecab6837f1954c54ed7a36e1ec6f0bf07984829b39241dfdfdabc8',
			'Content-Type':'application/json'
		}
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