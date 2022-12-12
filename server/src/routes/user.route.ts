import express from 'express';
import { UserService } from '../user/user.service';
import { authGuard } from '../auth/auth.guard';
import { adminGuard } from '../guards/role.guard';
import { isSameUser } from '../middleware/user/role.middleware';
const router = express.Router();


router.get('/by-id/:id', async (req, res) => {
    try {
        const user = await UserService.getById(Number(req.params.id));
        res.send(user);
    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

router.use(authGuard)

router.get('/profile', async (req, res) => {
    try {
        const user = await UserService.getById(Number(req.body.currentUser))
        res.send(user);

    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

router.get('/all', adminGuard, async (req, res) => {
    try {
        const users = await UserService.getAll()
        res.send(users);

    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

router.get('/by-term', async (req, res) => {
    try {
        const user = await UserService.getBySearchTerm(req.query.term?.toString())
        res.send(user);

    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

router.put('/increase-wins', async (req, res) => {
    try {
        const user = await UserService.increaseWins(Number(req.body.currentUser));
        res.send(user);

    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

router.put('/increase-losses', async (req, res) => {
    try {
        const user = await UserService.increaseLoses(Number(req.body.currentUser));
        res.send(user);

    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

router.use(adminGuard, isSameUser)

router.put('/add-role', async (req, res) => {
    try {
        const user = await UserService.addRole(Number(req.body.userId), req.body.roleValue);
        res.send(user);

    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

router.put('/delete-role', async (req, res) => {
    try {
        const user = await UserService.deleteRole(Number(req.body.userId), req.body.roleValue);
        res.send(user);

    } catch (error: any) {
        res.status(500).send({ message: error.message });
    }
})

export default router;