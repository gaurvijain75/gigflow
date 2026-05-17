import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Users, UserPlus, Phone, CheckCircle, XCircle, Eye } from 'lucide-react'
import { leadsService } from '../services/leadsService'
import { StatsData } from '../types'
import Spinner from '../components/ui/Spinner'
import { useAuth } from '../context/AuthContext'

const STATUS_COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444']
const SOURCE_COLORS = ['#8B5CF6', '#EC4899', '#14B8A6']

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await leadsService.getStats()
        setStats(data)
      } catch {
        console.error('Failed to fetch stats')
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  )

  const statusData = stats?.statusStats.map((s) => ({ name: s._id, value: s.count })) || []
  const sourceData = stats?.sourceStats.map((s) => ({ name: s._id, value: s.count })) || []

  const getStatusCount = (status: string) =>
    stats?.statusStats.find((s) => s._id === status)?.count || 0

  const statCards = [
    { label: 'Total Leads', value: stats?.total || 0, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'New Leads', value: getStatusCount('New'), icon: UserPlus, color: 'bg-purple-50 text-purple-600' },
    { label: 'Contacted', value: getStatusCount('Contacted'), icon: Phone, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Qualified', value: getStatusCount('Qualified'), icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    { label: 'Lost', value: getStatusCount('Lost'), icon: XCircle, color: 'bg-red-50 text-red-600' },
  ]

  const quickActions = [
    { label: 'View All Leads', icon: Eye, color: 'bg-blue-50 text-blue-600', action: () => navigate('/leads') },
     { label: 'Add New Lead', icon: UserPlus, color: 'bg-green-50 text-green-600', action: () => navigate('/leads?action=add') },
   
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Track your lead management performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Leads by Status</h3>
          {statusData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Leads by Source</h3>
          {sourceData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sourceData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {sourceData.map((_, index) => (
                    <Cell key={index} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard