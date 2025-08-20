// src/pages/EcologistDashboard.jsx
import { useState, useEffect } from "react";
import { 
  FileSearch, 
  CheckCircle, 
  Database, 
  BookOpen, 
  User, 
  LogOut,
  Bell,
  Settings,
  Award,
  Leaf,
  Camera,
  Shield,
  MapPin,
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
  Briefcase,
  Microscope,
  FlaskConical,
  Bug,
  Menu,
  X,
  CheckSquare,
  XSquare,
  Clock3
} from "lucide-react";
import ReviewPanel from "../../components/ReviewReports";
import { Submissions } from "../../components/Submissions";
import { UpdateDatabase } from "../../components/UpdateDb";
import { ResearchLog } from "../../components/ResearchLog";
import { Profile } from "../../components/Profile";
import EndangeredSpeciesMap from "../../components/Endanger";
import DiseaseDetector from "../../components/detect";

const ecoMenu = [
  { 
    label: "Review Reports", 
    icon: FileSearch, 
    key: "review",
    gradient: "from-blue-500 to-cyan-600",
    description: "Validate user submissions"
  },
  // { 
  //   label: "Research Submissions", 
  //   icon: CheckCircle, 
  //   key: "submissions",
  //   gradient: "from-green-500 to-emerald-600",
  //   description: "Approve new discoveries"
  // },
  { 
    label: "Species Database", 
    icon: Database, 
    key: "database",
    gradient: "from-purple-500 to-pink-600",
    description: "Manage endangered species"
  },
  { 
    label: "Disease Analysis", 
    icon: Bug, 
    key: "log",
    gradient: "from-red-500 to-orange-600",
    description: "Plant health research"
  },
  { 
    label: "Research Profile", 
    icon: Briefcase, 
    key: "profile",
    gradient: "from-indigo-500 to-purple-600",
    description: "Professional settings"
  },
];

