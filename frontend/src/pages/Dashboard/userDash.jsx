// src/pages/UserDashboard.jsx
import { useState, useEffect } from "react";
import { 
  Home, 
  ImagePlus, 
  History, 
  Gift, 
  User, 
  LogOut, 
  Save,
  Bell,
  Search,
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
  CheckCircle,
  Phone,
  Bug,
  Menu,
  X
} from "lucide-react";
import ScanPlant from "../../components/Scanplant";
import UserObservationHistory from "../../components/Plantobservation";
import { SaveEnv } from "../../components/SaveEnv";
import EndangeredSpeciesMap from "../../components/Endanger";
import DiseaseDetector from "../../components/detect";
import CallInitiator from "../../components/CallInitiator";
import PlantationVerifyPanel from "../../components/PlantationVerifyPanel";

const menuItems = [
  { 
    label: "Dashboard", 
    icon: Home, 
    key: "home",
    gradient: "from-emerald-500 to-green-600",
    description: "Overview & Stats"
  },
  { 
    label: "Plant Scanner", 
    icon: Camera, 
    key: "scan",
    gradient: "from-blue-500 to-cyan-600",
    description: "AI Plant Identification"
  },
  { 
    label: "History", 
    icon: History, 
    key: "history",
    gradient: "from-purple-500 to-pink-600",
    description: "Past Observations"
  },
  { 
    label: "Green Rewards", 
    icon: Gift, 
    key: "rewards",
    gradient: "from-yellow-500 to-orange-600",
    description: "Points & Achievements"
  },
  { 
    label: "Disease Detection", 
    icon: Bug, 
    key: "detect",
    gradient: "from-red-500 to-pink-600",
    description: "Plant Health Analysis"
  },
  { 
    label: "Profile", 
    icon: User, 
    key: "profile",
    gradient: "from-indigo-500 to-purple-600",
    description: "Account Settings"
  },
  { 
    label: "Expert Support", 
    icon: Phone, 
    key: "call",
    gradient: "from-teal-500 to-emerald-600",
    description: "Video Consultation"
  },
  {
    label: "Plantation Campaign",
    icon: TreePine,
    key: "campaign",
    gradient: "from-emerald-500 to-green-600",
    description: "Live planting verification"
  },
];

