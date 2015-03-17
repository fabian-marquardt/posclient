var BaseView = function () {
	this.purchase_controller = null;
	this.input_text = '';
}

BaseView.prototype.confirm = function () {
	if(this.input_text != '') {
		// If something was typed, we check the identifier
		this.purchase_controller.processIdentifier(this.input_text);
		this.input_text = '';
	}
	else {
		// If not, we try to checkout that cart
		this.purchase_controller.checkout();
	}
	
};

BaseView.prototype.add = function () {
	// body...
};

BaseView.prototype.remove = function () {
	// body...
};

BaseView.prototype.input = function (text) {
	this.input_text = text;
	$('#inputtext').text(text);
};

BaseView.prototype.setController = function (controller) {
	this.purchase_controller = controller;
};

BaseView.prototype.updateCart = function (cart) {
	$('#cart').empty();

	total_price = 0;

	for (key in cart.cart_items)
	{
		item = cart.cart_items[key];
		price = item.unit_price * item.quantity / 100;
		total_price += price;

		$('#cart').append('<div> \
			<span class="item-quantity">' + item.quantity + 'x</span> \
			<span class="item-name">' + item.product_name + '</span> \
			<span class="item-price">' + price.toFixed(2) + ' €</span> \
			</div>');
	}

	$('#totalprice').text(total_price.toFixed(2) + ' €');
}

BaseView.prototype.updateUser = function (user) {

	$('#username').text(user.name);
	balance_formatted = user.balance.toFixed(2);
	$('#userbalance').text(balance_formatted + ' €');
}

BaseView.prototype.setLoading = function () {
	$('#throbber').show();
}

BaseView.prototype.setReady = function () {
	$('#throbber').hide();
}

BaseView.prototype.showErrorUnknown = function () {
	$('#error-message').text('Unknown product or user.');
	$('#errorbox').show();

	setTimeout(function() {
        $('#errorbox').hide();
    }, 3000);
};

BaseView.prototype.showErrorCart = function () {
	$('#error-message').text('Something went wrong while updating your cart. Please check your cart and scan the last item again.');
	$('#errorbox').show();

	setTimeout(function() {
        $('#errorbox').hide();
    }, 3000);
};

BaseView.prototype.showErrorCheckout = function () {
	$('#error-message').text('Not ready to check out. Login a user and at least one product.');
	$('#errorbox').show();

	setTimeout(function() {
        $('#errorbox').hide();
    }, 3000);
};