
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


export interface AuthRequest extends Request {
    user?: any;
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("Verifying token...")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        //console.log("token", token)
        //console.log("secret", process.env.JWT_SECRET)

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        //console.log("decoded", decoded)


        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

export default verifyToken;