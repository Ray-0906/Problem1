// src/pages/RangerDashboard.jsx
import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  MapPin, 
  ClipboardList, 
  AlertCircle, 
  User, 
  LogOut,
  Bell,
  Settings,
  Award,
  Leaf,
  Camera,
  Shield,
  Navigation,
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  Globe,
  TreePine,
  Heart,
  Star,
  ChevronRight,
  Zap,
  Target,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Download,
  Upload,
  Clock,
  Activity,
  Radio,
  Compass,
  Binoculars,
  Footprints,
  
  Bug,
  Menu,
  X,
  CheckSquare,
  XSquare,
  Clock3,
  MapPinned,
  Siren,
  PhoneCall,
  CheckCircle2,
  AlertOctagon,
  Flag,
  FileText
} from "lucide-react";
import NearbyReports from "../../components/nearby";
import UnconfirmedEcologistReviews from "../../components/Assignment";
import EndangeredSpeciesMap from "../../components/Endanger";
import AdminCallHandler from "../../components/AdminHandler";
import IncomingCallList from "../../components/IncomingCalls";

const rangerMenu = [
  { 
    label: "Command Center", 
    icon: Shield, 
    key: "dashboard",
    gradient: "from-blue-500 to-cyan-600",
    description: "Zone monitoring & control"
  },
  { 
    label: "Field Reports", 
    icon: MapPinned, 
    key: "reports",
    gradient: "from-green-500 to-emerald-600",
    description: "Nearby incident reports"
  },
  { 
    label: "Active Assignments", 
    icon: ClipboardList, 
    key: "assignments",
    gradient: "from-orange-500 to-red-600",
    description: "Tasks & patrol routes"
  },
  { 
    label: "Alert System", 
    icon: Siren, 
    key: "alerts",
    gradient: "from-red-500 to-pink-600",
    description: "Emergency notifications"
  },
  { 
    label: "Ranger Profile", 
    icon: User, 
    key: "profile",
    gradient: "from-indigo-500 to-purple-600",
    description: "Personnel information"
  },
  { 
    label: "Call Verification", 
    icon: PhoneCall, 
    key: "verify",
    gradient: "from-teal-500 to-emerald-600",
    description: "Incoming support calls"
  },
];

