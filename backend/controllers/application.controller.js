import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";


export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            });
        }
        //check if user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if(existingApplication){
            return res.status(400).json({
                message:"You have already applied for this job",
                success:false
            });
        }

        //check if job exists
        const jobs = await Job.findById(jobId);
        if(!jobs){
            return res.status(404).json({
                message:"Job not found",
                success:false
        })
    }
    //create a new application
    const newApplication = await Application.create({
        job: jobId,
        applicant: userId
    });

    jobs.applications.push(newApplication._id);
    await jobs.save();
    return res.status(201).json({
        message: "Application submitted successfully.",
        success: true,
        jobs
    });
}
catch (error) {
    console.log(error);
    return res.status(500).json({
        message: "Internal server error",
        success: false
    });
}
}


//applied jobs
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: "job",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } }
            }
        });

        if (!applications) {
            return res.status(404).json({
                message: "No applications found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Applied jobs retrieved successfully.",
            success: true,
            data: applications
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

//admin find how many users applied for the job

export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const jobs = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!jobs){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            jobs, 
            succees:true
        });
    } catch (error) {
        console.log(error);  
    }
}

//status

export const updateApplicationStatus = async (req, res) => {
    const { status } = req.body;
    const applicationId = req.params.id;
    if(!status){
        return res.status(400).json({
            message: "Status is required.",
            success: false
        });
    }

    //find the application by applicant id

    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
        return res.status(404).json({
            message: "Application not found.",
            success: false
        });
    }
  //update application status
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
        message: "Application status updated successfully.",
        success: true
    });
}
