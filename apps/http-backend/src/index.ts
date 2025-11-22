import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import { authMiddleware } from "./middleware.js";
import { Request, Response } from "express";

import { Config } from "@repo/backend-common/config"
import { CreateUserSchema, SigninBodySchema, CreateRoomSchema } from "@repo/common/types";

import {prisma} from "@repo/db/client";

const app = express();

app.use(cors());
app.use(express.json());

console.log(Config.JWT_SECRET);

app.post("/signup", async (req, res) => {
    const parsedata = CreateUserSchema.safeParse(req.body);
    if (!parsedata.success) {
        return res.json({
            message: "Incorrect inputs"
        })
    }

    try {
        const user = await prisma.user.create({
            data: {
                name: parsedata.data.email,
                password: parsedata.data.password,
                email: parsedata.data.email
            }
        });

        return res.json({
            userI: user.id
        })
    } catch (error) {
        // multiple checks
        // - unique email fail
        // db down
        // serer down
        return res.json({
            error: "Creation failed"
        })
    }
});

app.post("/signin", async (req, res) => {
    const parsedata = SigninBodySchema.safeParse(req.body);
    if (!parsedata.success) {
        return res.json({
            message: "Incorrect inputs"
        })
    }

    try {
        // if hash then compare the password 
        const user = await prisma.user.findFirst({
            where: {
                email: parsedata.data.email,
                password: parsedata.data.password
            }
        })
    } catch (error) {

    }
});

app.post("/create-room", authMiddleware, (req, res) => {

});

app.listen(5000, () => {
    console.log(`Server running... http://localhost:5000`);
})