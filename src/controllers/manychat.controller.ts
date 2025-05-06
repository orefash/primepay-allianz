
// import { promises as fs } from 'fs'; // Use promises version for async/await
// import * as path from 'path';

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

        const successHtml = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="bg-gray-100 flex justify-center items-center h-screen">
    <div class="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div class="flex justify-center mb-6">
            <img src="https://www.prime-pay.africa/images/primepayLogo.png" alt="Company Logo" class="h-20 w-auto">
        </div>
        <h2 class="text-2xl font-semibold text-blue-900 text-center mb-4">Payment Successful!</h2>
        <p class="text-gray-700 text-center mb-6">Thank you for your insurance premium payment. Your application is under processing</p>
        <div class="text-center">
            <a href"https://wa.me/2348185460000" class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-5 rounded-lg transition duration-300 ease-in-out flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2048px-WhatsApp.svg.png" alt="WhatsApp Logo" class="h-6 w-6 mr-2">
                Continue in WhatsApp
            </a>
        </div>
    </div>
</body>
</html>

        `;


        res.status(200).send(successHtml); // Send the HTML string

    } catch (error: any) {
        //  Handle errors, including file reading errors
        console.error("Error in callbackManyChatController:", error);

        const errorHtml = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Error</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="bg-gray-100 flex justify-center items-center h-screen">
    <div class="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <div class="flex justify-center mb-6">
            <img src="https://www.prime-pay.africa/images/primepayLogo.png" alt="Company Logo" class="h-20 w-auto">
        </div>
        <h2 class="text-2xl font-semibold text-red-700 text-center mb-4">Payment Error!</h2>
        <p class="text-gray-700 text-center mb-6">
            We encountered an error processing your payment. Please try again later.
        </p>
    </div>
</body>
</html>

        `;

        res.status(500).send(errorHtml);

        // const errorHtmlFilePath = path.join(__dirname, 'public', 'web', 'pay_error.html'); // Create an error.html file
        // try {
        //     const errorHtmlContent = await fs.readFile(errorHtmlFilePath, 'utf8');
        //     const dynamicErrorHtml = errorHtmlContent.replace('{{ERROR_MESSAGE}}', error.message);
        //     res.status(500).send(dynamicErrorHtml);
        // } catch (fileError) {
        //     //  If we can't read the error file, send a basic error message
        //     console.error("Error reading error HTML file:", fileError);
        //     res.status(500).send(`<h1>Internal Server Error</h1><p>An error occurred: ${error.message}</p>`);
        // }
    }
};