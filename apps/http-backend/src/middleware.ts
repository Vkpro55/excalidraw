import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];

    if (!auth) {
        return res.status(401).json({ message: "Missing Authorization header" });
    }

    const parts = auth.split(' ');
    const token = parts[1] as string;

    try {
        const decoded = jwt.verify(token, 'SECRET') as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({
            message: "Unauthorized || JWT ERROR || expiration error || wrong jwt ERROR"
        });
    }
}