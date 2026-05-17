import { Router } from 'express'
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats,
  exportLeads,
} from '../controllers/leadsController'
import { protect, authorize } from '../middleware/auth'
import { createLeadValidator, updateLeadValidator, validate } from '../middleware/validators'

const router = Router()

// All routes are protected
router.use(protect)

router.get('/stats', getLeadStats)
router.get('/export', exportLeads)
router.get('/', getLeads)
router.get('/:id', getLead)
router.post('/', createLeadValidator, validate, createLead)
router.put('/:id', updateLeadValidator, validate, updateLead)
router.delete('/:id', authorize('admin'), deleteLead) // Only admin can delete

export default router
