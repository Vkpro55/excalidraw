import dotenv from "dotenv";
dotenv.config({ path: "./apps/http-backend/.env" });


import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import { authMiddleware } from "./middleware.js";
import { Request, Response } from "express";

import { Config } from "@repo/backend-common/config"
import { CreateUserSchema, SigninBodySchema, CreateRoomSchema } from "@repo/common/types";

import { prisma } from "@repo/db/client";


const app = express();

app.use(cors());
app.use(express.json());

console.log(Config.JWT_SECRET);

app.post("/signup", async (req, res) => {
    const parsedata = CreateUserSchema.safeParse(req.body);
    console.log("data: ", parsedata)
    if (!parsedata.success) {
        return res.json({
            message: "Incorrect inputs hi"
        })
    }

    try {
        const user = await prisma.user.create({
            data: {
                name: parsedata.data.name,
                password: parsedata.data.password,
                email: parsedata.data.email
            }
        });

        return res.status(200).json({
            userId: user.id
        })
    } catch (error) {
        console.log("Error is : ", error);
        // multiple checks
        // - unique email fail
        // db down
        // serer down
        return res.status(411).json({
            error: "Creation failed"
        })
    }
});

app.post("/signin", async (req, res) => {
    console.log("Request come");
    const parsedata = SigninBodySchema.safeParse(req.body);
    if (!parsedata.success) {
        return res.json({
            message: "Incorrect inputs do"
        })
    }

    console.log("Yes");
    try {
        // if hash then compare the password 
        const user = await prisma.user.findFirst({
            where: {
                email: parsedata.data.email,
                password: parsedata.data.password
            }
        })

        console.log("user", user)
        const token = jwt.sign({ userId: user?.id }, Config.JWT_SECRET);
        console.log("token ", token)
        return res.status(200).json({
            token
        })
    } catch (error) {
        return res.status(400).json({
            message: "Errro is signin"
        })
    }
});

app.post("/create-room", authMiddleware, async (req, res) => {
    const parsedata = CreateRoomSchema.safeParse(req.body);
    if (!parsedata.success) {
        return res.json({
            message: "Incorrect inputs do"
        })
    }

    if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const userId: string = req.userId;
    try {
        const room = await prisma.room.create({
            data: {
                slug: parsedata.data.name,
                adminId: userId
            }
        })

        return res.json({
            roomId: room.id
        })
    } catch (error) {
        console.log("Error white creation of room: ", error);
        return res.status(400).json({
            message: "Error white creation of room"
        })
    }

});

app.get("/chat/:roomId", async (req, res) => {
    const roomId = Number(req.params.roomId);

    // two ways 
    // - find the room and populate the chat field 
    // - find many chats that have roomId -> fasterbecause run sql query behind scene

    /**
     * include: { chats: true }
     const room = await prisma.room.findUnique({
                    where: { id: roomId },
                    include: {
                      chats: {
                        orderBy: { id: "desc" },
                        take: 10
                      }
                    }
                });
     */
    const chats = await prisma.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 10
    });

    return res.json({
        chats
    })
})

app.listen(5000, () => {
    console.log(`Server running... http://localhost:5000`);
})