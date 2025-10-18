import { Company} from "../models/company.model.js";
export const registerCompany = async (req, res) => {
     try {
        const { CompanyName } = req.body;
        if(!CompanyName){
            return res.status(400).json({ 
                message: 'Company name is required',
                success:false
            });
        }

        // Validate company name length
        if (CompanyName.trim().length < 2) {
            return res.status(400).json({
                message: 'Company name must be at least 2 characters',
                success: false
            });
        }

        if (CompanyName.length > 100) {
            return res.status(400).json({
                message: 'Company name must not exceed 100 characters',
                success: false
            });
        }

        let company = await Company.findOne({name:CompanyName});
        if(company){
            return res.status(400).json({ 
                message: 'Company already registered',
                success:false
            });
        }
          company = await Company.create({
            name: CompanyName,
            userId: req.id
        });
         return res.json({
            message:"Company registered successfully",
            success:true,
            company
         });

     } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Server error",
            success:false
        });
     }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({userId});
        if(!companies){
            return res.status(404).json({
                message:"No companies found",
                success:false
            });
        }
        return res.json({
            message:"Companies fetched successfully",
            success:true,
            companies
        });
    }
        catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Server error",
            success:false
        });
     }
}

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
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

export const updateCompany = async (req, res) => {
    try {
        const { name, description, location, website } = req.body;

        // Validate required fields
        if (!name && !description && !location && !website) {
            return res.status(400).json({ 
                message: 'At least one field must be provided for update', 
                success: false 
            });
        }

        // Validate name length if provided
        if (name && name.trim().length < 2) {
            return res.status(400).json({
                message: 'Company name must be at least 2 characters',
                success: false
            });
        }

        // Validate website URL if provided
        if (website) {
            const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d-]+(\/.*)?$/;
            if (!urlRegex.test(website)) {
                return res.status(400).json({
                    message: 'Invalid website URL format',
                    success: false
                });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (location) updateData.location = location;
        if (website) updateData.website = website;
        
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!company) {
            return res.status(404).json({ message: 'Company not found', success: false });
        }
           return res.status(200).json({
            message:"Company information updated.",
            success:true,
            company
        })
    }
    catch (error) {
        console.error('Error in updateCompany:', error);
        res.status(500).json({ message: 'Server error', success: false });
    }
};

