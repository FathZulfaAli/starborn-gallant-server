import { Router } from "express";
import RewardController from "../controllers/reward/reward.controller";

export class RewardRouter {
	private router: Router;
	private rewardController: RewardController;

	constructor() {
		this.rewardController = new RewardController();
		this.router = Router();
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.post("/sent", this.rewardController.rewardPlayer);
	}

	getRouter(): Router {
		return this.router;
	}
}
