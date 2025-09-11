import { Job } from "../models/job.model.js";


//admin post job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
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
    }
}

//user get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
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


        