export default function EcologistDashboard() {
  const [active, setActive] = useState("review");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [researchStats, setResearchStats] = useState({
    reportsReviewed: 0,
    speciesValidated: 0,
    researchPoints: localStorage.getItem("exp") || 0,
    publicationsThisYear: 0
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

  const reportsReviewed = useCounter(researchStats.reportsReviewed);
  const speciesValidated = useCounter(researchStats.speciesValidated);
  const researchPoints = useCounter(researchStats.researchPoints);
  const publications = useCounter(researchStats.publicationsThisYear);

  // Lock body scroll when sidebar is open on small screens
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [sidebarOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const DashboardHome = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-12 translate-y-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Dr. Ecologist! 🧬</h1>
              <p className="text-indigo-100">Continue your vital environmental research and conservation work</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Microscope className="w-8 h-8" />
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-4">
            <button 
              onClick={() => setActive("review")}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              <FileSearch className="w-5 h-5" />
              <span>Review Reports</span>
            </button>
            <button 
              onClick={() => setActive("submissions")}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Validate Submissions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Research Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{reportsReviewed}</div>
          <div className="text-gray-600 text-sm">Reports Reviewed</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{speciesValidated}</div>
          <div className="text-gray-600 text-sm">Species Validated</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{researchPoints}</div>
          <div className="text-gray-600 text-sm">Research Points</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{publications}</div>
          <div className="text-gray-600 text-sm">Publications (2025)</div>
        </div>
      </div>

      {/* Pending Reviews & Research Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Clock3 className="w-5 h-5 text-orange-500 mr-2" />
            Pending Reviews
          </h3>
          <div className="space-y-4">
            {[
              { id: "PR-001", type: "Plant Disease", user: "User_47", priority: "High", time: "2 hours ago" },
              { id: "PR-002", type: "New Species", user: "Researcher_23", priority: "Medium", time: "5 hours ago" },
              { id: "PR-003", type: "Habitat Change", user: "Volunteer_89", priority: "Low", time: "1 day ago" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{item.id} - {item.type}</div>
                  <div className="text-sm text-gray-600">Submitted by {item.user} • {item.time}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.priority === 'High' ? 'bg-red-100 text-red-700' :
                    item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.priority}
                  </span>
                  <button 
                    onClick={() => setActive("review")}
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
            <BarChart3 className="w-5 h-5 text-purple-500 mr-2" />
            Research Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">This Week</span>
              <span className="text-2xl font-bold text-gray-800">12 Reviews</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <span className="text-gray-600">This Month</span>
              <span className="text-2xl font-bold text-gray-800">47 Validations</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-indigo-500 mr-2" />
                <span className="text-indigo-700 font-semibold">Top Researcher This Month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Research Contributions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FlaskConical className="w-5 h-5 text-teal-500 mr-2" />
          Recent Research Contributions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Rare Orchid Discovery", description: "Validated new Orchidaceae species in Amazon", icon: Leaf, color: "emerald" },
            { title: "Disease Pattern Analysis", description: "Identified fungal infection spread patterns", icon: Bug, color: "red" },
            { title: "Conservation Strategy", description: "Developed protection plan for endangered habitat", icon: Shield, color: "blue" }
          ].map((contribution, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className={`w-12 h-12 bg-gradient-to-r from-${contribution.color}-500 to-${contribution.color}-600 rounded-xl flex items-center justify-center flex-shrink-0`}>
                <contribution.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">{contribution.title}</div>
                <div className="text-sm text-gray-600 mt-1">{contribution.description}</div>
                <div className="text-xs text-gray-500 mt-2">Published • 3 days ago</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (active) {
      case "review":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <FileSearch className="w-5 h-5 text-blue-500 mr-2" />
                  Review User Reports
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-6">🧾 Validate and review new user reports of unidentified plants and diseases.</p>
              <ReviewPanel />
            </div>
          </div>
        );
      case "submissions":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Research Submissions
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                    <CheckSquare className="w-4 h-4" />
                    <span>Bulk Approve</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <XSquare className="w-4 h-4" />
                    <span>Bulk Reject</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-6">✅ Approve or reject new species discoveries and disease submissions from researchers.</p>
              <Submissions />
            </div>
          </div>
        );
      case "database":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Database className="w-5 h-5 text-purple-500 mr-2" />
                  Species Database Management
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Import Data</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <Search className="w-4 h-4" />
                    <span>Search Database</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-6">📊 Manage endangered species database and conservation tracking.</p>
              <EndangeredSpeciesMap />
            </div>
          </div>
        );
      case "log":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Bug className="w-5 h-5 text-red-500 mr-2" />
                  Disease Analysis & Research
                </h3>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <Activity className="w-4 h-4" />
                    <span>Analysis Tools</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors">
                    <BookOpen className="w-4 h-4" />
                    <span>Research Log</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-6">📖 Advanced plant disease detection and research contributions tracking.</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Disease Detection Tool</h4>
                  <DiseaseDetector />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Research Contributions</h4>
                  <ResearchLog />
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
                  <Briefcase className="w-5 h-5 text-indigo-500 mr-2" />
                  Professional Research Profile
                </h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
              <p className="text-gray-600 mb-6">👤 Manage your professional profile, credentials, and research preferences.</p>
              
              {/* Professional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                  <div className="text-3xl font-bold text-indigo-600">{researchStats.reportsReviewed}</div>
                  <div className="text-sm text-indigo-700">Reports Reviewed</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-600">{researchStats.speciesValidated}</div>
                  <div className="text-sm text-green-700">Species Validated</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-600">{researchStats.publicationsThisYear}</div>
                  <div className="text-sm text-yellow-700">Publications (2025)</div>
                </div>
              </div>
              
              <Profile />
            </div>
          </div>
        );
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 w-80 h-screen lg:h-auto bg-white/95 backdrop-blur-lg border-r border-white/20 shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto overscroll-contain touch-pan-y`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  EcoPanel
                </h1>
                <p className="text-sm text-gray-600">Research Dashboard</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Researcher Info Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">Dr. Environmental Scientist</div>
                <div className="text-sm text-indigo-600">{researchPoints} Research Points</div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <button
              onClick={() => {
                setActive("review");
                setSidebarOpen(false);
              }}
              className={`group flex items-center gap-4 px-4 py-4 rounded-xl w-full text-left transition-all duration-300 ${
                active === "review" 
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-lg" 
                  : "hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                active === "review" 
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg" 
                  : "bg-gray-100 group-hover:bg-gray-200"
              }`}>
                <Database className={`w-5 h-5 ${active === "review" ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <div className="flex-1">
                <div className={`font-semibold ${active === "review" ? 'text-gray-800' : 'text-gray-700'}`}>
                  Dashboard
                </div>
                <div className="text-sm text-gray-500">Overview & Analytics</div>
              </div>
              {active === "review" && (
                <ChevronRight className="w-5 h-5 text-indigo-500" />
              )}
            </button>

            {ecoMenu.map((item) => {
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
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-lg" 
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
                    <ChevronRight className="w-5 h-5 text-indigo-500" />
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
              <div className="font-semibold text-red-700">Logout</div>
              <div className="text-sm text-red-500">End research session</div>
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
                  {active === "review" ? "Research Dashboard" : ecoMenu.find(item => item.key === active)?.label}
                </h2>
                <p className="text-gray-600 text-sm">
                  {active === "review" ? "Professional environmental research center" : ecoMenu.find(item => item.key === active)?.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
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
