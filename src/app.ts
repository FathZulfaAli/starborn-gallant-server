import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import * as anchor from "@project-serum/anchor";
import { TicTacToeRouter } from "./routers/tictactoe.router";
import "dotenv/config";
import { Connection } from "@solana/web3.js";
import { RewardRouter } from "./routers/reward.router";

const PORT = 8000;

export default class App {
	private app: Express;

	constructor() {
		this.app = express();
		this.configure();
		this.routes();
		this.errorHandle();
	}

	private configure() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private errorHandle(): void {
		this.app.use(
			(err: Error, req: Request, res: Response, next: NextFunction) => {
				console.log("ERROR :", err.stack);
				res.status(500).send(err.message);
			}
		);
	}

	private routes(): void {
		const ticTacToeRouter = new TicTacToeRouter();
		const rewardRouter = new RewardRouter();

		this.app.use("/tictactoe", ticTacToeRouter.getRouter());
		this.app.use("/reward", rewardRouter.getRouter());
	}

	public start(): void {
		this.app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	}
}
