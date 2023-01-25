import express from "express";
import { authGuard } from "../auth/auth.guard";
import { roleValidation } from "../pipes/role.pipe";
import { RoleService } from "../roles/role.service";
import { adminGuard } from '../guards/role.guard';

const router = express.Router();


router.use(authGuard)

router.get('/all', async (req, res) => {
    try {
        const role = await RoleService.getRole(req.query.value?.toString());
        res.send(role);
    } catch (error: any) {
        res.status(500).send({ message: error.message });

    }
})

router.use(adminGuard)

router.post('/create', roleValidation, async (req, res) => {
    try {
        const role = await RoleService.createRole(req.body.dto);
        res.send(role);
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})



router.delete('/delete', async (req, res) => {
    try {
        const role = await RoleService.deleteRole(req.body.role);
        res.status(200).send('Role was deleted');
    } catch (error: any) {
        res.status(500).send({ message: error.message });

    }
})

export default router;