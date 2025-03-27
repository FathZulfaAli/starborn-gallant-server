import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const headCheck = (req: Request, res: Response, next: NextFunction) => {
	try {
		const { authorization } = req.headers;

		if (!authorization) {
			throw new ApiError(401, "Unauthorized");
		}

		const token = String(authorization || "").split("Bearer ")[1];

		if (token !== process.env.HEAD_CHECK) {
			throw new ApiError(401, "no no no");
		}

		next();
	} catch (error) {
		next(error);
	}
};
