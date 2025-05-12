import { VercelRequest, VercelResponse } from "@vercel/node";

export const headCheck = (req: VercelRequest, res: VercelResponse) => {
	try {
		const { authorization } = req.headers;

		if (!authorization) {
			res.status(401).send("no no no");
		}

		const token = String(authorization || "").split("Bearer ")[1];

		if (token !== process.env.HEAD_CHECK) {
			res.status(401).send("no no no");
		}
	} catch (error) {
		console.log("headCheck error:", error);
		res.status(500).send("Internal Server Error");
	}
};
