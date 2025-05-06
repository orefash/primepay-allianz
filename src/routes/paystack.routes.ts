import * as  express from 'express';
import { createPaymentLinkController, verifyPaymentController } from '../controllers/paystack.controller';


const paystackRouter = express.Router();

paystackRouter.post('/create-payment-link/:tid', createPaymentLinkController);
paystackRouter.get('/pay-validate/:ref/:tid', verifyPaymentController);

export default paystackRouter;