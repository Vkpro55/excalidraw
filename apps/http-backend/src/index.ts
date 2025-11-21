import express from "express";
import mongoose from "mongoose";
import { User } from "./db.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import { authMiddleware } from "./middleware.js";

const app = express();
try {
    await mongoose.connect("mongodb://localhost:27017/excalidraw");
    console.log("MongoDB Conncted");
} catch (error) {
    console.log("Error while mongo connection...", error);
}

app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res)=>{
    const {userName, password, firstName, lastName} = req.body;

    const user = await User.findOne({userName});
    if (!user){
        await User.create({userName, password, firstName, lastName});
        return res.json({
            message: "Signed up"
        })
    } else {
        return res.status(411).json({
            message: "User is already exist"
        })
    }
});

app.post("/signin", async (req, res)=>{
    const {userName, password} = req.body;

    const user = await User.findOne({userName, password});
    if (!user){
        return res.status(400).json({
            message: "User credentials not present"
        })
    } else {
        // create token and send 
        const token = jwt.sign({userId : user._id}, "SECRET");

        return res.status(200).json({
            token
        })
    }
});

// app.get("/", authMiddleware, (req, res) =>{
//     console.log(req.userId);
//     res.send("Hi");
// })

app.listen(5000, ()=>{
    console.log(`Server running... http://localhost:5000`);
})