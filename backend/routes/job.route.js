import express from 'express';
import { createJob, getAllJobs, getJobById, getJobsByAdmin } from '../controllers/job.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.post('/create', isAuthenticated, createJob);
router.get('/all', getAllJobs);
router.get('/get', getAllJobs);
router.get('/get/:id', getJobById);
router.get('/:id', getJobById);
router.get('/admin', isAuthenticated, getJobsByAdmin);

export default router;