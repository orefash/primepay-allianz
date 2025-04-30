import * as  express from 'express';
import { saveApplication } from '../controllers/pavis.controller';

const pavisRouter = express.Router();


pavisRouter.post('/saveApplication', saveApplication);


export default pavisRouter;
