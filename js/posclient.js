$(document).ready(function(){

	var input_handler = new InputHandler();
	var base_view = new BaseView();
	var purchase_controller = new PurchaseController();
	purchase_controller.setView(base_view);
	input_handler.setView(base_view);
	base_view.setController(purchase_controller);

	document.addEventListener('keydown', function(event) {
    	input_handler.processKey(event.keyCode);
	});

	$('#debugtext').text('Please enter a barcode.');
	$('#usertext').text('Not logged in.');
	$('#producttext').text('No product in cart.');
	$('#username').text('Not logged in.');
	$('#userbalance').text('');
});