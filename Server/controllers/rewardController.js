import User from "../models/user.js";

// GET /api/rewards/me
export const getMyRewards = async (req, res) => {
  try {
    const me = await User.findById(req.user._id).select("name role exp");
    if (!me) return res.status(404).json({ message: "User not found" });

    // Only compute rank among regular users
    const [betterCount, totalUsers] = await Promise.all([
      User.countDocuments({ role: "user", exp: { $gt: me.exp } }),
      User.countDocuments({ role: "user" }),
    ]);

    const rank = betterCount + 1;

    res.json({
      _id: me._id,
      name: me.name,
      role: me.role,
      exp: me.exp || 0,
      rank,
      totalUsers,
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to load rewards", error: e?.message });
  }
};

// GET /api/rewards/leaderboard?limit=10
export const getLeaderboard = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);

    const top = await User.find({ role: "user" })
      .sort({ exp: -1, createdAt: 1 })
      .limit(limit)
      .select("name exp role");

    const me = await User.findById(req.user._id).select("name exp role");
    const betterCount = await User.countDocuments({ role: "user", exp: { $gt: me.exp || 0 } });

    res.json({
      top: top.map((u, idx) => ({
        _id: u._id,
        name: u.name,
        points: u.exp || 0,
        rank: idx + 1,
      })),
      me: {
        _id: me._id,
        name: me.name,
        points: me.exp || 0,
        rank: betterCount + 1,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to load leaderboard", error: e?.message });
  }
};
