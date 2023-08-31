import { requestQuoteDto } from "../types/appTypes";


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