import WebSocket, { WebSocketServer } from 'ws';
import url from "url";

const wss = new WebSocketServer({
    port: 8080
});

wss.on('connection', (ws, req) => {
    // 1st way
    //    console.log(typeof url.parse(req.url!, true).query); 
    //    const value = url.parse(req.url!, true).query;
    //    console.log(value.token);


    // if you want to work with url query parameters
    const url = req.url;

    if (!url){
        return;
    }

    console.log(url); // /?token=abacaa&key=1111
    const paramurl= url.split('?')[1];
    console.group(paramurl) // token=abacaa&key=1111
    const queryParams = new URLSearchParams(paramurl);
    console.log(queryParams); // { 'token' => 'abacaa', 'key' => '1111' }
});
