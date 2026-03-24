import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js"

export const signup = async(req,res)=>{
    const {fullName,email,password} = req.body

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({msg : "All fields required !!"})
        }

        if(password.length <6) {
            return res.status(400).json({msg : "Password Should be more than 6 characters"})
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({msg : "Email already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullName,
            email,
            password : hashedPassword,

        })

        if(newUser){
            
            const savedUser =  await newUser.save()
            generateToken(savedUser._id,res)

            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                profilePic : newUser.profilePic

            })
        }else{
            res.status(400).json({msg : "Invalid user data"})
        }

        //TODO : Send welcome email



    } catch (error) {
        console.log("Error in signup controller : ",error)
        res.status(500).json({msg : "Internal server error"})
    }
}

