import { VercelRequest, VercelResponse } from "@vercel/node";
import { txExecutor } from "../helpers/tx.executor";
import { nonceCollection } from "../helpers/db.connect";
import { jwtVerifier } from "../helpers/jwt.verifier";

export default async function rewardPlayer(req: VercelRequest, res: VercelResponse) {
	try {
		if (req.method !== "POST") {
			return res.status(405).json({ error: "No no no" });
		}
		if (!req.body) {
			return res.status(400).json({ error: "No data provided" });
		}
		const { playerPubKey, token } = req.body;

		if (!playerPubKey || !token) return res.status(400).json({ error: "Invalid data" });

		const decoded = await jwtVerifier(token);

		if (typeof decoded === "string") return res.status(400).json({ error: "Invalid token" });

		if (decoded.wallet !== playerPubKey)
			return res.status(400).json({ error: "Invalid wallet" });

		if (await nonceCollection.findOne({ nonce: decoded.nonce }))
			return res.status(403).json({ error: "No no no" });

		await nonceCollection.insertOne({
			wallet: decoded.wallet,
			amount: decoded.rewardAmount,
			nonce: decoded.nonce,
			createdat: new Date(),
		});

		const tx = await txExecutor(decoded.wallet, decoded.rewardAmount);
		res.status(200).send({ link: tx.explolerLink });
	} catch (error) {
		console.error("Reward error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}
