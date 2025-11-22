import WebSocket, { WebSocketServer } from 'ws';
import url from "url";
import jwt, { JwtPayload } from "jsonwebtoken";

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
    const token = queryParams.get("token") || "";

    const decoded = jwt.verify(token, "SECRET");
    if (!decoded || !(decoded as JwtPayload).userId) {
        ws.close();
        return;
    }
});
