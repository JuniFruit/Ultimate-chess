import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authGuard: RequestHandler = (req, res, next) => {

    const header = req.headers['authorization'];

    if (!header) return res.status(401)

    const token = header.split(' ')[1];

    if (!token) return res.status(401)

    jwt.verify(
        token,
        process.env.JWT_SECRET!,
        (err, decoded:any) => {
            if (err) return res.status(401)
            req.body.currentUser = decoded.id;
            next();
        }
    )

}