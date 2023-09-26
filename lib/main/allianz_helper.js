"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = exports.validateQuoteChoice = void 0;
async function validateQuoteChoice(data) {
    try {
        if (!data)
            throw new Error("Invalid Data");
        let quoteData = data.tempString;
        let qArray = Object.entries(quoteData);
        // console.log(qArray)
        let installmentType = qArray[data.qouteChoice - 1][0];
        let premiumAmount = qArray[data.qouteChoice - 1][1];
        premiumAmount = premiumAmount.split(' ')[0].replace(',', '');
        return {
            success: true,
            installmentType,
            premiumAmount: parseInt(premiumAmount)
        };
    }
    catch (error) {
        console.log("Erro in vlaidate quote: ", error);
        return {
            success: false
        };
    }
}
exports.validateQuoteChoice = validateQuoteChoice;
async function validateEmail(email) {
}
exports.validateEmail = validateEmail;
//# sourceMappingURL=allianz_helper.js.map