export default function RangerDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rangerStats, setRangerStats] = useState({
    reportsHandled: 89,
    patrolsCompleted: 34,
    alertsResolved: 12,
    areasCovered: 6
  });

  // Animated counter hook
  const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      let startTime;
      const startCount = 0;
      
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        setCount(Math.floor(startCount + (end - startCount) * percentage));
        
        if (percentage < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [end, duration]);
    
    return count;
  };

  const reportsHandled = useCounter(rangerStats.reportsHandled);
  const patrolsCompleted = useCounter(rangerStats.patrolsCompleted);
  const alertsResolved = useCounter(rangerStats.alertsResolved);
  const areasCovered = useCounter(rangerStats.areasCovered);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const DashboardHome = () => (
    <div className="space-y-8">
      {/* Command Center Welcome */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-12 translate-y-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Ranger Command Center 🛡️</h1>
              <p className="text-blue-100">Monitor your patrol zone and respond to environmental incidents</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-4">
            <button 
              onClick={() => setActive("reports")}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              <MapPinned className="w-5 h-5" />
              <span>Field Reports</span>
            </button>
            <button 
              onClick={() => setActive("alerts")}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              <Siren className="w-5 h-5" />
              <span>Alert System</span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{reportsHandled}</div>
          <div className="text-gray-600 text-sm">Reports Handled</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{patrolsCompleted}</div>
          <div className="text-gray-600 text-sm">Patrols Completed</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Siren className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{alertsResolved}</div>
          <div className="text-gray-600 text-sm">Alerts Resolved</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{areasCovered}</div>
          <div className="text-gray-600 text-sm">Areas Covered</div>
        </div>
      </div>

      {/* Active Incidents & Zone Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
            Active Incidents
          </h3>
          <div className="space-y-4">
            {[
              { id: "INC-001", type: "Wildlife Disturbance", location: "Sector 7-A", priority: "High", time: "15 min ago" },
              { id: "INC-002", type: "Illegal Dumping", location: "Trail Marker 23", priority: "Medium", time: "1 hour ago" },
              { id: "INC-003", type: "Plant Disease", location: "Grove Section B", priority: "Low", time: "3 hours ago" }
            ].map((incident, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{incident.id} - {incident.type}</div>
                  <div className="text-sm text-gray-600">{incident.location} • {incident.time}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    incident.priority === 'High' ? 'bg-red-100 text-red-700' :
                    incident.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {incident.priority}
                  </span>
                  <button 
                    onClick={() => setActive("reports")}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <MapPin className="w-5 h-5 text-green-500 mr-2" />
            Zone Monitoring
          </h3>
          <EndangeredSpeciesMap />
        </div>
      </div>

      {/* Patrol Status & Communication */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Compass className="w-5 h-5 text-blue-500 mr-2" />
            Patrol Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Current Shift</span>
              <span className="text-2xl font-bold text-gray-800">Day Patrol</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="text-sm text-gray-600">65% of shift completed</div>
            
            <div className="flex items-center justify-between mt-6">
              <span className="text-gray-600">Next Check-in</span>
              <span className="text-lg font-bold text-blue-600">14:30</span>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <div className="flex items-center">
                <Radio className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-blue-700 font-semibold">Radio Check: All Clear</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Footprints className="w-5 h-5 text-teal-500 mr-2" />
            Communication Hub
          </h3>
          <div className="space-y-4">
            {[
              { type: "Radio Call", from: "Ranger Station", message: "Weather update: Clear skies", time: "10 min ago", status: "received" },
              { type: "Field Report", from: "Patrol Unit 3", message: "Routine check completed", time: "25 min ago", status: "sent" },
              { type: "Alert", from: "Control Center", message: "New incident assigned", time: "1 hour ago", status: "received" }
            ].map((comm, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  comm.status === 'received' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {comm.status === 'received' ? <Download className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{comm.type}</div>
                  <div className="text-sm text-gray-600">{comm.message}</div>
                  <div className="text-xs text-gray-500 mt-1">{comm.from} • {comm.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return <DashboardHome />;
      case "reports":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <MapPinned className="w-5 h-5 text-green-500 mr-2" />
                  Field Reports & Incidents
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filter by Zone</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-6">📍 Monitor and respond to recent environmental incidents in your patrol area.</p>
              <NearbyReports />
            </div>
          </div>
        );
      case "assignments":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <ClipboardList className="w-5 h-5 text-orange-500 mr-2" />
                  Active Assignments & Tasks
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors">
                    <CheckSquare className="w-4 h-4" />
                    <span>Mark Complete</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-6">📝 Manage your assigned patrol routes, tasks, and ecological assessments.</p>
              <UnconfirmedEcologistReviews />
            </div>
          </div>
        );
      case "alerts":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Siren className="w-5 h-5 text-red-500 mr-2" />
                  Emergency Alert System
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <AlertOctagon className="w-4 h-4" />
                    <span>Broadcast Alert</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors">
                    <Bell className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-6">🚨 Monitor emergency notifications and critical alerts from the community.</p>
              
              {/* Alert Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <AlertOctagon className="w-8 h-8 text-red-500" />
                    <span className="text-2xl font-bold text-red-600">3</span>
                  </div>
                  <div className="text-red-700 font-semibold">Critical Alerts</div>
                  <div className="text-red-600 text-sm">Requires immediate action</div>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="flex items-center justify-between mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    <span className="text-2xl font-bold text-yellow-600">7</span>
                  </div>
                  <div className="text-yellow-700 font-semibold">Warning Alerts</div>
                  <div className="text-yellow-600 text-sm">Monitor closely</div>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <Bell className="w-8 h-8 text-blue-500" />
                    <span className="text-2xl font-bold text-blue-600">12</span>
                  </div>
                  <div className="text-blue-700 font-semibold">Info Alerts</div>
                  <div className="text-blue-600 text-sm">General notifications</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <User className="w-5 h-5 text-indigo-500 mr-2" />
                  Ranger Personnel Profile
                </h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
              <p className="text-gray-600 mb-6">👤 Manage your ranger credentials, certifications, and duty preferences.</p>
              
              {/* Ranger Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600">{rangerStats.reportsHandled}</div>
                  <div className="text-sm text-blue-700">Reports Handled</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600">{rangerStats.patrolsCompleted}</div>
                  <div className="text-sm text-green-700">Patrols Completed</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                  <div className="text-3xl font-bold text-orange-600">{rangerStats.alertsResolved}</div>
                  <div className="text-sm text-orange-700">Alerts Resolved</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600">{rangerStats.areasCovered}</div>
                  <div className="text-sm text-purple-700">Areas Covered</div>
                </div>
              </div>
              
              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ranger ID</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" defaultValue="RNG-2025-047" />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Patrol Zone</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" defaultValue="Zone 7-A (Northern Sector)" />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Certification Level</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" defaultValue="Senior Park Ranger" />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Radio Call Sign</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" defaultValue="Ranger-7-Alpha" />
                </div>
              </div>
            </div>
          </div>
        );
      case "verify":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <PhoneCall className="w-5 h-5 text-teal-500 mr-2" />
                  Call Verification Center
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200 transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept All</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <X className="w-4 h-4" />
                    <span>Decline All</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-6">📞 Review and verify incoming support calls from field personnel and volunteers.</p>
              <IncomingCallList />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-50 w-80 bg-white/95 backdrop-blur-lg border-r border-white/20 shadow-2xl transition-transform duration-300 ease-in-out`}>
        <div className="p-6 space-y-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Ranger Panel
                </h1>
                <p className="text-sm text-gray-600">Field Operations</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Ranger Info Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">Ranger-7-Alpha</div>
                <div className="text-sm text-blue-600">Zone 7-A Patrol</div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <button
              onClick={() => {
                setActive("dashboard");
                setSidebarOpen(false);
              }}
              className={`group flex items-center gap-4 px-4 py-4 rounded-xl w-full text-left transition-all duration-300 ${
                active === "dashboard" 
                  ? "bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 shadow-lg" 
                  : "hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                active === "dashboard" 
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg" 
                  : "bg-gray-100 group-hover:bg-gray-200"
              }`}>
                <Shield className={`w-5 h-5 ${active === "dashboard" ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <div className="flex-1">
                <div className={`font-semibold ${active === "dashboard" ? 'text-gray-800' : 'text-gray-700'}`}>
                  Command Center
                </div>
                <div className="text-sm text-gray-500">Operations overview</div>
              </div>
              {active === "dashboard" && (
                <ChevronRight className="w-5 h-5 text-blue-500" />
              )}
            </button>

            {rangerMenu.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActive(item.key);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center gap-4 px-4 py-4 rounded-xl w-full text-left transition-all duration-300 ${
                    active === item.key 
                      ? "bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 shadow-lg" 
                      : "hover:bg-gray-50 hover:shadow-md"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    active === item.key 
                      ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                      : "bg-gray-100 group-hover:bg-gray-200"
                  }`}>
                    <Icon className={`w-5 h-5 ${active === item.key ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${active === item.key ? 'text-gray-800' : 'text-gray-700'}`}>
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                  {active === item.key && (
                    <ChevronRight className="w-5 h-5 text-blue-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-4 rounded-xl w-full text-left hover:bg-red-50 hover:shadow-md transition-all duration-300 mt-8 border border-red-100"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-red-700">End Shift</div>
              <div className="text-sm text-red-500">Sign out & log off</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Navigation */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 capitalize">
                  {active === "dashboard" ? "Command Center" : rangerMenu.find(item => item.key === active)?.label}
                </h2>
                <p className="text-gray-600 text-sm">
                  {active === "dashboard" ? "Field operations command and control" : rangerMenu.find(item => item.key === active)?.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Radio className="w-5 h-5 text-gray-600" />
              </button>
              <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
