const socket = io('/clients');

const $status = $('.status-log');

const statusLog = (message, type = 'progress') => {
	const el = $('<p/>',{text:message}),
		classMaps = {
			fail: 'text-danger',
			progress: 'text-info',
			success: 'text-success'
		}
	el.addClass(classMaps[type]);
	$status.append(el);
}

$.get('/printers/active', printers => {
	printers.forEach(addPrinter);
});

$('.btn-clear').click(function() {
	$status.empty();
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
	$status.empty();
	statusLog('Sending for printing...', 'progress');
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
		success: response => handleResponse(submitBtn, response),
		error: handleError.bind(null, submitBtn)
	});
}

const handleError = (btn, err) => {
	btn.prop('disabled', false);
	statusLog(err.responseJSON.message, 'fail');
}

const handleResponse = (submitBtn, res) => {
	statusLog(res.message, 'success');
	submitBtn.prop('disabled', false);
}