import express from 'express';
import { UserService } from '../user/user.service';
import { authGuard } from '../auth/auth.guard';
import { adminGuard } from '../guards/role.guard';
const router = express.Router();


router.get('/by-id/:id', async (req, res) => {
    try {
        const user = await UserService.getById(Number(req.params.id));
        res.send(user);
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

router.get('/profile', authGuard, async (req, res) => {
    try {
        const user = await UserService.getById(Number(req.body.currentUser))
        res.send(user);

    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

router.put('/increase-wins', authGuard, async (req, res) => {
    try {
        const user = await UserService.increaseWins(Number(req.body.currentUser));
        res.send(user);

    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

router.put('/increase-losses', authGuard, async (req, res) => {
    try {
        const user = await UserService.increaseLoses(Number(req.body.currentUser));
        res.send(user);

    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

router.put('/add-role', authGuard, adminGuard, async (req, res) => {
    try {
        const user = await UserService.addRole(Number(req.body.userId), req.body.roleValue);
        res.send(user);

    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

router.put('/delete-role', authGuard, adminGuard, async (req, res) => {
    try {
        const user = await UserService.deleteRole(Number(req.body.userId), req.body.roleValue);
        res.send(user);

    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

export default router;