// import { FetchStateResult, CarData } from "../types/appTypes";
import { FetchCarResult } from "../types/appTypes";
import carData from "./data/carData";

export interface DataFetchResponse {
    listString: string,
    page: number,
    maxPage: number
}

interface DataFetchInterResponse {
    dataList: string[],
    startIndex: number,
    page: number,
    maxPage: number
}


const itemsPerPage = 10; // Number of states per page

export function getPaginatedData(page: number, dataList: string[]): DataFetchInterResponse {
    // Calculate the start and end indices for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Check if the start index is out of bounds
    if (startIndex < 0 || startIndex >= dataList.length) {
        throw new Error('Invalid page number. Page out of bounds.');
    }

    // Get the states for the current page
    const currentPageStates = dataList.slice(startIndex, endIndex);

    // Get max no. of pages
    const maxPage = Math.ceil(dataList.length / itemsPerPage);


    return {
        dataList: currentPageStates,
        startIndex,
        page,
        maxPage
    };
}

// export function getPaginatedData(page: number): StateFetchInterResponse {
//     // Calculate the start and end indices for the current page
//     const startIndex = (page - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;

//     // Check if the start index is out of bounds
//     if (startIndex < 0 || startIndex >= statesData.length) {
//         throw new Error('Invalid page number. Page out of bounds.');
//     }

//     // Get the states for the current page
//     const currentPageStates = statesData.slice(startIndex, endIndex);

//     // Get max no. of pages
//     const maxPage = Math.ceil(statesData.length / itemsPerPage);


//     return {
//         states: currentPageStates,
//         startIndex,
//         page,
//         maxPage
//     };
// }

export function getDataString(currentPageData: string[], startIndex: number): string {
    // Create a paginated string
    let paginatedStates = '';

    // Iterate through the states for the current page and number them starting from 1
    for (let i = 0; i < currentPageData.length; i++) {
        const data = currentPageData[i];
        const pageNumber = i + 1; // Calculate the item number starting from 1

        // Add the state to the paginated string with its page number
        paginatedStates += `${pageNumber}. ${data}\n`;
    }

    return paginatedStates;
}


export function getPaginatedDataString(page: number, type: number, carType?: string): DataFetchResponse {

    let dataList: string[] | null = null;

    if(type === 1)
        dataList = Object.keys(carData);
    else if(carType)
        dataList = carData[carType];

    if(!dataList)
        throw new Error("invalid Inputs")

    const currentData: DataFetchInterResponse = getPaginatedData(page, dataList);

    const dataString: string = getDataString(currentData.dataList, currentData.startIndex);

    return {
        listString: dataString,
        page: currentData.page,
        maxPage: currentData.maxPage
    }

}

export function getCarByPageAndItem(page: number, itemNumber: number, type: number, carType?: string): FetchCarResult {

    let dataList: string[] | null = null;

    if(type === 1)
        dataList = Object.keys(carData);
    else if(carType)
        dataList = carData[carType];

    if(!dataList)
        throw new Error("invalid Inputs");
    

    // Calculate the start index for the current page
    const startIndex = (page - 1) * itemsPerPage;

    // Check if the itemNumber is within the valid range for the current page
    if (itemNumber >= 1 && itemNumber <= itemsPerPage) {
        // Calculate the index of the state within the current page
        const stateIndex = startIndex + itemNumber - 1;

        // Check if the stateIndex is within the valid range for the entire list
        if (stateIndex >= 0 && stateIndex < dataList.length) {
            // Retrieve and return the state at the calculated index
            return { success: true, item: dataList[stateIndex] };
        } else {
            return { success: false, item: "Item number is out of range for the entire list." };
        }
    } else {
        return { success: false, item: "Item number is out of range for the current page." };
    }
}
