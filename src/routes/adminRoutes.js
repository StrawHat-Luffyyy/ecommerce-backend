import express from 'express';
import {getAnalytics} from '../controllers/adminController.js'
import {protect , authorize} from '../middlewares/authMiddleware.js'


const router = express.Router()
// Every route in this file requires a valid token AND the ADMIN role
router.use(protect , authorize('ADMIN'))

router.get('/analytics' , getAnalytics)

export default router