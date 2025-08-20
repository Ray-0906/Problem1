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
import RewardPage from "../../components/userDash/RewardPage";
import { Profile as ProfileForm } from "../../components/Profile";

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
    label: "Plantation Campaign",
    icon: TreePine,
    key: "campaign",
    gradient: "from-emerald-500 to-green-600",
    description: "Live planting verification"
  },
  { 
    label: "Profile", 
    icon: User, 
    key: "profile",
    gradient: "from-indigo-500 to-purple-600",
    description: "Account Settings"
  },

];

export default function UserDashboard() {
  const [active, setActive] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [userStats, setUserStats] = useState({
    plantsScanned: localStorage.getItem("plants") || 0,
    greenPoints:  localStorage.getItem("exp"),
    achievements: localStorage.getItem("achievements") || 0,
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

  // Lock body scroll when sidebar is open on small screens
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [sidebarOpen]);

  // Load profile once and update stats
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await (await import('../../utils/axios')).default.get('/api/auth/profile');
        if (!ignore) {
          setProfile(res.data);
          setUserStats((prev) => ({
            ...prev,
            greenPoints: res.data?.exp ?? prev.greenPoints,
            plantsScanned: res.data?.plants ?? prev.plantsScanned,
            achievements: res.data?.achievements ?? prev.achievements,
          }));
        }
      } catch (e) {
        console.error('Profile load failed', e);
      }
    })();
    return () => { ignore = true; };
  }, []);

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
          <RewardPage/>
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <User className="w-5 h-5 text-indigo-500 mr-2" />
                  Profile Settings
                </h3>
              </div>
              <p className="text-gray-600 mb-6">Manage your account details. Changes will update your display name, email, and location.</p>
              <ProfileForm />
            </div>
          </div>
        );
      // case "call":
      //   return (
      //     <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      //       <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
      //         <Phone className="w-5 h-5 text-teal-500 mr-2" />
      //         Expert Support & Video Chat
      //       </h3>
      //       <CallInitiator />
      //     </div>
      //   );
      case "campaign":
        return (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <TreePine className="w-5 h-5 text-green-500 mr-2" />
              Tree Plantation Campaign
            </h3>
            <div className="mb-5 space-y-3">
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-green-600 text-white text-xs font-bold">50</span>
                <span className="text-sm">Earn <strong>+50 Green Points</strong> for each plantation that gets approved.</span>
              </div>
              <p className="text-sm text-gray-600">How it works:</p>
              <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                <li>Plant a sapling and capture clear photos.</li>
                <li>Start a live verification using your camera in the panel below.</li>
                <li>An ecologist reviews your submission and approves it.</li>
                <li>On approval, <strong>+50 Green Points</strong> are added to your rewards automatically.</li>
              </ul>
              <p className="text-xs text-gray-500">Tip: good lighting and stable framing make approval faster.</p>
            </div>
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
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 w-80 h-screen lg:h-auto bg-white/95 backdrop-blur-lg border-r border-white/20 shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto overscroll-contain touch-pan-y`}>
        <div className="p-6 space-y-6">
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
                <div className="font-semibold text-gray-800">{profile?.name || 'Loading…'}</div>
                <div className="text-xs text-gray-500">{profile?.email || ''}</div>
                <div className="text-sm text-emerald-600">{typeof profile?.exp === 'number' ? profile.exp : greenPoints} Green Points</div>
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
              <button
                onClick={() => setActive('profile')}
                title="Profile settings"
                className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
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
