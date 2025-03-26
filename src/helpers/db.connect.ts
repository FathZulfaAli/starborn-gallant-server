import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URL;

export const client = new MongoClient(uri!, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

export async function dbconnect() {
	try {
		await client.connect();
		console.log("Database connection is secure");
	} catch (error) {
		console.log(error);
	}
}

const db = client.db("Nonce");
export const nonceCollection = db.collection("Stb-nonce");
