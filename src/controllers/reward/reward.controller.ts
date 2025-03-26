import { Request, Response, NextFunction } from "express";
import { txExecutor } from "./tx.executor";
import { jwtVerifier } from "./jwt.verifier";
import { client } from "../../helpers/db.connect";

export default class RewardController {
	rewardPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { playerPubKey, token } = req.body;
			const db = client.db("Nonce");
			const collection = db.collection("Stb-nonce");

			if (!playerPubKey || !token) throw new Error("Invalid data");

			const decoded = await jwtVerifier(token);

			if (typeof decoded === "string") throw new Error("Invalid token payload");

			if (decoded.wallet !== playerPubKey) throw new Error("Invalid wallet");

			const checkNonce = await collection.findOne({ nonce: decoded.nonce });

			if (checkNonce) throw new Error("Fraud detected, try again later");

			await collection.insertOne({
				wallet: decoded.wallet,
				amount: decoded.rewardAmount,
				nonce: decoded.nonce,
				createdat: new Date(),
			});

			const tx = await txExecutor(decoded.wallet, decoded.rewardAmount);
			res.status(200).send({ link: tx.explolerLink });
		} catch (error) {
			console.error("Rewarding system error:", error);
			next(error);
		}
	};
}
