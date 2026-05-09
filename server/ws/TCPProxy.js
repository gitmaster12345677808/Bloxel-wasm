'use strict';

import net from 'net';

// Generic TCP tunnel — forwards raw bytes between the WebSocket client and a real TCP server
export class TCPProxy {
    constructor(client, host, port) {
        this.client = client;
        this.socket = net.createConnection({ host, port });
        this.queue  = [];
        this.ready  = false;

        this.socket.on('connect', () => {
            this.ready = true;
            for (const chunk of this.queue) this.socket.write(chunk);
            this.queue = [];
        });

        this.socket.on('data', (data) => {
            this.client.send(data);
        });

        this.socket.on('error', (err) => {
            this.client.log(`TCPProxy error: ${err.message}`);
            this.close();
        });

        this.socket.on('close', () => this.client.close());
    }

    forward(data) {
        const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
        if (this.ready) {
            this.socket.write(buf);
        } else {
            this.queue.push(buf);
        }
    }

    close() {
        if (this.socket) {
            this.socket.destroy();
            this.socket = null;
        }
    }
}
