var Cart = function () {
	this.cart_items = [];
}

Cart.prototype.addItem = function(id, name, price) {
	this.cart_items.push({"pricing_id": id, "product_name": name, "quantity": 1, "unit_price": price});
};

Cart.prototype.setId = function(id) {
	this.id = id;
}

Cart.prototype.setUser = function(id) {
	this.user_id = id;
}