import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import useLeads from '../hooks/useLeads'
import Badge from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import LeadForm from '../components/LeadForm'
import { Lead } from '../types'
import { leadsService } from '../services/leadsService'
import { Search, Download, Plus, Pencil, Trash2, Filter } from 'lucide-react'

const Leads = () => {
  const { user } = useAuth()
  const { isDark } = useTheme()
  const location = useLocation()
  const { leads, pagination, isLoading, error, filters, searchInput, setSearchInput, updateFilter, setPage, fetchLeads, deleteLead } = useLeads()
  const [showForm, setShowForm] = useState(false)
  const [editLead, setEditLead] = useState<Lead | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [viewLead, setViewLead] = useState<Lead | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('action') === 'add') {
      setShowForm(true)
    }
  }, [location])

  const handleEdit = (lead: Lead) => {
    setEditLead(lead)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    await deleteLead(id)
    setDeleteConfirm(null)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      await leadsService.exportCSV()
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className={`p-8 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Leads Management</h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Manage and track all your leads ({pagination?.total || 0} total)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 bg-green-600 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={() => { setEditLead(null); setShowForm(true) }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-2xl border p-5 mb-5 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex-1 min-w-64 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or email..."
              className={`w-full pl-9 pr-4 border rounded-xl py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900'}`}
            />
          </div>
          <select
            value={filters.status || ''}
            onChange={(e) => updateFilter('status', e.target.value)}
            className={`border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-36 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <select
            value={filters.source || ''}
            onChange={(e) => updateFilter('source', e.target.value)}
            className={`border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-36 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sort by:</span>
          <button
            onClick={() => updateFilter('sort', 'latest')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.sort === 'latest' || !filters.sort ? 'bg-blue-600 text-white' : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Latest
          </button>
          <button
            onClick={() => updateFilter('sort', 'oldest')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filters.sort === 'oldest' ? 'bg-blue-600 text-white' : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Oldest
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        {isLoading ? (
          <div className="flex justify-center items-center h-48"><Spinner /></div>
        ) : error ? (
          <div className="flex justify-center items-center h-48 text-red-500 text-sm">{error}</div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-sm">No leads found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className={`border-b ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                <tr>
                  <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Lead</th>
                  <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                  <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Source</th>
                  <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Created</th>
                  <th className={`text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-50'}`}>
                {leads.map((lead) => (
                  <tr key={lead._id} className={`transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="cursor-pointer" onClick={() => setViewLead(lead)}>
                        <p className={`font-semibold hover:text-blue-500 ${isDark ? 'text-white' : 'text-gray-900'}`}>{lead.name}</p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lead.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4"><Badge value={lead.status} type="status" /></td>
                    <td className={`px-6 py-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{lead.source}</td>
                    <td className={`px-6 py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button onClick={() => handleEdit(lead)} className="text-blue-400 hover:text-blue-600 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        {user?.role === 'admin' && (
                          <button onClick={() => setDeleteConfirm(lead._id)} className="text-red-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className={`flex items-center justify-between px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Showing {leads.length} of {pagination.total} leads</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(pagination.page - 1)} disabled={!pagination.hasPrevPage} className={`px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>← Prev</button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${p === pagination.page ? 'bg-blue-600 text-white' : isDark ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(pagination.page + 1)} disabled={!pagination.hasNextPage} className={`px-3 py-1.5 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* View Lead Modal */}
      {viewLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
<div className={`rounded-2xl p-6 w-full max-w-md shadow-xl ${isDark ? 'bg-gray-700 border border-gray-600' : 'bg-white'}`}>            <div className="flex justify-between items-center mb-5">
              <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Lead Details</h2>
              <button onClick={() => setViewLead(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Name', value: viewLead.name },
                { label: 'Email', value: viewLead.email },
                { label: 'Created By', value: viewLead.createdBy?.name },
                { label: 'Created At', value: new Date(viewLead.createdAt).toLocaleDateString() },
              ].map((item) => (
                <div key={item.label} className={`flex justify-between border-b pb-2 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{item.value}</span>
                </div>
              ))}
              <div className={`flex justify-between border-b pb-2 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Status</span>
                <Badge value={viewLead.status} type="status" />
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Source</span>
                <Badge value={viewLead.source} type="source" />
              </div>
            </div>
            <button onClick={() => setViewLead(null)} className={`w-full mt-5 px-4 py-2 rounded-xl text-sm ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Close</button>
          </div>
        </div>
      )}

      {showForm && (
        <LeadForm
          lead={editLead}
          onClose={() => { setShowForm(false); setEditLead(null) }}
          onSuccess={fetchLeads}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-2xl p-6 w-full max-w-sm shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Delete Lead</h3>
            <p className={`text-sm mb-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Are you sure? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className={`flex-1 px-4 py-2 border rounded-xl text-sm ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leads