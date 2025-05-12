import { VercelRequest, VercelResponse } from "@vercel/node";
import { usersData } from "../helpers/db.connect";

export default async function loginOrRegister(req: VercelRequest, res: VercelResponse) {
	try {
		if (req.method !== "POST") {
			return res.status(405).json({ error: "No no no" });
		}
		if (!req.body) {
			return res.status(400).json({ error: "No data provided" });
		}

		const { wallet, username } = req.body;

		if (!wallet || !username) {
			return res.status(400).json({ error: "Invalid tata" });
		}

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

		return res.status(201).send("User registered successfully");
	} catch (error) {
		console.error("Login e error:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
}
