module.exports = (io) => {
    listenForEvents(io);
}

const listenForEvents = (io) => {
    const printers = io.of('/printers'),
    clients = io.of('/clients');
    
    printers.on('status', status => {
        clients.to(status.id).emit('status', status);
    });
}