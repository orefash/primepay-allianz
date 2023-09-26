"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFilesUploadDto = exports.validateFileUploadDto = exports.validateQuoteChoice = exports.validateMotorQuoteBody = void 0;
function validateMotorQuoteBody(body) {
    if (body.Gender &&
        body.DateOfBirth &&
        body.Value) {
        const requestDto = {
            "Gender": body.Gender,
            "DateOfBirth": body.DateOfBirth,
            "Value": body.Value
        };
        return requestDto;
    }
    return null;
}
exports.validateMotorQuoteBody = validateMotorQuoteBody;
function validateQuoteChoice(body) {
    if (body.tempString &&
        body.qouteChoice) {
        const validateDto = {
            tempString: body.tempString,
            qouteChoice: body.qouteChoice
        };
        return validateDto;
    }
    return null;
}
exports.validateQuoteChoice = validateQuoteChoice;
function validateFileUploadDto(body) {
    if (body.imageUrl &&
        body.refId &&
        body.docType) {
        const validateDto = {
            imageUrl: body.imageUrl,
            refId: body.refId,
            docType: body.docType
        };
        return validateDto;
    }
    return null;
}
exports.validateFileUploadDto = validateFileUploadDto;
function validateFilesUploadDto(body) {
    if (body.front_view &&
        body.rear_view &&
        body.selfie &&
        body.chassis_view &&
        body.valid_id &&
        body.vehicle_license &&
        body.left_view &&
        body.refId &&
        body.right_view) {
        const validateDto = body;
        return validateDto;
    }
    return null;
}
exports.validateFilesUploadDto = validateFilesUploadDto;
//# sourceMappingURL=dtoValidator.js.map