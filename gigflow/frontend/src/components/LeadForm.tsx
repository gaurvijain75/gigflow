import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Lead } from '../types'
import { leadsService } from '../services/leadsService'
import type { LeadStatus, LeadSource } from '../types'
import { useTheme } from '../context/ThemeContext'

interface LeadFormProps {
  lead?: Lead | null
  onClose: () => void
  onSuccess: () => void
}

interface FormData {
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
}

const LeadForm = ({ lead, onClose, onSuccess }: LeadFormProps) => {
  const { isDark } = useTheme()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>()

  useEffect(() => {
    if (lead) {
      reset({ name: lead.name, email: lead.email, status: lead.status, source: lead.source })
    }
  }, [lead, reset])

  const onSubmit = async (data: FormData) => {
    try {
      if (lead) {
        await leadsService.updateLead(lead._id, data)
      } else {
        await leadsService.createLead(data)
      }
      onSuccess()
      onClose()
    } catch (error: unknown) {
      console.error('Failed to save lead:', error)
    }
  }

  const inputClass = `w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`
  const labelClass = `block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`rounded-xl p-6 w-full max-w-md shadow-xl ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-5">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
              className={inputClass}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
              className={inputClass}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <select
              {...register('status', { required: 'Status is required' })}
              className={inputClass}
            >
              <option value="">Select status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Source</label>
            <select
              {...register('source', { required: 'Source is required' })}
              className={inputClass}
            >
              <option value="">Select source</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
            {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 border rounded-lg text-sm ${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : lead ? 'Update Lead' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeadForm