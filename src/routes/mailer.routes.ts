import * as express from 'express';
import { validateEmailController } from '../controllers/mailer.controller';

const emailRouter = express.Router();


emailRouter.get('/validate-email/:email', validateEmailController);

export default emailRouter;