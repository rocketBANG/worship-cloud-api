class SocketManager {
    static getManager() {
        if(this.manager === undefined) {
            this.manager = new SocketManager();
        }
        return this.manager;
    }

    setSocketIO(io) {
        this.io = io;

        io.on('connection', (client) => {
            client.on('subscribeEvent', (interval) => {
                this.clientList.push(client);
    })
    
        // Remove on disconnect
            client.on('disconnect', () => {
                let i = this.clientList.indexOf(client);
                this.clientList.splice(i, 1);
            })
    })
    }

    updateClients(event, data) {
        this.clientList.forEach(client => {
            client.emit(event, data);
        })
    }

    constructor() {
        this.clientList = [];
        
    }
}

exports.SocketManager = SocketManager;