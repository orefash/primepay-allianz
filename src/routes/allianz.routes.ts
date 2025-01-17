import * as  express from 'express';
import { getComprehensiveQuote, getMotorPremiumBySize, getMotorSizes, purchaseComprehensive, purchaseThirdParty, uploadMultipleDocs, validateMotor, validateQuote, generatePolicyCertificate } from '../controllers/allianz.controller';

const allianzRouter = express.Router();

// Define allianz-related routes
allianzRouter.get('/motor-sizes', getMotorSizes);
allianzRouter.get('/motor-sizes/premium/:size', getMotorPremiumBySize);
allianzRouter.post('/validate-motor', validateMotor);
allianzRouter.post('/purchase-3rd-party/user/:contactId', purchaseThirdParty);
allianzRouter.post('/purchase-comprehensive/user/:contactId', purchaseComprehensive);
allianzRouter.post('/get-comprehensive-quote', getComprehensiveQuote);
allianzRouter.post('/validate-quote', validateQuote);
allianzRouter.post('/upload-multiple-docs/user/:contactId', uploadMultipleDocs);
allianzRouter.post('/generate-certificate/user/:contactId', generatePolicyCertificate);

export default allianzRouter;
