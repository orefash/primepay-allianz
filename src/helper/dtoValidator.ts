import { FileUploadDto, MultipleFileUploadDto, ValidateQuoteDto, requestQuoteDto } from "../types/appTypes";


export function validateMotorQuoteBody(body: any): requestQuoteDto | null {
    if (
        body.Gender &&
        body.DateOfBirth &&
        body.Value
    ) {
        const requestDto: requestQuoteDto = {
            "Gender": body.Gender,
            "DateOfBirth": body.DateOfBirth,
            "Value": body.Value
        }

        return requestDto;
    }
    return null;
}


export function validateQuoteChoice(body: any): ValidateQuoteDto | null {
    if (
        body.tempString &&
        body.qouteChoice
    ) {
        const validateDto: ValidateQuoteDto = {
            tempString: body.tempString,
            qouteChoice: body.qouteChoice
        }

        return validateDto;
    }
    return null;
}


export function validateFileUploadDto(body: any): FileUploadDto | null {
    if (
        body.imageUrl &&
        body.refId &&
        body.docType
    ) {
        const validateDto: FileUploadDto = {
            imageUrl: body.imageUrl,
            refId: body.refId,
            docType: body.docType
        }

        return validateDto;
    }
    return null;
}


export function validateFilesUploadDto(body: any): MultipleFileUploadDto | null {
    if (
        body.front_view &&
        body.rear_view &&
        body.selfie &&
        body.chassis_view &&
        body.valid_id &&
        body.vehicle_license &&
        body.left_view &&
        body.refId &&
        body.right_view
    ) {
        const validateDto: MultipleFileUploadDto = body;

        return validateDto;
    }
    return null;
}