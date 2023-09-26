import * as  express from 'express';
import { createPaymentLinkController, verifyPaymentController } from '../controllers/paystack.controller';


const paystackRouter = express.Router();

paystackRouter.post('/create-payment-link', createPaymentLinkController);
paystackRouter.get('/pay-validate/:ref', verifyPaymentController);

export default paystackRouter;