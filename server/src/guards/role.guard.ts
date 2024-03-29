import { RequestHandler } from 'express'
import * as dotenv from 'dotenv';
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

export const creatorGuard: RequestHandler = async (req,res,next) => {
    const userRoles = (await UserService.getById(Number(req.body.currentUser))).roles;
    if (!userRoles.length) return res.status(403).send({message: 'Forbidden resource'})

    const creatorRole = userRoles.find((userRole: RolesEntity) => userRole.role === 'CREATOR');
    if (!creatorRole) return res.status(403).send({message: 'Only for Creator'})

    next();
}