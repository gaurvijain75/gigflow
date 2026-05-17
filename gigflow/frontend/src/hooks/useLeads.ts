import { useState, useEffect, useCallback } from 'react'
import { Lead, LeadFilters, PaginationMeta } from '../types'
import { leadsService } from '../services/leadsService'

const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1 })
  const [searchInput, setSearchInput] = useState('')

  // Debounce search — waits 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }))
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  const fetchLeads = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await leadsService.getLeads(filters)
      setLeads(res.leads)
      setPagination(res.pagination)
    } catch {
      setError('Failed to fetch leads. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const updateFilter = (key: keyof LeadFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const deleteLead = async (id: string) => {
    await leadsService.deleteLead(id)
    fetchLeads()
  }

  return {
    leads, pagination, isLoading, error,
    filters, searchInput, setSearchInput,
    updateFilter, setPage, fetchLeads, deleteLead,
  }
}

export default useLeads