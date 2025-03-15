import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { TicTacToeRouter } from "./routers/tictactoe.router";

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

		this.app.use("/tictactoe", ticTacToeRouter.getRouter());
	}

	public start(): void {
		this.app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	}
}
