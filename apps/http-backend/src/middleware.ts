import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface extendedRequest extends Request {
    userId ? : string;
}

export function authMiddleware(req: extendedRequest, res: Response, next: NextFunction) {
    const header = req.headers['authorization'].split(' ');
    const token = header[1];
    try {
        const decoded = jwt.verify(token, 'SECRET') as JwtPayload;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({
            message : "Unauthorized || JWT ERROR || expiration error || wrong jwt ERROR"
        })
    }
}