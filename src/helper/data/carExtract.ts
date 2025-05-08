import * as xlsx from 'xlsx';
import * as path from 'path'; // Import the path module
import * as fs from 'fs'; // Import the file system module



interface CarData {
    [brand: string]: string[];
}




/**
 * Reads car make and model data from an Excel file and returns it as a CarData object.
 * @param filePath - The path to the Excel file.
 * @returns A CarData object where keys are car makes and values are arrays of car models, or null on error.
 */
const readCarMakeModelFromExcel = (filePath: string): CarData | null => {
    try {
        const absolutePath = path.resolve(filePath);
        const workbook = xlsx.readFile(absolutePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const excelData = xlsx.utils.sheet_to_json<any>(worksheet, { header: 1, defval: '' });

        const carData: CarData = {};
        // let currentMake = '';
        let modelKey: string | null = null;

        for (const row of excelData) {
            const rowKeys = Object.keys(row);

            if (rowKeys.length > 0 && row[rowKeys[0]]?.toString().toLowerCase() === 'make') {
                // Skip the header row
                continue;
            }

            if (rowKeys.length > 0) {
                const make = row[rowKeys[0]]?.toString().trim();

                 if(rowKeys.length > 1){
                    modelKey = row[rowKeys[1]]?.toString().trim();
                 }


                if (make) {
                    if (!carData[make]) {
                        carData[make] = [];
                    }
                    if(modelKey){
                         carData[make].push(modelKey);
                    }
                   
                }
            }
        }



        const outputFilePath = 'car_data.json';

         // Write to file if outputFilePath is provided
         if (outputFilePath) {
            try {
                const jsonData = JSON.stringify(carData, null, 2); //pretty print json
                fs.writeFileSync(outputFilePath, jsonData, 'utf8');
                console.log(`Successfully wrote car data to ${outputFilePath}`);
            } catch (err) {
                console.error("Error writing to file:", err);
                // Don't return null because we successfully read the excel file
            }
        }



        return carData;
    } catch (error: any) {
        console.error("Error reading Excel file:", error);
        return null;
    }
};


export function testExtract() {

    console.log("in car extractor");

    // Example Usage
    const excelFilePath = './src/helper/data/car_data.xlsx'; // Replace with the actual path to your Excel file
    const carMakeModelObject: CarData | null = readCarMakeModelFromExcel(excelFilePath);
    
    if (carMakeModelObject) {
        console.log(carMakeModelObject);
    } else {
        console.error("Failed to read car data from Excel file.");
    }
    
}
