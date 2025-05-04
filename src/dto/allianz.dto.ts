interface Customer {
    FirstName: string;
    LastName: string;
    Gender: string;
    Title: string;
    DateOfBirth: string;
    Email: string;
    MobileNumber: string;
    State: string;
    LGA: string;
    Address: string;
    Bvn?: string;
}

interface LicenseInfo {
    Color: string;
    Model: string;
    RegistrationNo: string;
    ChasisNo: string;
    EngineNo: string;
    VehicleMakeName: string;
    VehicleStatus: string;
    IsssueDate: string;
    ExpiryDate: string;
    VehicleSizeId: string;
    MakeYear: number;
}

interface Payment {
    paymentReference: string;
    amountPaid: string;
}

interface ComprehensivePayment extends Payment {
    PaymentFrequency: string;
}

interface AgentInfo {
    AgentCode: string;
}

interface PurchaseDto {
    customer: Customer;
    licenseInfo: LicenseInfo;
    payment: Payment;
    AgentInfo: AgentInfo;
}

interface ComprehensiveClassic {
    Premium: string;
    SumAssured: string;
}

interface PurchaseComprehensiveDto {
    customer: Customer;
    licenseInfo: LicenseInfo;
    payment: ComprehensivePayment;
    AgentInfo: AgentInfo;
    Classic: ComprehensiveClassic;
}


// interface FPurchaseDto {
//     customer: Customer;
//     licenseInfo: LicenseInfo;
//     payment: Payment;
//     AgentInfo: AgentInfo;
// }

export { PurchaseDto, PurchaseComprehensiveDto, Customer, LicenseInfo, AgentInfo }