import { Request, Response } from 'express';
import { StateFetchResponse, getPaginatedStatesString, getStateByPageAndItem } from '../helper/naijaStatesHandler';
import { FetchCarResult, FetchStateResult } from '../types/appTypes';
import { DataFetchResponse, getCarByPageAndItem, getPaginatedDataString } from '../helper/carDataHandler';


export const getStatesString = async (req: Request, res: Response) => {
    try {

        console.log("Page: ", req.params.page);

        if(!req.params.page)
            throw new Error("Invalid Page");

        const page: number = parseInt(req.params.page);


        // console.log("Page parse: ", page);
        // console.log("Page parse check : ", isNaN(page));
        if(isNaN(page))
            throw new Error("Invalid Page");


        const stateData: StateFetchResponse = getPaginatedStatesString(page);

        res.status(200).json({
            data: stateData,
            rstatus: 1
        });
    } catch (error) {
        console.error('Error in getting states string:', error);
        res.status(500).json({
            rstatus: 0,
            message: 'Fetch States Error',
        });
    }


};


export const fetchState = async (req: Request, res: Response) => {
    try {
        const page: number = parseInt(req.params.page);
        const item: number = parseInt(req.params.item);

        const stateData: FetchStateResult = await getStateByPageAndItem(page, item);

        res.status(200).json({
            stateString: stateData.state,
            rstatus: stateData.success ? 1 : 0
        });
    } catch (error) {
        console.error('Error in getting state:', error);
        res.status(500).json({
            rstatus: 0,
            message: 'Fetch State Error',
        });
    }


};



export const getCarString = async (req: Request, res: Response) => {
    try {

        console.log("Page: ", req.params.page);
        console.log("Req Type: ", req.params.type);
        console.log("Car Type: ", req.query.carType);


        if(!req.params.page || !req.params.type)
            throw new Error("Invalid Page Or Type");

        

        const page: number = parseInt(req.params.page);
        const reqType: number = parseInt(req.params.type);
        const carType: string | undefined = req.query?.carType as string | undefined;


        // console.log("Page parse: ", page);
        // console.log("Page parse check : ", isNaN(page));
        if(isNaN(page) || isNaN(reqType))
            throw new Error("Invalid Page");


        const carData: DataFetchResponse = getPaginatedDataString(page, reqType, carType);

        res.status(200).json({
            data: carData,
            rstatus: 1
        });
    } catch (error) {
        console.error('Error in getting car string:', error);
        res.status(500).json({
            rstatus: 0,
            message: 'Fetch Car Error',
        });
    }


};


export const fetchCarData = async (req: Request, res: Response) => {
    try {
        const page: number = parseInt(req.params.page);
        const item: number = parseInt(req.params.item);
        const reqType: number = parseInt(req.params.type);
        const carType: string | undefined = req.query?.carType as string | undefined;

        const carData: FetchCarResult = getCarByPageAndItem(page, item, reqType, carType);

        res.status(200).json({
            item: carData.item,
            rstatus: carData.success ? 1 : 0
        });
    } catch (error) {
        console.error('Error in getting Car:', error);
        res.status(500).json({
            rstatus: 0,
            message: 'Fetch Car Error',
        });
    }


};