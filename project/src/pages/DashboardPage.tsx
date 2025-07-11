import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  MapPin, 
  Calendar,
  Thermometer,
  Droplets,
  Sun,
  Package,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const DashboardPage: React.FC = () => {
  const { userProfile } = useAuth();
  const [location, setLocation] = useState<string>('Getting location...');
  const [weather, setWeather] = useState({
    temperature: 24,
    humidity: 65,
    condition: 'Partly Cloudy'
  });

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode these coordinates
          setLocation('Pune, Maharashtra');
        },
        (error) => {
          setLocation('Location unavailable');
        }
      );
    }
  }, []);

  const stats = [
    {
      title: 'Active Orders',
      value: '3',
      icon: <Package className="h-8 w-8 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
      trend: '+2 this week'
    },
    {
      title: 'Crop Recommendations',
      value: '8',
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      color: 'bg-green-50 border-green-200',
      trend: 'For current season'
    },
    {
      title: 'Total Savings',
      value: '₹12,450',
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
      trend: '+15% this month'
    },
    {
      title: 'Store Visits',
      value: '24',
      icon: <ShoppingBag className="h-8 w-8 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200',
      trend: '+5 this week'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'order',
      title: 'Fertilizer order placed',
      description: 'NPK Fertilizer - 50kg bag',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'recommendation',
      title: 'New crop recommendation',
      description: 'Tomatoes suitable for your region',
      time: '1 day ago',
      status: 'info'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Weather alert',
      description: 'Heavy rain expected next week',
      time: '2 days ago',
      status: 'warning'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: 'Apply fertilizer to tomato plants',
      date: 'Tomorrow',
      priority: 'high'
    },
    {
      id: 2,
      task: 'Check irrigation system',
      date: 'March 15',
      priority: 'medium'
    },
    {
      id: 3,
      task: 'Harvest carrots',
      date: 'March 18',
      priority: 'high'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userProfile?.name || 'Farmer'}! 👋
            </h1>
            <p className="text-green-100 text-lg">
              Here's what's happening with your farm today
            </p>
            <div className="flex items-center mt-4 space-x-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
          
          {/* Weather Card */}
          <div className="mt-6 md:mt-0 bg-white bg-opacity-20 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <Sun className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{weather.temperature}°C</div>
                <div className="text-sm text-green-100">{weather.condition}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 space-x-4">
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 mr-1" />
                <span className="text-sm">24°C</span>
              </div>
              <div className="flex items-center">
                <Droplets className="h-4 w-4 mr-1" />
                <span className="text-sm">{weather.humidity}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card ${stat.color} border`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.trend}</p>
              </div>
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 card"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-100' :
                  activity.status === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                  {activity.status === 'success' ? (
                    <CheckCircle2 className={`h-5 w-5 ${
                      activity.status === 'success' ? 'text-green-600' :
                      activity.status === 'warning' ? 'text-amber-600' : 'text-blue-600'
                    }`} />
                  ) : (
                    <AlertCircle className={`h-5 w-5 ${
                      activity.status === 'success' ? 'text-green-600' :
                      activity.status === 'warning' ? 'text-amber-600' : 'text-blue-600'
                    }`} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Tasks</h3>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{task.task}</h4>
                    <p className="text-sm text-gray-600 mt-1">{task.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.priority === 'high' 
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-2 text-sm text-green-600 hover:text-green-700 font-medium border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
            View All Tasks
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group">
            <ShoppingBag className="h-8 w-8 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Browse Store</span>
          </button>
          
          <button className="flex flex-col items-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
            <MapPin className="h-8 w-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Crop Guide</span>
          </button>
          
          <button className="flex flex-col items-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group">
            <Package className="h-8 w-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Track Orders</span>
          </button>
          
          <button className="flex flex-col items-center p-6 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors group">
            <Calendar className="h-8 w-8 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-gray-700">Schedule Task</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;