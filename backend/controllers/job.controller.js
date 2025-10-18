import { Job } from "../models/job.model.js";


//admin post job
export const createJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            })
        }

        // Validate salary is a positive number
        const salaryNum = Number(salary);
        if (isNaN(salaryNum) || salaryNum <= 0) {
            return res.status(400).json({
                message: "Please provide a valid salary amount",
                success: false
            })
        }

        // Validate position is a positive number
        const positionNum = Number(position);
        if (isNaN(positionNum) || positionNum <= 0) {
            return res.status(400).json({
                message: "Please provide a valid number of positions",
                success: false
            })
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: salaryNum,
            location,
            jobType,
            experienceLevel: experience,
            position: positionNum,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

//user get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        // Get total count for pagination
        const totalJobs = await Job.countDocuments(query);
        const totalPages = Math.ceil(totalJobs / limit);

        const jobs = await Job.find(query)
            .populate({
                path: "company"
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        }

        return res.status(200).json({
            jobs,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalJobs: totalJobs,
                jobsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

//users get job by id
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
            const job = await Job.findById(jobId).populate({
            path:"applications",
            populate: { path: 'applicant' }
        });

        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"Job fetched successfully",
            success:true,
            job
        });
    } catch (error) {
        console.error('Error in getJobById:', error);   
        res.status(500).json({ message: 'Server error', success: false });
    }
};

//created a job by admin

export const getJobsByAdmin = async (req, res) => {
    try {
        const adminId = req.id;
        // created_by is the field in Job schema
        const jobs = await Job.find({ created_by: adminId }).populate('company');
        if(!jobs){
            return res.status(404).json({
                message:"No jobs found",
                success:false
            });
        }
        return res.status(200).json({
            message:"Jobs fetched successfully",
            success:true,
            jobs
        });
    } catch (error) {
        console.error('Error in getJobsByAdmin:', error);   
        res.status(500).json({ message: 'Server error', success: false });
    }   
};


        
