import WebSocket, { WebSocketServer } from 'ws';
import url from "url";

const wss = new WebSocketServer({
    port: 8080
});

wss.on('connection', (ws, req) => {
    const url = req.url;

    if (!url){
        return;
    }

    const paramurl= url.split('?')[1];
    const queryParams = new URLSearchParams(paramurl);
});
