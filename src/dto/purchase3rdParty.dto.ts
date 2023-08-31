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

interface AgentInfo {
    AgentCode: string;
}

interface PurchaseDto {
    customer: Customer;
    licenseInfo: LicenseInfo;
    payment: Payment | null;
    AgentInfo: AgentInfo;
}

interface FPurchaseDto {
    customer: Customer;
    licenseInfo: LicenseInfo;
    payment: Payment;
    AgentInfo: AgentInfo;
}

export { PurchaseDto }