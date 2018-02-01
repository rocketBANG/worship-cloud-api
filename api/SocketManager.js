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
            console.log(client);
            client.on('subscribeEvent', (interval) => {
                this.clientList.push(client);
                console.log('client is subscribed ', interval);
            });
        });
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