import { validate } from "class-validator";
import { RequestHandler } from "express";
import { CreateRoleDto } from "../roles/role.dto";
import { formErrorMessage } from "../utils/utils";


export const roleValidation: RequestHandler = async (req, res, next) => {
    if (!req.body.dto) return res.status(500).send({ message: 'Please send the required information' });
    const role = new CreateRoleDto();

    role.description = req.body.dto.description;
    role.role = req.body.dto.role

    

    const errors = await validate(role);

    if (errors.length) {
        return res.status(500).send({ message: formErrorMessage(errors) });

    }
    next()
}