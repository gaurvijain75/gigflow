import { Response } from 'express'
import { FilterQuery } from 'mongoose'
import Lead from '../models/Lead'
import type { AuthRequest, ILead, LeadQuery } from '../types/index_type'

// @desc    Get all leads with filters, search, sort, pagination
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = 1,
      limit = 10,
    } = req.query as unknown as LeadQuery

    const query: FilterQuery<ILead> = {}

    // RBAC: sales users only see their own leads
    if (req.user?.role === 'sales') {
      query.createdBy = req.user.id
    }

    // Filter by status
    if (status) query.status = status

    // Filter by source
    if (source) query.source = source

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    const sortOrder = sort === 'oldest' ? 1 : -1
    const pageNum = Number(page)
    const limitNum = Number(limit)
    const skip = (pageNum - 1) * limitNum

    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(query),
    ])

    res.status(200).json({
      success: true,
      message: 'Leads fetched successfully',
      data: {
        leads,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1,
        },
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching leads' })
  }
}

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email')

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' })
      return
    }

    // Sales users can only view their own leads
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Not authorized to view this lead' })
      return
    }

    res.status(200).json({ success: true, message: 'Lead fetched', data: { lead } })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching lead' })
  }
}

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.create({ ...req.body, createdBy: req.user?.id })
    res.status(201).json({ success: true, message: 'Lead created successfully', data: { lead } })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error creating lead' })
  }
}

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' })
      return
    }

    // Sales users can only update their own leads
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) {
      res.status(403).json({ success: false, message: 'Not authorized to update this lead' })
      return
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ success: true, message: 'Lead updated successfully', data: { lead: updated } })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating lead' })
  }
}

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private - Admin only
export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)

    if (!lead) {
      res.status(404).json({ success: false, message: 'Lead not found' })
      return
    }

    await lead.deleteOne()
    res.status(200).json({ success: true, message: 'Lead deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting lead' })
  }
}

// @desc    Get lead stats for dashboard charts
// @route   GET /api/leads/stats
// @access  Private
export const getLeadStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { Types } = await import('mongoose')
    const matchStage = req.user?.role === 'sales' 
      ? { createdBy: new Types.ObjectId(req.user.id) } 
      : {}

    const [statusStats, sourceStats, total] = await Promise.all([
      Lead.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: matchStage },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(matchStage),
    ])

    res.status(200).json({
      success: true,
      message: 'Stats fetched successfully',
      data: { total, statusStats, sourceStats },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching stats' })
  }
}

// @desc    Export leads as CSV data
// @route   GET /api/leads/export
// @access  Private
export const exportLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query: FilterQuery<ILead> = {}
    if (req.user?.role === 'sales') query.createdBy = req.user.id

    const leads = await Lead.find(query).populate('createdBy', 'name')

    const csvRows = [
      ['Name', 'Email', 'Status', 'Source', 'Created By', 'Created At'],
      ...leads.map((lead) => [
        lead.name,
        lead.email,
        lead.status,
        lead.source,
        (lead.createdBy as any)?.name || 'N/A',
        new Date(lead.createdAt).toLocaleDateString(),
      ]),
    ]

    const csvContent = csvRows.map((row) => row.join(',')).join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=gigflow-leads.csv')
    res.status(200).send(csvContent)
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error exporting leads' })
  }
}
