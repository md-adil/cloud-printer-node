const socket = io('/clients');

$.get('/printers/active', printers => {
	printers.forEach(addPrinter);
});

const printerContainer = $('#printers');

const addPrinter = printer => {
	console.log(printer);
	$('<li />', { 'data-id': printer.id, 'class': 'list-group-item', text: printer.name })
	.appendTo(printerContainer);
};

const removePrinter = id => {
	$(`[data-id="${ id }"]`).remove();
}

socket.on('printer connect', addPrinter);
socket.on('printer disconnect', removePrinter);

$('#print-form').submit(e => {
	e.preventDefault();
	sendFile(e.target);
})

const sendFile = form => {
	const submitBtn = $('#btn-submit').prop('disabled', true);
	$.ajax({
		type: "POST",
        enctype: 'multipart/form-data',
        url: "/print",
        data: new FormData(form),
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: response => handleResponse(submitBtn, response)
	});
}

const handleResponse = (submitBtn, res) => {
	submitBtn.prop('disabled', false);
	console.log(status)
	if(res.status === 'ok') {
		alert('File sent for printing');
	}
}