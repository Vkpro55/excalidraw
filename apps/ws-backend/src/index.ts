import dotenv from "dotenv";
dotenv.config({ path: "./apps/ws-backend/.env" });

import WebSocket, { WebSocketServer } from 'ws';
import url from "url";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Config } from "@repo/backend-common/config";

import { prisma } from "@repo/db/client";

const wss = new WebSocketServer({
    port: 8080
});

// worst to worst dumb approach
interface User {
    ws: WebSocket;
    rooms: string[];
    userId: string
}

// this we are talk about ws client (user)
const users: User[] = [];

interface IProps {
    token: string;
    ws: WebSocket
}

function checkUser(token: string): string | null {
    const decoded = jwt.verify(token, Config.JWT_SECRET);
    if (!decoded || !(decoded as JwtPayload).userId) {
        return null;
    }

    return (decoded as JwtPayload).userId;
}

wss.on('connection', (ws, req) => {
    const url = req.url;
    if (!url) {
        return;
    }

    const paramurl = url.split('?')[1];
    const queryParams = new URLSearchParams(paramurl);
    const token = queryParams.get("token") || "";

    const userId = checkUser(token);
    if (!userId) {
        ws.close();
        return;
    }

    // new authenticated client is just arrived not mentioned yet which rooms they want to join or where they want to send messages
    users.push({
        userId: userId,
        rooms: [],
        ws: ws
    });

    ws.on('message', async (data) => {
        // two ways to convert raw data into string
        // data.toString();
        // new TextDecoder().decode(data)
        const parsedJson = JSON.parse(new TextDecoder().decode(data as ArrayBuffer));

        if (parsedJson.type === "join") {
            // const user = users.find((user) => user.ws === ws);
            const user = users.find((user) => user.userId === userId); // {userId: "", rooms: [], ws: ws}

            // currently you need to check the 
            // - does this roomdId exist
            // - does userId has right access to roomId (because some room maybe restrict)
            user?.rooms.push(parsedJson.roomId);
        } else if (parsedJson.type === "leave") {
            const user = users.find((user) => user.userId === userId);

            if (user?.rooms === undefined) {
                return;
            }

            user.rooms = user?.rooms.filter((room) => {
                return room !== parsedJson.roomdId;
            });
        } else if (parsedJson.type === "chat") {
            const roomId = parsedJson.roomId;
            const message = parsedJson.message;

            // primsa.chat.create({data: {......}}) -> dumb
            // aysnc queue -> better approach

            await prisma.chat.create({
                data: {
                    roomId: Number(roomId),
                    message: message,
                    userId: userId
                }
            })

            // ws.send only accepts this as parameter
            // - string, Buffer, ArrayBuffer, TypedArray, Data View
            users.forEach((user) => {
                if (user.rooms.includes(roomId)) {
                    const json = {
                        "type": "chat",
                        "message": message,
                        "roomId": roomId
                    };
                    const jsonString = JSON.stringify(json);
                    const uint8Array = new TextEncoder().encode(jsonString);
                    const arrayBuffer = uint8Array.buffer;

                    user.ws.send(arrayBuffer);
                }
            })
        }
    });
});


// Flows
// - Security implementation (chat room would be secure that it only allows specifc domain client to join)
// - data storage directly before broadcast that message
// - primsa.chat.create({data: {......}}) -> dumb
// - async queues process the db storage (they have re-try mechanism in built so it assure that dat always be written to db) and broadcast simultaneously 
