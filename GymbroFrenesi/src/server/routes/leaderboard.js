import express from 'express';

export function createLeaderboardRouter(leaderboardController) {
    const router = express.Router();
    router.get('/leaderboard', leaderboardController.getTop);
    return router;
}