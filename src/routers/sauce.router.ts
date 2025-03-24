import { Router } from "express";
import SauceController from "../controllers/sauce.controller";

export class SauceRouter {
	private router: Router;
	private sauceController: SauceController;

	constructor() {
		this.sauceController = new SauceController();
		this.router = Router();
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.post("/get-recipe", this.sauceController.getRecipe);
	}

	getRouter(): Router {
		return this.router;
	}
}
