import { Request, Response, NextFunction } from "express";
import { txExecutor } from "./tx.executor";
import { jwtVerifier } from "./jwt.verifier";
import { nonceCollection } from "../../helpers/db.connect";
import { ApiError } from "../../utils/ApiError";

export default class RewardController {
	rewardPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { playerPubKey, token } = req.body;

			if (!playerPubKey || !token) throw new ApiError(400, "Missing required fields");

			const decoded = await jwtVerifier(token);

			if (typeof decoded === "string") throw new ApiError(400, "Invalid token");

			if (decoded.wallet !== playerPubKey) throw new ApiError(400, "Invalid wallet");

			if (await nonceCollection.findOne({ nonce: decoded.nonce }))
				throw new ApiError(400, "Fraud detected, try again later");

			await nonceCollection.insertOne({
				wallet: decoded.wallet,
				amount: decoded.rewardAmount,
				nonce: decoded.nonce,
				createdat: new Date(),
			});

			const tx = await txExecutor(decoded.wallet, decoded.rewardAmount);
			res.status(200).send({ link: tx.explolerLink });
		} catch (error) {
			// console.error("Rewarding system error:", error);
			next(error);
		}
	};
}
