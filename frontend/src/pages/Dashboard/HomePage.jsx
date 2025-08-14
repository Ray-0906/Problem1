import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Search, 
  Shield, 
  MapPin, 
  Award, 
  Users, 
  TreePine, 
  Heart,
  ArrowRight,
  Star,
  Globe,
  Camera,
  BarChart3,
  CheckCircle,
  Mail,
  Github,
  Twitter,
  Linkedin,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
const HomePage = () => {
  const [statsVisible, setStatsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Animated counter hook
  const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!statsVisible) return;
      
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
    }, [end, duration, statsVisible]);
    
    return count;
  };

  // Intersection observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Camera,
      title: "AI Plant Identification",
      description: "Instantly identify plant species using advanced computer vision and machine learning algorithms.",
      gradient: "from-emerald-500 to-green-600"
    },
    {
      icon: Shield,
      title: "Disease Detection",
      description: "Early detection of plant diseases to prevent spread and ensure ecosystem health.",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: TreePine,
      title: "Afforestation Planning",
      description: "Strategic planning tools for reforestation and afforestation initiatives.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: MapPin,
      title: "Species Mapping",
      description: "Track and map endangered species locations for conservation efforts.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: Users,
      title: "Eco Campaigns",
      description: "Organize and manage environmental campaigns with community engagement tools.",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: Award,
      title: "Green Points Rewards",
      description: "Gamified system to reward environmental contributions and sustainable actions.",
      gradient: "from-yellow-500 to-orange-600"
    }
  ];

  const journeySteps = [
    {
      title: "Hackathon Registration",
      description: "Registered for HackHorizon at ARKA JAIN UNIVERSITY",
      time: "Day 1 - Morning"
    },
    {
      title: "Team Formation",
      description: "Assembled our passionate team of developers and designers",
      time: "Day 1 - Afternoon"
    },
    {
      title: "Ideation & Planning",
      description: "Brainstormed GreenGuard concept and technical architecture",
      time: "Day 1 - Evening"
    },
    {
      title: "Development Sprint",
      description: "24 hours of intensive coding, AI model training, and UI/UX design",
      time: "Day 2 - All Day"
    },
    {
      title: "Final Presentation",
      description: "Pitched GreenGuard to judges and demonstrated our AI-powered platform",
      time: "Day 3 - Morning"
    },
    {
      title: "🏆 Third Place!",
      description: "Achieved 3rd position among 100+ competing teams",
      time: "Day 3 - Results"
    }
  ];

  const teamStats = [
    { label: "Plants Identified", value: useCounter(10000), suffix: "+" },
    { label: "Disease Detections", value: useCounter(2500), suffix: "+" },
    { label: "Green Points Earned", value: useCounter(50000), suffix: "+" },
    { label: "Active Users", value: useCounter(1200), suffix: "+" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-300 rounded-full opacity-10 animate-ping"></div>
        </div>

        {/* Achievement Badge */}
        <div className="absolute top-8 right-8 z-10">
          <div className="bg-white/80 backdrop-blur-md border border-emerald-200 rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center space-x-2 text-emerald-700">
              <Award className="w-5 h-5" />
              <span className="font-semibold text-sm">🏆 3rd Place @ HackHorizon AJU</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              GreenGuard
            </h1>
            <div className="text-2xl md:text-4xl text-gray-700 mb-8 font-light">
              <span className="inline-block animate-bounce delay-100">AI</span>
              <span className="mx-4">for</span>
              <span className="inline-block animate-bounce delay-300">Environmental</span>
              <span className="mx-4">Impact</span>
            </div>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Harness the power of artificial intelligence to protect our planet. Identify plants, detect diseases, 
              plan afforestation, and join the global movement for environmental conservation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                <span className="relative z-10 flex items-center">
                 <Link to="/login"> Explore Platform</Link>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="px-8 py-4 bg-white/80 backdrop-blur-md border-2 border-emerald-300 text-emerald-700 rounded-full font-semibold text-lg hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300">
                See Our Journey
              </button>
            </div>
          </div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <Leaf className="absolute top-1/4 left-1/4 w-8 h-8 text-emerald-400 opacity-60 animate-float" />
          <TreePine className="absolute top-3/4 right-1/4 w-6 h-6 text-green-400 opacity-60 animate-float delay-1000" />
          <Globe className="absolute bottom-1/4 left-1/3 w-7 h-7 text-teal-400 opacity-60 animate-float delay-2000" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Powerful Features for 
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"> Environmental Impact</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with environmental science 
              to create meaningful change for our planet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`}></div>
                <div className="absolute inset-[1px] bg-white rounded-2xl"></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  
                  <div className="mt-6 flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700 transition-colors">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Hackathon 
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"> Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From concept to award-winning platform in just 24 hours. Here's how we built GreenGuard 
              and achieved 3rd place at HackHorizon, competing among 100+ teams.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-emerald-400 to-green-600"></div>

            {journeySteps.map((step, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                
                {/* Content Card */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="text-sm text-emerald-600 font-semibold mb-2">{step.time}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & Stats Section */}
      <section id="stats-section" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Environmental 
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent"> Impact</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the real-world impact our platform is making in environmental conservation and community engagement.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {teamStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-gray-600 font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Map Mockup */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Global Species Tracking</h3>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
            <div className="bg-white rounded-xl h-64 flex items-center justify-center shadow-inner">
              <div className="text-center">
                <Globe className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive species mapping visualization</p>
                <p className="text-sm text-gray-500 mt-2">Real-time endangered species tracking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-green-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join the Eco Movement
          </h2>
          <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
            Be part of the solution. Connect with like-minded individuals, contribute to environmental campaigns, 
            and make a real difference for our planet's future.
          </p>

          {/* Subscription Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 rounded-xl bg-white/90 backdrop-blur-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-gray-800 placeholder-gray-500"
                />
              </div>
              <button className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors duration-300 flex items-center justify-center">
                <Mail className="w-5 h-5 mr-2" />
                Join Now
              </button>
            </div>
            <p className="text-emerald-100 text-sm mt-4">
              Get updates on new features, environmental campaigns, and impact reports.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand Section */}
            <div>
              <div className="flex items-center mb-6">
                <Leaf className="w-8 h-8 text-emerald-400 mr-3" />
                <span className="text-2xl font-bold">GreenGuard</span>
              </div>
              <p className="text-gray-400 mb-6">
                AI-powered environmental conservation platform built by passionate developers 
                for a sustainable future.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Acknowledgments */}
            <div>
              <h3 className="text-xl font-bold mb-6">Acknowledgments</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-emerald-400 mr-3" />
                  <span className="text-gray-300">HackHorizon Hackathon</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-emerald-400 mr-3" />
                  <span className="text-gray-300">GDG On Campus AJU</span>
                </div>
                <div className="flex items-center">
                  <ExternalLink className="w-5 h-5 text-emerald-400 mr-3" />
                  <span className="text-gray-300">ARKA JAIN UNIVERSITY</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6">Platform</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-400 hover:text-emerald-400 transition-colors">Plant Identification</a>
                <a href="#" className="block text-gray-400 hover:text-emerald-400 transition-colors">Disease Detection</a>
                <a href="#" className="block text-gray-400 hover:text-emerald-400 transition-colors">Eco Campaigns</a>
                <a href="#" className="block text-gray-400 hover:text-emerald-400 transition-colors">Green Points</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 GreenGuard. Built with ❤️ for the planet at HackHorizon 2025.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;