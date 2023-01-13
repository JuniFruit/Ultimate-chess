import { RequestHandler } from "express";
import { AuthDto, RegisterDto } from "../auth/auth.dto";
import { validate } from 'class-validator';
import { formErrorMessage } from "../utils/utils";
import { UserEditDto } from "../user/user.dto";


export const authRegisterPipe: RequestHandler = async (req, res, next) => {
    if (!req.body.dto) return res.status(500).send({ message: 'Please send the required information' });
    const user = new RegisterDto();
    user.avatarLink = req.body.dto.avatarLink;
    user.password = req.body.dto.password;
    user.username = req.body.dto.username;

    const errors = await validate(user);

    if (errors.length) {
        return res.status(500).send({ message: formErrorMessage(errors) });

    }
    next()
}

export const authLoginPipe: RequestHandler = async (req, res, next) => {
    if (!req.body.dto) return res.status(500).send({ message: 'Please send the required information' });
    const user = new AuthDto();
    user.password = req.body.dto.password;
    user.username = req.body.dto.username;


    const errors = await validate(user);

    if (errors.length) {
        return res.status(500).send({ message: formErrorMessage(errors) });
    }
    next()
}

export const userEditPipe:RequestHandler = async (req,res,next) => {
    if (!req.body.dto) return res.status(500).send({ message: 'Please send the required information' });
    const user = new UserEditDto();
    user.avatarLink = req.body.dto.avatarLink;

    const errors = await validate(user);

    if (errors.length) {
        return res.status(500).send({ message: formErrorMessage(errors) });
    }
    next()
}