import { PurchaseComprehensiveDto, PurchaseDto } from '../dto/purchase3rdParty.dto'; // Import your DTO structure here

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
    body.Classic.SumAssured
  ) {
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