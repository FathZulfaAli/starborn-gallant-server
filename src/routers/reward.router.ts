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

	// TODO: change the route name
	private initializeRoutes(): void {
		this.router.post("/tes", this.rewardController.rewardPlayer);
	}

	getRouter(): Router {
		return this.router;
	}
}
