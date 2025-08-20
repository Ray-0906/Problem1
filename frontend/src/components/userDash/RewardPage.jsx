import { Gift } from "lucide-react";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";

const RewardPage = () => {
  const [me, setMe] = useState({ exp: 0, rank: 0, totalUsers: 0 });
  const [board, setBoard] = useState([]);
  const greenPoints = me?.exp || 0;

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, lbRes] = await Promise.all([
          axiosInstance.get("/api/rewards/me"),
          axiosInstance.get("/api/rewards/leaderboard?limit=10"),
        ]);
        setMe(meRes.data || {});
        const mapped = (lbRes.data?.top || []).map((u) => ({
          rank: u.rank,
          name: u._id === meRes.data?._id ? "You" : u.name,
          points: u.points,
          isUser: u._id === meRes.data?._id,
        }));
        // If current user not in top list, append them at the end
        const inTop = mapped.some((u) => u.isUser);
        if (!inTop && lbRes.data?.me) {
          mapped.push({
            rank: lbRes.data.me.rank,
            name: "You",
            points: lbRes.data.me.points,
            isUser: true,
          });
        }
        setBoard(mapped);
      } catch (e) {
        console.error("Failed to load rewards", e);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Green Rewards
          </h2>
          <p className="text-gray-600 mb-6">
            Your earned tokens and achievements
          </p>
          <div className="text-5xl font-bold text-yellow-600 mb-2">
            {greenPoints}
          </div>
          <div className="text-gray-600">Total Green Points</div>
          {me?.rank ? (
            <div className="mt-2 text-sm text-gray-500">Rank #{me.rank} of {me.totalUsers || 0} users</div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Available Rewards</h3>
          <div className="space-y-3">
            {[
              { name: "Tree Planting Kit", cost: 500, available: greenPoints >= 500 },
              { name: "Eco-Friendly Badge", cost: 200, available: greenPoints >= 200 },
              { name: "Premium Features", cost: 1000, available: greenPoints >= 1000 },
              { name: "Conservation Donation", cost: 2000, available: greenPoints >= 2000 },
            ].map((reward, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  reward.available
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <span
                  className={
                    reward.available ? "text-gray-800" : "text-gray-500"
                  }
                >
                  {reward.name}
                </span>
                <span
                  className={`font-semibold ${
                    reward.available ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {reward.cost} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Leaderboard</h3>
          <div className="space-y-3">
            {board.map((user, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  user.isUser
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      user.rank <= 3
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {user.rank}
                  </span>
                  <span
                    className={
                      user.isUser
                        ? "font-bold text-emerald-700"
                        : "text-gray-700"
                    }
                  >
                    {user.name}
                  </span>
                </div>
                <span
                  className={`font-semibold ${
                    user.isUser ? "text-emerald-600" : "text-gray-600"
                  }`}
                >
                  {user.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardPage;
