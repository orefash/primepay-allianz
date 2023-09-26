"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateComprehensivePurchaseDto = exports.validatePurchaseDto = void 0;
function validatePurchaseDto(body) {
    // Your custom validation logic here
    if (body &&
        body.customer &&
        body.customer.FirstName &&
        body.customer.LastName &&
        body.customer.Gender &&
        body.customer.Title &&
        body.customer.DateOfBirth &&
        body.customer.Email &&
        body.customer.MobileNumber &&
        body.customer.State &&
        body.customer.LGA &&
        body.customer.Address &&
        body.licenseInfo &&
        body.licenseInfo.Color &&
        body.licenseInfo.Model &&
        body.licenseInfo.RegistrationNo &&
        body.licenseInfo.ChasisNo &&
        body.licenseInfo.EngineNo &&
        body.licenseInfo.VehicleMakeName &&
        body.licenseInfo.VehicleStatus &&
        body.licenseInfo.IsssueDate &&
        body.licenseInfo.ExpiryDate &&
        body.licenseInfo.VehicleSizeId &&
        body.licenseInfo.MakeYear &&
        body.payment &&
        body.payment.paymentReference &&
        body.payment.amountPaid
    // body.AgentInfo &&
    // body.AgentInfo.AgentCode
    ) {
        const validatedDto = {
            customer: body.customer,
            licenseInfo: body.licenseInfo,
            payment: body.payment,
            AgentInfo: body.AgentInfo,
        };
        return validatedDto;
    }
    return null;
}
exports.validatePurchaseDto = validatePurchaseDto;
function validateComprehensivePurchaseDto(body) {
    // Your custom validation logic here
    if (body &&
        body.customer &&
        body.customer.FirstName &&
        body.customer.LastName &&
        body.customer.Gender &&
        body.customer.Title &&
        body.customer.DateOfBirth &&
        body.customer.Email &&
        body.customer.MobileNumber &&
        body.customer.State &&
        body.customer.LGA &&
        body.customer.Address &&
        body.licenseInfo &&
        body.licenseInfo.Color &&
        body.licenseInfo.Model &&
        body.licenseInfo.RegistrationNo &&
        body.licenseInfo.ChasisNo &&
        body.licenseInfo.EngineNo &&
        body.licenseInfo.VehicleMakeName &&
        body.licenseInfo.VehicleStatus &&
        body.licenseInfo.IsssueDate &&
        body.licenseInfo.ExpiryDate &&
        body.licenseInfo.VehicleSizeId &&
        body.licenseInfo.MakeYear &&
        body.payment &&
        body.payment.paymentReference &&
        body.payment.amountPaid &&
        body.payment.PaymentFrequency &&
        // body.AgentInfo &&
        // body.AgentInfo.AgentCode &&
        body.Classic &&
        body.Classic.Premium &&
        body.Classic.SumAssured) {
        const validatedDto = {
            customer: body.customer,
            licenseInfo: body.licenseInfo,
            payment: body.payment,
            AgentInfo: body.AgentInfo,
            Classic: body.Classic
        };
        return validatedDto;
    }
    return null;
}
exports.validateComprehensivePurchaseDto = validateComprehensivePurchaseDto;
//# sourceMappingURL=validatePurchase.js.map