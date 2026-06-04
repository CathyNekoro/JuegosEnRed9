export function createLeaderboardController(userService) {
    return {
        // GET /leaderboard?limit=10
        getTop(req, res) {
            const limit = parseInt(req.query.limit) || 10;
            const top = userService.getTopUsers(limit);
            res.json({ ok: true, leaderboard: top });
        }
    };
}