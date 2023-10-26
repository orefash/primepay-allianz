import { FetchStateResult, State } from "../types/appTypes";
import statesData from "./data/nigeriaStates";

export interface StateFetchResponse {
    stateString: string,
    page: number,
    maxPage: number
}

interface StateFetchInterResponse {
    states: State[],
    startIndex: number,
    page: number,
    maxPage: number
}


const statesPerPage = 10; // Number of states per page

export function getPaginatedStates(page: number): StateFetchInterResponse {
    // Calculate the start and end indices for the current page
    const startIndex = (page - 1) * statesPerPage;
    const endIndex = startIndex + statesPerPage;

    // Check if the start index is out of bounds
    if (startIndex < 0 || startIndex >= statesData.length) {
        throw new Error('Invalid page number. Page out of bounds.');
    }

    // Get the states for the current page
    const currentPageStates = statesData.slice(startIndex, endIndex);

    // Get max no. of pages
    const maxPage = Math.ceil(statesData.length / statesPerPage);


    return {
        states: currentPageStates,
        startIndex,
        page,
        maxPage
    };
}

export function getStatesString(currentPageStates: State[], startIndex: number): string {
    // Create a paginated string
    let paginatedStates = '';

    // Iterate through the states for the current page and number them starting from 1
    for (let i = 0; i < currentPageStates.length; i++) {
        const state = currentPageStates[i];
        const pageNumber = i + 1; // Calculate the page number starting from 1

        // Add the state to the paginated string with its page number
        paginatedStates += `${pageNumber}. ${state.state}\n`;
    }

    return paginatedStates;
}


export function getPaginatedStatesString(page: number): StateFetchResponse {

    const currentStates: StateFetchInterResponse = getPaginatedStates(page);

    const stateString: string = getStatesString(currentStates.states, currentStates.startIndex);

    return {
        stateString,
        page: currentStates.page,
        maxPage: currentStates.maxPage
    }

}

export function getStateByPageAndItem(page: number, itemNumber: number): FetchStateResult {
    // Calculate the start index for the current page
    const startIndex = (page - 1) * statesPerPage;

    // Check if the itemNumber is within the valid range for the current page
    if (itemNumber >= 1 && itemNumber <= statesPerPage) {
        // Calculate the index of the state within the current page
        const stateIndex = startIndex + itemNumber - 1;

        // Check if the stateIndex is within the valid range for the entire list
        if (stateIndex >= 0 && stateIndex < statesData.length) {
            // Retrieve and return the state at the calculated index
            return { success: true, state: statesData[stateIndex].state };
        } else {
            return { success: false, state: "Item number is out of range for the entire list." };
        }
    } else {
        return { success: false, state: "Item number is out of range for the current page." };
    }
}
