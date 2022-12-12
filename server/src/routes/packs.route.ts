import express from 'express';
import { PackService } from '../packs/pack.service';
import { authGuard } from '../auth/auth.guard';
import { adminGuard } from '../guards/role.guard';

const router = express.Router();


router.get('/all', async (req, res) => {
    try {
        const packs = await PackService.getPacks();
        res.send(packs)
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

router.get('/by-id/:id', async (req, res) => {
    try {
        const pack = await PackService.getPackById(Number(req.params.id));
        res.send(pack);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

router.post('/create', authGuard, adminGuard, async (req, res) => {
    try {
        const newPack = await PackService.create(req.body);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

router.post('/sprite/create', adminGuard, adminGuard, async (req, res) => {
    try {
        const result = await PackService.createSpritePack(req.body);
        res.status(200).send(result);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

router.post('/add', authGuard, adminGuard, async (req, res) => {
    try {
        const user = await PackService.setInUse(Number(req.body.currentUser), Number(req.body.id))
        res.send(user);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})
router.put('/update/:id', authGuard, adminGuard, async (req, res) => {
    try {
        const pack = await PackService.updatePack(req.body.dto, Number(req.params.id));
        res.send(pack);
    } catch (error: any) {
        res.status(500).send({ message: error.message });

    }
})

router.delete('/delete', authGuard, adminGuard, async (req, res) => {
    try {
        await PackService.delete(Number(req.body.id));
        res.status(200).send();
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})


export default router;