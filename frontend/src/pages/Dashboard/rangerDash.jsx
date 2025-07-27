// src/pages/RangerDashboard.jsx
import { useState } from "react";
import { ShieldCheck, MapPin, ClipboardList, AlertCircle, User, LogOut } from "lucide-react";
import NearbyReports from "../../components/nearby";
import UnconfirmedEcologistReviews from "../../components/Assignment";
import EndangeredSpeciesMap from "../../components/Endanger";
import AdminCallHandler from "../../components/AdminHandler";
import IncomingCallList from "../../components/IncomingCalls";

const rangerMenu = [
  { label: "Dashboard", icon: <ShieldCheck />, key: "dashboard" },
  { label: "Nearby Reports", icon: <MapPin />, key: "reports" },
  { label: "Assignments", icon: <ClipboardList />, key: "assignments" },
  { label: "Community Alerts", icon: <AlertCircle />, key: "alerts" },
  { label: "Profile", icon: <User />, key: "profile" },
  { label: "Verify Calls", icon: <User />, key: "verify" },
];
export default function RangerDashboard() {
  const [active, setActive] = useState("dashboard");

  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return <div>👮 Welcome Ranger! Monitor your zone and take action.<EndangeredSpeciesMap/></div>;
      case "reports":
        return <div>📍View recent disease/plant reports near your location.<NearbyReports/></div>;
      case "assignments":
        return <div>📝 Your assigned areas and active tasks.<UnconfirmedEcologistReviews/></div>;
      case "alerts":
        return <div>🚨 Emergency or critical alerts from users.</div>;
      case "profile":
        return <div>👤 Update your profile and settings.</div>;
      case "verify":
        return <div><IncomingCallList/></div>;  
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50">
      {/* Sidebar */}
      <aside className="w-64 bg-green-800 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">Ranger Panel 🌳</h1>

        {rangerMenu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl w-full text-left ${
              active === item.key ? "bg-green-700" : "hover:bg-green-700/70"
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

      {/* Main Section */}
      <main className="flex-1 p-8">
        <h2 className="text-xl font-bold text-green-700 mb-4 capitalize">
          {active.replace("-", " ")}
        </h2>
        <div className="bg-white shadow-md rounded-xl p-6">{renderContent()}</div>
      </main>
    </div>
  );
}
