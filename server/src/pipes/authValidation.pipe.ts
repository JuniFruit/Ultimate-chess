import { ValidationError } from 'class-validator';
import { RequestHandler } from "express";
import { AuthDto, RegisterDto } from "../auth/auth.dto";
import { UserEditDto } from "../user/user.dto";
import { formErrorMessage } from "../utils/utils";
import { validationPipe } from "./validationPipe";


export const authRegisterPipe: RequestHandler = async (req, res, next) => {
    if (!req.body.dto) return res.status(500).send({ message: 'Please send the required information' });

    const result = await validationPipe(RegisterDto, { ...req.body.dto })

    if ((result as ValidationError[]).length) {
        return res.status(500).send({ message: formErrorMessage(result as ValidationError[]) });

    }
    next()
}

export const authLoginPipe: RequestHandler = async (req, res, next) => {
    if (!req.body.dto) return res.status(500).send({ message: 'Please send the required information' });


    const result = await validationPipe(AuthDto, { ...req.body.dto })

    if ((result as ValidationError[]).length) {
        return res.status(500).send({ message: formErrorMessage(result as ValidationError[]) });

    }
    next()
}

export const userEditPipe: RequestHandler = async (req, res, next) => {
    if (!req.body.dto) return res.status(500).send({ message: 'Please send the required information' });


    const result = await validationPipe(UserEditDto, { ...req.body.dto })

    if ((result as ValidationError[]).length) {
        return res.status(500).send({ message: formErrorMessage(result as ValidationError[]) });

    }
    next()
}