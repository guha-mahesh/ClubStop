
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


export interface AuthRequest extends Request {
    user?: any;
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("Verifying token from cookie...")
    console.log("All request headers:", req.headers);
    console.log("Cookie header specifically:", req.headers.cookie);
    console.log("Parsed cookies:", req.cookies);

    const token = req.cookies.jwt;
    console.log("Token:", token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

export default verifyToken;