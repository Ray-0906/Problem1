import { Link } from "react-router-dom";
import { Leaf, Globe, Map, ShieldCheck } from "lucide-react";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white p-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Leaf className="w-6 h-6" /> EcoRanger
        </h1>
        <nav className="space-x-6">
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white text-green-700 px-4 py-2 rounded hover:bg-green-100 font-semibold"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
          Empower Rangers. Protect Nature.
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-8">
          A smart ecosystem to track, report, and respond to ecological observations in real-time.
        </p>
        <Link
          to="/ranger"
          className="bg-green-700 text-white px-6 py-3 rounded-xl text-lg hover:bg-green-800 transition"
        >
          Enter Ranger Portal
        </Link>
      </section>

      {/* Features */}
      <section className="bg-white py-16 px-6 md:px-20">
        <h3 className="text-3xl font-bold text-green-800 mb-10 text-center">Key Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Globe className="w-8 h-8 text-green-600" />}
            title="Geo-Aware Reports"
            description="View plant and disease reports filtered by your location."
          />
          <FeatureCard
            icon={<Map className="w-8 h-8 text-green-600" />}
            title="Smart Assignments"
            description="Get assigned to zones and tasks based on ranger capacity."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-8 h-8 text-green-600" />}
            title="Secure Approval & Rewards"
            description="Approve verified reports and reward observers with tokens."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white text-center p-4">
        &copy; {new Date().getFullYear()} EcoRanger. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center shadow hover:shadow-md transition">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h4 className="text-xl font-semibold text-green-700 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
