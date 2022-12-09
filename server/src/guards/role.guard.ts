import { RequestHandler } from 'express'
import dotenv from 'dotenv';
import { RolesEntity } from '../roles/role.entity';
import { UserService } from '../user/user.service';

dotenv.config();

export const adminGuard: RequestHandler = async (req, res, next) => {

    const userRoles = (await UserService.getById(Number(req.body.currentUser))).roles;
    if (!userRoles.length) return res.status(403).send({message: 'Forbidden resource'})

    const adminRole = userRoles.find((userRole: RolesEntity) => userRole.role === 'ADMIN' || userRole.role === 'CREATOR');
    if (!adminRole) return res.status(403).send({message: 'Forbidden resource'})

    next();

}