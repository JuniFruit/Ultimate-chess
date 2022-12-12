import {RequestHandler} from 'express';


export const isSameUser: RequestHandler = (req, res, next) => {
    if (req.body.currentUser === req.body.userId) return res.status(400).send({ message: 'You cannot change roles to yourself' });
    next();
}
