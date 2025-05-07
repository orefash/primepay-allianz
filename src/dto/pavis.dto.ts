import { AgentInfo, Customer, LicenseInfo } from "./allianz.dto";


interface InitApplication {
    contactId: string;
    // email: string;
    appln_id?: string;
    isComprehensive: string;
    customer: Customer;
    licenseInfo: LicenseInfo;
    AgentInfo: AgentInfo;
    stage: number;
    hasPaid: boolean;
    transactionRef: string;
    carPremium: string;
    carValue?: string;
    purchaseInsurance: boolean;
    hasCertificate: boolean;
    completed: boolean;
    certificateUrl?: string;
}

interface CompleteApplication extends InitApplication {
    appln_id: string; // Override and make it required
    // You can add other fields specific to CompleteApplication here, if needed.
}

const isValidInitApplication = (body: any): body is InitApplication => {
    return (
        typeof body === 'object' &&
        body !== null &&
        typeof body.contactId === 'string' &&
        // typeof body.email === 'string' &&
        typeof body.isComprehensive === 'string'
    );
};

export { InitApplication, CompleteApplication, isValidInitApplication }