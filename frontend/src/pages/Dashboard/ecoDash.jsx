// src/pages/EcologistDashboard.jsx
import { useState } from "react";
import { FileSearch, CheckCircle, Database, BookOpen, User, LogOut } from "lucide-react";

const ecoMenu = [
  { label: "Review Reports", icon: <FileSearch />, key: "review" },
  { label: "Submissions", icon: <CheckCircle />, key: "submissions" },
  { label: "Update Database", icon: <Database />, key: "database" },
  { label: "Research Log", icon: <BookOpen />, key: "log" },
  { label: "Profile", icon: <User />, key: "profile" },
];

export default function EcologistDashboard() {
  const [active, setActive] = useState("review");

  const renderContent = () => {
    switch (active) {
      case "review":
        return <div>🧾 Review new user reports of unidentified plants/diseases.</div>;
      case "submissions":
        return <div>✅ Approve/reject new species or disease submissions.</div>;
      case "database":
        return <div>📊 Add new entries to plant/disease database.</div>;
      case "log":
        return <div>📖 View your past research contributions and logs.</div>;
      case "profile":
        return <div>👤 Update profile and preferences.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">Eco Panel 🌿</h1>

        {ecoMenu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl w-full text-left ${
              active === item.key ? "bg-green-800" : "hover:bg-green-800/70"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        <button className="flex items-center gap-3 px-4 py-2 rounded-xl w-full text-left hover:bg-red-600/70 mt-10">
          <LogOut />
          Logout
        </button>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-8">
        <h2 className="text-xl font-bold text-green-900 mb-4 capitalize">
          {active.replace("-", " ")}
        </h2>
        <div className="bg-white shadow-md rounded-xl p-6">{renderContent()}</div>
      </main>
    </div>
  );
}
