import { Request, Response, NextFunction } from "express";
import {
	address,
	createSolanaClient,
	getExplorerLink,
	getSignatureFromTransaction,
	signTransactionMessageWithSigners,
} from "gill";
import {
	loadKeypairSignerFromEnvironment,
	loadKeypairSignerFromFile,
} from "gill/node";
import {
	buildTransferTokensTransaction,
	TOKEN_PROGRAM_ADDRESS,
} from "gill/programs/token";

export default class RewardController {
	rewardPlayer = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const signer = await loadKeypairSignerFromEnvironment("SIGNER");

			const { rpc, sendAndConfirmTransaction } = createSolanaClient({
				urlOrMoniker: "devnet",
			});

			const { value: latestBlockhash } = await rpc
				.getLatestBlockhash()
				.send();

			const mint = address(
				"AEebqYuDhemMLP16MaLNEJSTFvCSzaiijTbQidFGs9m1"
			);
			const tokenProgram = TOKEN_PROGRAM_ADDRESS;

			const tx = await buildTransferTokensTransaction({
				feePayer: signer,
				version: "legacy",
				latestBlockhash,
				// TODO: Change the amount to be rewarded
				amount: 1_000_000_000,
				authority: signer,
				destination: address(req.body.playerPubKey),
				mint,
				tokenProgram,
			});

			const signedTransaction = await signTransactionMessageWithSigners(
				tx
			);

			console.log(tx);

			console.log(
				"Explorer:",
				getExplorerLink({
					cluster: "devnet",
					transaction: getSignatureFromTransaction(signedTransaction),
				})
			);

			const confirmation = await sendAndConfirmTransaction(
				signedTransaction
			);

			res.status(200).send({ confirmation });
		} catch (error) {
			console.error("Rewarding system error:", error);
			next(error);
		}
	};
}
