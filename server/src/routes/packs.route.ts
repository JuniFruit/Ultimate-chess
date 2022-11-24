import express from 'express';
import { PackService } from '../packs/pack.service';
import { authGuard } from '../auth/auth.guard';

const router = express.Router();


router.get('/all', async (req, res) => {
    try {
        const packs = await PackService.getPacks();
        res.send(packs)
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

router.get('/by-id', async (req, res) => {
    try {
        const pack = await PackService.getPackById(Number(req.body.id));
        res.send(pack);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

router.post('/create', async (req, res) => {
    try {
        const newPack = await PackService.create(req.body);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

router.post('/sprite/create', async (req, res) => {
    try {
        const result = await PackService.createSpritePack(req.body);
        res.status(200).send(result);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

router.delete('/delete', async (req, res) => {
    try {
        await PackService.delete(Number(req.body.id));
        res.status(200).send();
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

router.post('/add', authGuard, async (req, res) => {
    try {
        const user = await PackService.setInUse(Number(req.body.currentUser), Number(req.body.id))
        res.send(user);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

export default router;