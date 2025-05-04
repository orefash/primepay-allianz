import { PurchaseComprehensiveDto, PurchaseDto } from '../dto/allianz.dto'; // Import your DTO structure here


function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function getCurrentDateFormatted(): string {
  const now = new Date();
  return formatDate(now);
}

function getYearFromCurrentFormatted(yearsToAdd: number): string {
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setFullYear(now.getFullYear() + yearsToAdd);
  return formatDate(futureDate);
}


function getIssueExpiryDate() {
  return {
    IsssueDate: getCurrentDateFormatted(),
    ExpiryDate: getYearFromCurrentFormatted(1),
  };
}

export function validatePurchaseDto(body: any): PurchaseDto | null {
  // Your custom validation logic here
  if (
    body &&
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
    // body.licenseInfo.IsssueDate &&
    // body.licenseInfo.ExpiryDate &&
    body.licenseInfo.VehicleSizeId &&
    body.licenseInfo.MakeYear &&
    body.payment &&
    body.payment.paymentReference &&
    body.payment.amountPaid
    // body.AgentInfo &&
    // body.AgentInfo.AgentCode
  ) {


    const issueExpiry = getIssueExpiryDate();
    body.licenseInfo = { ...body.licenseInfo, ...issueExpiry };

    let carData: string[] = body.licenseInfo.Model.split(" ");
    if (carData.length > 1) {
      body.licenseInfo.Model = carData[1];
    }
    if (body.AgentInfo && body.AgentInfo.AgentCode && body.AgentInfo.AgentCode == "0") {
      body.AgentInfo.AgentCode = "Direct";
    }
    if (!body.AgentInfo) {
      body.AgentInfo.AgentCode = "Direct";
    }
    const validatedDto: PurchaseDto = {
      customer: body.customer,
      licenseInfo: body.licenseInfo,
      payment: body.payment,
      AgentInfo: body.AgentInfo,
    };
    return validatedDto;
  }
  return null;
}


export function validateComprehensivePurchaseDto(body: any): PurchaseComprehensiveDto | null {
  // Your custom validation logic here
  if (
    body &&
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
    body.Classic.SumAssured
  ) {



    const issueExpiry = getIssueExpiryDate();
    body.licenseInfo = { ...body.licenseInfo, ...issueExpiry };
    
    let carData: string[] = body.licenseInfo.Model.split(" ");
    if (carData.length > 1) {
      body.licenseInfo.Model = carData[1];
    }
    const validatedDto: PurchaseComprehensiveDto = {
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