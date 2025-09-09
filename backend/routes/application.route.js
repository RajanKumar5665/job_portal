import express from "express";
import {  applyJob, getAppliedJobs, getApplicants, updateApplicationStatus} from "../controllers/application.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/apply/:id", isAuthenticated, applyJob);
router.get("/get",isAuthenticated, getAppliedJobs);
router.get("/:id/applicants",isAuthenticated, getApplicants);
router.post("/status/:id/update",isAuthenticated, updateApplicationStatus);

export default router;