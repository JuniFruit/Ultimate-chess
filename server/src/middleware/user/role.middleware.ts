import {RequestHandler} from 'express';
import { RolesEntity } from '../../roles/role.entity';
import { UserService } from '../../user/user.service';


export const isSameUser: RequestHandler = (req, res, next) => {
    if (req.body.currentUser === req.body.userId) return res.status(400).send({ message: 'You cannot change roles to yourself' });
    next();
}

export const isNotCreator: RequestHandler = async (req,res, next) => {
    const userRoles = (await UserService.getById(Number(req.body.currentUser))).roles;
    if (!userRoles.length) return res.status(403).send({message: 'Forbidden resource'})

    const creatorRole = userRoles.find((userRole: RolesEntity) => userRole.role === 'CREATOR');
    if (req.body.roleValue === "CREATOR" && !creatorRole) return res.status(403).send({message: 'Only Creator can change this role'})
    next()
}