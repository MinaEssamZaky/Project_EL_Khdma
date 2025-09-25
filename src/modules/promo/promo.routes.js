import express from 'express';
import { auth, authorizeRoles } from "../../middleware/auth.js";
import { applyPromoCode, createPromoCode, deletePromoCode, getAllPromoCodes, getPromoCodeById, updatePromoCode } from './promo.controller.js';

const promoRouter = express.Router();


promoRouter.post('/createPromoCode', auth(),authorizeRoles("SuperAdmin","Admin"),createPromoCode);
promoRouter.get('/getAllPromoCodes', auth(),getAllPromoCodes);
promoRouter.post('/applyPromoCode', auth(),applyPromoCode);
promoRouter.patch('/updatePromoCode/:id', auth(),authorizeRoles("SuperAdmin","Admin"),updatePromoCode);
promoRouter.delete('/deletePromoCode/:id', auth(),authorizeRoles("SuperAdmin","Admin"),deletePromoCode);
promoRouter.get('/getPromoCodeById/:id', auth(),authorizeRoles("SuperAdmin","Admin"),getPromoCodeById);



export default promoRouter;
