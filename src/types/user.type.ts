export interface User {
	username: string;
	wallet: string;
	ttt: {
		numberPlayed: number;
		numberWin: number;
		highestWinStreak: number;
		winStreak: {
			w: number;
			ws2: number;
			ws3: number;
			ws4: number;
			ws5: number;
		};
	};
	totalNblrMinted: number;
	createdAt: Date;
	updatedAt?: Date;
	// ? Typing Word
}