export default function UserDashboard() {
  const [active, setActive] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userStats, setUserStats] = useState({
    plantsScanned: 47,
    greenPoints: 1250,
    achievements: 8,
    contributionsThisMonth: 12
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

  const plantsScanned = useCounter(userStats.plantsScanned);
  const greenPoints = useCounter(userStats.greenPoints);
  const achievements = useCounter(userStats.achievements);
  const contributions = useCounter(userStats.contributionsThisMonth);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const DashboardHome = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-12 translate-y-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Environmental Champion! 🌿</h1>
              <p className="text-emerald-100">Continue making a positive impact on our planet</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Leaf className="w-8 h-8" />
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-4">
            <button 
              onClick={() => setActive("scan")}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              <Camera className="w-5 h-5" />
              <span>Scan Plant</span>
            </button>
            <button 
              onClick={() => setActive("detect")}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              <Bug className="w-5 h-5" />
              <span>Check Health</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{plantsScanned}</div>
          <div className="text-gray-600 text-sm">Plants Scanned</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{greenPoints}</div>
          <div className="text-gray-600 text-sm">Green Points</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{achievements}</div>
          <div className="text-gray-600 text-sm">Achievements</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-800 mb-1">{contributions}</div>
          <div className="text-gray-600 text-sm">This Month</div>
        </div>
      </div>

      {/* Maps and Environmental Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 text-emerald-500 mr-2" />
            Endangered Species Map
          </h3>
          <EndangeredSpeciesMap />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Save className="w-5 h-5 text-green-500 mr-2" />
            Environmental Campaigns
          </h3>
          <SaveEnv />
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Award className="w-5 h-5 text-yellow-500 mr-2" />
          Recent Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Plant Explorer", description: "Scanned 50+ plants", icon: Camera, color: "emerald" },
            { title: "Disease Detective", description: "Detected 10 plant diseases", icon: Bug, color: "red" },
            { title: "Green Guardian", description: "Earned 1000+ points", icon: Shield, color: "blue" }
          ].map((achievement, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className={`w-12 h-12 bg-gradient-to-r from-${achievement.color}-500 to-${achievement.color}-600 rounded-xl flex items-center justify-center`}>
                <achievement.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">{achievement.title}</div>
                <div className="text-sm text-gray-600">{achievement.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (active) {
      case "home":
        return <DashboardHome />;
      case "scan":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Camera className="w-5 h-5 text-blue-500 mr-2" />
              AI Plant Scanner
            </h3>
            <ScanPlant />
          </div>
        );
      case "history":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <History className="w-5 h-5 text-purple-500 mr-2" />
              Observation History
            </h3>
            <UserObservationHistory />
          </div>
        );
      case "rewards":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Green Rewards</h2>
                <p className="text-gray-600 mb-6">Your earned tokens and achievements</p>
                <div className="text-5xl font-bold text-yellow-600 mb-2">{greenPoints}</div>
                <div className="text-gray-600">Total Green Points</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Available Rewards</h3>
                <div className="space-y-3">
                  {[
                    { name: "Tree Planting Kit", cost: 500, available: true },
                    { name: "Eco-Friendly Badge", cost: 200, available: true },
                    { name: "Premium Features", cost: 1000, available: true },
                    { name: "Conservation Donation", cost: 2000, available: false }
                  ].map((reward, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-xl ${reward.available ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                      <span className={reward.available ? 'text-gray-800' : 'text-gray-500'}>{reward.name}</span>
                      <span className={`font-semibold ${reward.available ? 'text-green-600' : 'text-gray-400'}`}>{reward.cost} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">Leaderboard</h3>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "You", points: greenPoints, isUser: true },
                    { rank: 2, name: "EcoWarrior23", points: 1180 },
                    { rank: 3, name: "GreenThumb", points: 1050 },
                    { rank: 4, name: "TreeHugger", points: 980 }
                  ].map((user, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-xl ${user.isUser ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${user.rank <= 3 ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                          {user.rank}
                        </span>
                        <span className={user.isUser ? 'font-bold text-emerald-700' : 'text-gray-700'}>{user.name}</span>
                      </div>
                      <span className={`font-semibold ${user.isUser ? 'text-emerald-600' : 'text-gray-600'}`}>{user.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case "detect":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Bug className="w-5 h-5 text-red-500 mr-2" />
              Disease Detection
            </h3>
            <DiseaseDetector />
          </div>
        );
      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <User className="w-5 h-5 text-indigo-500 mr-2" />
                Profile Settings
              </h3>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Environmental Enthusiast</h2>
                <p className="text-gray-600 mb-6">Account settings and personal information</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" defaultValue="Eco Champion" />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" defaultValue="user@greenguard.com" />
                  </div>
                </div>
                
                <button className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        );
      case "call":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Phone className="w-5 h-5 text-teal-500 mr-2" />
              Expert Support & Video Chat
            </h3>
            <CallInitiator />
          </div>
        );
      case "campaign":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <TreePine className="w-5 h-5 text-green-500 mr-2" />
              Tree Plantation Campaign
            </h3>
            <PlantationVerifyPanel />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 relative">
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
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  GreenGuard
                </h1>
                <p className="text-sm text-gray-600">User Dashboard</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* User Info Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">Eco Champion</div>
                <div className="text-sm text-emerald-600">{greenPoints} Green Points</div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
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
                      ? "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 shadow-lg" 
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
                    <ChevronRight className="w-5 h-5 text-emerald-500" />
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
              <div className="text-sm text-red-500">Sign out of account</div>
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
                  {active === "home" ? "Dashboard" : menuItems.find(item => item.key === active)?.label}
                </h2>
                <p className="text-gray-600 text-sm">
                  {active === "home" ? "Welcome to your environmental hub" : menuItems.find(item => item.key === active)?.description}
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
