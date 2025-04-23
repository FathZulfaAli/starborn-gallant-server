import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { TicTacToeRouter } from "./routers/tictactoe.router";
import "dotenv/config";
import { RewardRouter } from "./routers/reward.router";
import { SauceRouter } from "./routers/sauce.router";
import { dbconnect } from "./helpers/db.connect";
import { ApiError } from "./utils/ApiError";
import { AuthRouter } from "./routers/auth.router";
import { headCheck } from "./middleware/headCheck";

const PORT = 8000;

export default class App {
	private app: Express;

	constructor() {
		this.app = express();
		this.configure();
		this.routes();
		this.errorHandle();
		this.db();
	}

	private configure() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private errorHandle(): void {
		this.app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
			if (err instanceof ApiError) {
				res.status(err.statusCode).json({ error: err.message });
			}
			res.status(500).send("Internal Server Error");
			// else {
			// 	res.status(500).json({ error: "Internal Server Error", details: err });
			// }
		});
	}

	private routes(): void {
		const ticTacToeRouter = new TicTacToeRouter();
		const rewardRouter = new RewardRouter();
		const sauceRouter = new SauceRouter();
		const authRouter = new AuthRouter();

		this.app.use("/tictactoe", headCheck, ticTacToeRouter.getRouter());
		this.app.use("/reward-airdrop", headCheck, rewardRouter.getRouter());
		this.app.use("/sauce", headCheck, sauceRouter.getRouter());
		this.app.use("/package", headCheck, authRouter.getRouter());
	}

	private async db(): Promise<void> {
		dbconnect();
	}

	public start(): void {
		this.app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	}
}
