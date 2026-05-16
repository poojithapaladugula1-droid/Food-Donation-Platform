import express from 'express';
import {
  createRequest,
  getMyRequests,
  getDonorRequests,
  updateRequestStatus
} from '../controllers/requestController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/:foodId', auth, createRequest);
router.get('/my-requests', auth, getMyRequests);
router.get('/donor-requests', auth, getDonorRequests);
router.put('/:requestId', auth, updateRequestStatus);

export default router;