import express, { Router, Request, Response } from 'express';
import { AuthController, verifyToken, authenticate } from '../controllers/auth.controller';

const router = Router();

router.get("/verify", verifyToken);

router.post("/login", AuthController.login);


export default router;