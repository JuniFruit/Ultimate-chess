import express from "express";
import { AuthService } from "../auth/auth.service";
import { authLoginPipe, authRegisterPipe } from "../pipes/authValidation.pipe";

const router = express.Router();


router.post('/login', authLoginPipe ,async(req, res) => {
    try {
        const userFields = await AuthService.login(req.body.dto);
        res.send(userFields);
    } catch (error: any) {
        res.status(500).send({message: error.message});
    }
})

router.post('/register', authRegisterPipe,async(req, res) => {
    try {
        const newUser = await AuthService.register(req.body.dto);
        res.send(newUser);
    } catch (error: any) {
        res.status(500).send({message: error.message});

    }
})

export default router;