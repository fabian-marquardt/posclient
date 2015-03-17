var Cart = function() {
	this.cart_items = new Array();
}

/*
var Cart = function(other_cart) {
	// Copy id if exists
	if(other_cart.id) {
		this.id = other_cart.id;
	}

	// Copy user id if exists
	if(other_cart.user_id) {
		this.user_id = other_cart.user_id;
	}

	this.cart_items = other_cart.cart_items.slice();
}
*/

Cart.prototype.addItem = function(cart_item) {

	// Fetch the item if it is in the cart
	item = this.getItem(cart_item.pricing_id);

	if(item == undefined) {
		// Item is not in cart, insert it
		this.cart_items.push(cart_item);
	}
	else {
		// Item exists in cart, increase quantity
		item.quantity += cart_item.quantity;
		// Update product name and unit price (they might have changed in the meantime)
		item.unit_price = cart_item.unit_price;
		item.product_name = cart_item.product_name;
	}
	
};

Cart.prototype.getItem = function(pricing_id) {
	// Find item for pricing id and return it
	for (var i=0; i<this.cart_items.length; i++) {
		if(pricing_id == this.cart_items[i].pricing_id) {
			return this.cart_items[i];
		}
	}

	// if not found, return undefined
	return undefined;
}

Cart.prototype.setId = function(id) {
	this.id = id;
}

Cart.prototype.setUser = function(id) {
	this.user_id = id;
}

Cart.prototype.equals = function(other_cart) {
	
	// IDs should match
	if(this.id && this.id != other_cart.id) {
		return false;
	}

	// user IDs should match
	if(this.user_id != other_cart.user_id) {
		return false;
	}

	// If carts differ in size, they are not equal
	if (this.cart_items.length != other_cart.cart_items.length) {
		return false;
	}

	// Check for each item in this cart ...
	for (var i=0; i<this.cart_items.length; i++) {
		item1 = this.cart_items[i];
		item2 = other_cart.getItem(item1.pricing_id);

		// ... if the item is in the other cart
		if(item2 == undefined) {
			return false;
		}

		// .. and if the item quantity is the same
		if(item1.quantity != item2.quantity || item1.unit_price != item2.unit_price) {
			return false;
		}

	}

	// If all checks succeeded, return true
	return true;
}

Cart.prototype.serialize = function() {
	return JSON.stringify(this);
}

Cart.prototype.copyfrom = function(other_cart) {

	// Copy id if exists
	if(other_cart.id) {
		this.id = other_cart.id;
	}

	// Copy user id if exists
	if(other_cart.user_id) {
		this.user_id = other_cart.user_id;
	}

	this.cart_items = other_cart.cart_items.slice();
}