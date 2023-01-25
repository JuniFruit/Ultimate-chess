import { RequestHandler } from "express";
import { CreateRoleDto } from "../roles/role.dto";
import { formErrorMessage } from "../utils/utils";
import { ValidationError, validationPipe } from './validationPipe';

export const roleValidation: RequestHandler = async (req, res, next) => {
    if (!req.body.dto) return res.status(500).send({ message: 'Please send the required information' });

    const result = await validationPipe(CreateRoleDto, { ...req.body.dto })

    if ((result as ValidationError[]).length) {
        return res.status(500).send({ message: formErrorMessage(result as ValidationError[]) });

    }
    next()
}