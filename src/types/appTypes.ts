
export interface FetchData {
    atoken: string;
    expires: string;
}

export interface motorSizes {
    VehicleSizeId: number,
    Size: string,
    Premium: number,
    oldPremium: number
}

export interface requestQuoteDto {
    Gender: string,
    DateOfBirth: string,
    Value: string
}

export interface ValidateQuoteDto {
    tempString: object,
    qouteChoice: number,

}


export interface GeneratePolicyCertificateDto {
    policyno: string,
}


export interface FileUploadDto {
    imageUrl: string;
    refId: string;
    docType: string;
}


export interface MultipleFileUploadDto {
    front_view: string;
    rear_view: string;
    selfie: string;
    chassis_view: string;
    valid_id: string;
    vehicle_license: string;
    left_view: string;
    right_view: string;
    refId: string;
    contactId: string;
}

export interface State {
    state: string;
    alias: string;
    lgas: string[];
}

export interface FetchStateResult {
    success: boolean;
    state?: string;
}

export interface FetchCarResult {
    success: boolean;
    item?: string;
}

export interface CarData {
    [brand: string]: string[];
}