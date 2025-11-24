import { useState, useEffect } from 'react';
import { Sun, Zap, TrendingUp, Battery, DollarSign, LogOut, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null; mobile_number: string | null } | null>(null);

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('full_name, mobile_number')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
    }
  }, [user]);

  const stats = [
    {
      icon: <Zap className="text-yellow-400" size={32} />,
      label: 'Energy Generated',
      value: '1,234 kWh',
      change: '+12%',
      trend: 'up',
    },
    {
      icon: <Battery className="text-green-400" size={32} />,
      label: 'Battery Status',
      value: '87%',
      change: 'Optimal',
      trend: 'neutral',
    },
    {
      icon: <DollarSign className="text-blue-400" size={32} />,
      label: 'Cost Savings',
      value: '$342',
      change: '+8%',
      trend: 'up',
    },
    {
      icon: <TrendingUp className="text-orange-400" size={32} />,
      label: 'Efficiency',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400/20 p-2 rounded-lg">
                <Sun className="text-yellow-400" size={28} />
              </div>
              <span className="text-white text-xl font-bold">Solar AI Power</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-white font-medium">{profile?.full_name || 'User'}</p>
                <p className="text-blue-200 text-sm">{user?.email}</p>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {profile?.full_name || 'User'}!</h1>
          <p className="text-blue-200">Here's your solar energy overview for today</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-white/10 p-3 rounded-lg">{stat.icon}</div>
                {stat.trend === 'up' && (
                  <span className="text-green-400 text-sm font-semibold bg-green-400/20 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                )}
                {stat.trend === 'neutral' && (
                  <span className="text-blue-400 text-sm font-semibold bg-blue-400/20 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                )}
              </div>
              <h3 className="text-white/70 text-sm mb-1">{stat.label}</h3>
              <p className="text-white text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-white">Energy Production</h2>
            </div>
            <div className="space-y-4">
              {[
                { day: 'Monday', value: 85 },
                { day: 'Tuesday', value: 92 },
                { day: 'Wednesday', value: 78 },
                { day: 'Thursday', value: 88 },
                { day: 'Friday', value: 95 },
                { day: 'Saturday', value: 90 },
                { day: 'Sunday', value: 87 },
              ].map((item) => (
                <div key={item.day}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">{item.day}</span>
                    <span className="text-white font-semibold">{item.value}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-green-400" size={24} />
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {[
                { time: '2 hours ago', event: 'Peak production reached', status: 'success' },
                { time: '5 hours ago', event: 'Battery fully charged', status: 'info' },
                { time: '1 day ago', event: 'System maintenance completed', status: 'success' },
                { time: '2 days ago', event: 'New record: 1,234 kWh', status: 'success' },
                { time: '3 days ago', event: 'Energy exported to grid', status: 'info' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-400' : 'bg-blue-400'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.event}</p>
                    <p className="text-white/50 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-8 border border-yellow-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Maximize Your Solar Potential</h2>
              <p className="text-blue-200">
                Get AI-powered recommendations to optimize your energy production and savings
              </p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
              Get Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
