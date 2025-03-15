import { ok } from "assert";
import axios from "axios";
import { Request, Response, NextFunction } from "express";

export default class TicTacToeController {
	async nextAiMove(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { aiRole, currentBoard, playerRole } = req.body;

			const response = await axios.post(
				"https://openrouter.ai/api/v1/chat/completions",
				{
					model: "google/gemini-2.0-flash-thinking-exp-1219:free",
					messages: [
						{
							role: "system",
							content: `You are a defensive Tic Tac Toe AI, playing strictly as ${aiRole}.
                        Your only goal is to prevent the opponent O from winning at all cost.
                        Before making a move, check if the opponent is one move away from winning using these win patterns:
                        [[0, 1, 2], [3, 4, 5], [6, 7, 8],[0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

                        Never change roles—you must always play as ${playerRole}.
                        If a winning move is found for the opponent, block it immediately.
                        If no block is needed, make a random move to keep the game going.
                        If there is a change you win in one move, take it, and win.
                        Return the updated board in the exact same format, replacing exactly one "null" with your move.
                        No extra text—just output the updated board.
                        this is the current board ${currentBoard}
                        Your next move is ?`,
						},
					],
				},
				{
					headers: {
						Authorization: `Bearer ${process.env.PRIVATE_KEY}`,
					},
				}
			);
			const data = await response.data.choices[0].message.content;
			const formated = data.replace(/```/g, "").trim();
			console.log("ini response", data);
			console.log("ini formated", formated);

			res.status(200).send({ nextBoard: formated });
		} catch (error) {
			console.error("AI move error:", error);
			next(error); // Forward error to the global error handler
		}
	}
}
