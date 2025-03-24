import { Request, Response, NextFunction } from "express";
import { txExecutor } from "./tx.executor";
import { jwtVerifier } from "./jwt.verifier";

export default class RewardController {
	rewardPlayer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { playerPubKey, token } = req.body;

			if (!playerPubKey || !token) throw new Error("Invalid data");

			const decoded = await jwtVerifier(token);
			if (typeof decoded === "string") throw new Error("Invalid token payload");

			if (decoded.wallet !== playerPubKey) throw new Error("Invalid wallet");

			const tx = await txExecutor(decoded.wallet, decoded.rewardAmount);
			res.status(200).send({ link: tx.explolerLink });
		} catch (error) {
			console.error("Rewarding system error:", error);
			next(error);
		}
	};
}
