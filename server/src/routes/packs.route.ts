import express from 'express';
import { PackService } from '../packs/pack.service';
import { authGuard } from '../auth/auth.guard';
import { adminGuard, creatorGuard } from '../guards/role.guard';
import { packValidation, spritePackValidation } from '../pipes/pack.pipe';
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

router.use(authGuard)

router.post('/add', async (req, res) => {
    try {
        const user = await PackService.setInUse(Number(req.body.currentUser), Number(req.body.id))
        res.send(user);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

router.get('/sprite/by-id/:id', async (req, res) => {
    try {
        const pack = await PackService.getSpritePackById(Number(req.params.id));
        res.send(pack);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})
router.use(adminGuard);

router.post('/create', packValidation, async (req, res) => {
    try {
        const newPack = await PackService.create(req.body);
        res.status(200).send();
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

router.post('/sprite/create', spritePackValidation, async (req, res) => {
    try {
        const result = await PackService.createSpritePack(req.body);
        console.log(result);
        res.send({ id: result });
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})

router.put('/sprite/update/:id', spritePackValidation, async (req, res) => {
    try {
        const result = await PackService.updateSpritePack(req.body, Number(req.params.id));
        res.send(result);
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})


router.put('/update/:id', packValidation, async (req, res) => {
    try {
        const pack = await PackService.updatePack(req.body, Number(req.params.id));
        res.send(pack);
    } catch (error: any) {
        res.status(500).send({ message: error.message });

    }
})

router.delete('/delete', creatorGuard, async (req, res) => {
    try {
        await PackService.delete(Number(req.body.id));
        res.status(200).send();
    } catch (error: any) {
        res.status(500).send({ message: error.message })
    }
})


export default router;