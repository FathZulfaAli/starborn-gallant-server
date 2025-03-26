import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export default class SauceController {
	async getRecipe(req: Request, res: Response, next: NextFunction) {
		try {
			const { wallet, action } = req.body;

			const rewardMapping: Record<string, number> = {
				ttt_w: 500_000_000,
				ttt_ws2: 750_000_000,
				ttt_ws3: 1_000_000_000,
				ttt_ws4: 2_000_000_000,
				ttt_ws5: 3_000_000_000,
			};

			if (!wallet || !(action in rewardMapping)) throw new ApiError(400, "Invalid data");

			const rewardAmount = rewardMapping[action];

			const payload = {
				wallet,
				rewardMap: action,
				rewardAmount,
				nonce: Math.random().toString(36).substring(2, 10),
			};

			const token = jwt.sign(payload, process.env.JWT_SECRET!);

			res.status(200).send({ token });
		} catch (error) {
			// console.error("Get recipe error:", error);
			next(error);
		}
	}
}
