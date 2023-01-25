import { ValidationError } from 'class-validator';
import { RequestHandler } from "express";
import { PackDto } from '../packs/pack.dto';
import { SpriteDto } from '../packs/sprite.dto';
import { formErrorMessage } from "../utils/utils";
import { validationPipe } from "./validationPipe";


export const packValidation: RequestHandler = async (req, res, next) => {
    if (!req.body) return res.status(500).send({ message: 'Please send the required information' });

    const result = await validationPipe(PackDto, { ...req.body })

    if ((result as ValidationError[]).length) {
        return res.status(500).send({ message: formErrorMessage(result as ValidationError[]) });

    }
    next()
}
export const spritePackValidation: RequestHandler = async (req, res, next) => {
    if (!req.body) return res.status(500).send({ message: 'Please send the required information' });

    const result = await validationPipe(SpriteDto, { ...req.body })

    if ((result as ValidationError[]).length) {
        return res.status(500).send({ message: formErrorMessage(result as ValidationError[]) });

    }
    next()
}

