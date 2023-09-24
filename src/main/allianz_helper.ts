import { ValidateQuoteDto } from "../types/appTypes";


export async function validateQuoteChoice(data: ValidateQuoteDto | null): Promise<any> {

    try {
        if(!data)
            throw new Error("Invalid Data")

        let quoteData = data.tempString;

        let qArray: [string, string][] = Object.entries(quoteData);
        // console.log(qArray)

        let installmentType: string = qArray[data.qouteChoice - 1][0];
        let premiumAmount: string = qArray[data.qouteChoice - 1][1];

        premiumAmount = premiumAmount.split(' ')[0].replace(',','');

        return {
            success: true,
            installmentType,
            premiumAmount : parseInt(premiumAmount)
        }
        
    } catch (error) {
        console.log("Erro in vlaidate quote: ", error)
        return {
            success: false
        }
    }

}



export async function validateEmail(email: string): Promise<any> {
    
}