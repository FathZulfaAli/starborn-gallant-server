import { NextFunction, Request, Response } from "express";
import { usersData } from "../helpers/db.connect";
import { ApiError } from "../utils/ApiError";

export default class AuthController {
	async loginOrRegister(req: Request, res: Response, next: NextFunction) {
		try {
			const { wallet, username } = req.body;

			if (!wallet || !username) throw new ApiError(400, "Missing required fields");

			const userdata = await usersData.findOne({ wallet });

			if (userdata) {
				res.status(200).json(userdata);
				return;
			}

			await usersData.insertOne({
				username,
				wallet,
				ttt: {
					numberPlayed: 0,
					numberWin: 0,
					highestWinStreak: 0,
					winStreak: {
						w: 0,
						ws2: 0,
						ws3: 0,
						ws4: 0,
						ws5: 0,
					},
				},
				totalNblrMinted: 0,
				createdAt: new Date(),
			});

			res.status(201).send("User registered successfully");
		} catch (error) {
			next(error);
		}
	}
}
