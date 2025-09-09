import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


//register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, role } = req.body;
        if (!name || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const exitingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (exitingUser) {
            return res.status(400).json({ message: 'User with this email or phone number already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, 
            email, 
            phoneNumber, 
            password: 
            hashedPassword, 
            role 
        });
        await newUser.save();
        res.status(201).json({ 
            message: 'User registered successfully',
            success: true
        });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//login user
export const loginUser = async (req, res) => {
    try {
        const { email, password, role} = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        let user = await User.findOne({ email});
        if(!user){
            return res.status(400).json({
                 message: 'check email or password',
                 success:false
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                message: 'check email or password',
                 success:false 
            });
        }
        if(user.role !== role){
            return res.status(400).json({ 
                message: 'role does not match',
                 success:false 
                });
        }
        const tokenData = {
            userId: user._id,
            role: user.role
        };

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie(
            "token", token,
            {maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            sameSite:'strict',}
        ).json({
            message: `Welcome back, ${user.name}`,
            success: true,
            user,
            success: true,
        })
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//logout user
export const logoutUser = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge: 0, httpOnly: true, sameSite:'strict'}).json({
            message: "Logged out successfully",
            success: true
        }); 
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

//update user profile
export const updateUserProfile = async (req, res) => {
    try {
        const {name, email, phoneNumber, bio, skills} = req.body;


        let skillsArray;
        if(skills){
            skillsArray = skills.split(',').map(skill => skill.trim());
        }

        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'User not found', success: false });
        }
        // updating data
        if(name) user.name = name;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray;

        await user.save();

        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).json({ 
            message: 'Profile updated successfully',
            user,
            success: true 
        });
    }
        catch (error) {
            console.error('Error in updateUserProfile:', error);
            res.status(500).json({ message: 'Server error' });
        }
};

//get user profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'User not found', success: false });
        }
        
        user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        
        return res.status(200).json({ 
            message: 'User profile retrieved successfully',
            user,
            success: true 
        });
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};





