import { MongoClient, Collection } from 'mongodb';
import { CompleteApplication } from '../dto/pavis.dto';
import { generateApplicationReference } from '../helper/utils';

const isProduction = process.env.NODE_ENV === 'production';

const mongoURI: string = (isProduction ? process.env.MONGO_URI_PROD_LOG : process.env.MONGO_URI_DEV_LOG) ?? "mongodb://localhost:27017";

const collectionName = 'applications';


/**
 * Checks if a given application reference ID exists in the database.
 * @param reference The application reference ID to check.
 * @param collection The MongoDB collection to check against.
 * @returns A promise that resolves to true if the reference exists, false otherwise.
 */
async function checkIfReferenceExists(
    reference: string,
    collection: Collection<CompleteApplication>
): Promise<boolean> {
    const documentWithReference = await collection.findOne({ appln_id: reference });
    return !!documentWithReference; // Returns true if found, false if null
}



/**
 * Generates a unique application reference ID, ensuring it does not already exist in the database.
 * @returns A promise that resolves to a unique application reference string.
 */
export async function generateUniqueApplicationReference(): Promise<string> {
    let client: MongoClient | null = null;
    try {
        client = new MongoClient(mongoURI);
        await client.connect();
        const db = client.db();
        const applicationCollection = db.collection<CompleteApplication>(collectionName);

        let reference: string;
        let exists: boolean;
        do {
            reference = await generateApplicationReference(); // Generate a new reference
            exists = await checkIfReferenceExists(reference, applicationCollection); // Check if it exists
        } while (exists); // Repeat until a unique reference is found

        return reference; // Return the unique reference
    } catch (error) {
        console.error('Error generating unique application reference:', error);
        throw error; // Re-throw to be handled by the caller
    } finally {
        if (client) {
            await client.close();
        }
    }
}



export async function saveInitApplicationData(data: CompleteApplication): Promise<boolean> {
    let client: MongoClient | null = null;
    try {
        client = new MongoClient(mongoURI);
        await client.connect();
        const db = client.db();
        const application: Collection<CompleteApplication> = db.collection(collectionName);

        const result = await application.insertOne(data);
        console.log("Result: ", result)
        return result.acknowledged;
    } catch (error) {
        console.error('Error saving data:', error);
        return false;
    } finally {
        if (client) {
            await client.close();
        }
    }
}


