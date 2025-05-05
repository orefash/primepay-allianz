
import { promises as fs } from 'fs'; // Use promises version for async/await
import * as path from 'path';

import { Request, Response } from 'express';
import { sendFlow } from '../helper/manychatHelper';


// export const callbackManyChatController = async (req: Request, res: Response) => {
//     console.log("in callback: ", req.params.txt);
//     let contactId = req.params.txt;

//     let data = await sendFlow(contactId, "pay_confirm");

//     res.status(200).json({
//         data: data,
//         //   status: serverStatus(),
//     });
// };



export const callbackManyChatController = async (req: Request, res: Response) => {
    console.log("in paystack callback: ", req.params.txt);
    let contactId = req.params.txt;

    try {
        let data = await sendFlow(contactId, "pay_confirm");

        console.log("Sendflow resp: ", data)

        //  Important:  Set the content type to HTML
        res.setHeader('Content-Type', 'text/html');

        //  Load the HTML from the file
        const htmlFilePath = path.join(__dirname, '../web/pay_success.html'); // Adjust the path!
        const htmlContent = await fs.readFile(htmlFilePath, 'utf8');

        //  Dynamically inject data into the HTML.  This is VERY BASIC and you
        //  should use a proper templating engine for anything more complex.
        let dynamicHtml = htmlContent;
            // .replace('{{CONTACT_ID}}', contactId)
            // .replace('{{STATUS}}', data.success ? 'Success' : 'Failed')
            // .replace('{{MESSAGE}}', data.message)
            // .replace('{{FLOW_DATA}}', data.flowData ? JSON.stringify(data.flowData) : '');

        res.status(200).send(dynamicHtml); // Send the HTML string

    } catch (error: any) {
        //  Handle errors, including file reading errors
        console.error("Error in callbackManyChatController:", error);
        res.setHeader('Content-Type', 'text/html');
        const errorHtmlFilePath = path.join(__dirname, 'error.html'); // Create an error.html file
        try {
            const errorHtmlContent = await fs.readFile(errorHtmlFilePath, 'utf8');
             const dynamicErrorHtml = errorHtmlContent.replace('{{ERROR_MESSAGE}}', error.message);
            res.status(500).send(dynamicErrorHtml);
        } catch (fileError) {
            //  If we can't read the error file, send a basic error message
            console.error("Error reading error HTML file:", fileError);
            res.status(500).send(`<h1>Internal Server Error</h1><p>An error occurred: ${error.message}</p>`);
        }
    }
};