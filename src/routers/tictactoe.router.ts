import { Router } from "express";
import TicTacToeController from "../controllers/tictactoe.controller";

export class TicTacToeRouter {
	private router: Router;
	private tttcontroller: TicTacToeController;

	constructor() {
		this.tttcontroller = new TicTacToeController();
		this.router = Router();
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.post("/next-ai-move", this.tttcontroller.nextAiMove);
	}

	getRouter(): Router {
		return this.router;
	}
}
