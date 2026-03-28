import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"

export const getAllContacts = async(req,res)=>{
    try {
        const loggeIndUserId = req.user._id
        const filteredUsers = await User.find({_id : {$ne : loggeIndUserId}}).select("-password")

        res.status(200).json({filteredUsers})
    } catch (error) {
        console.log("Error in getAllContacts : ",error)
        res.status(500).json({msg : "Internal server error"})
    }
}

export const getMessagesByUserId = async (req , res)=>{
    try {
        const myId = req.user._id
        const {id:userToChatId} = req.params

        const messages = await Message.find({
            $or: [
                {senderId:myId,receiverId:userToChatId},
                {senderId : userToChatId, receiverId : myId}
            ]
        })

        res.status(200).json(messages)

    } catch (error) {
       console.log("Error in getMEssage controller",error.message)
       res.status(500).json({ msg : "internal server error"}) 
    }
}

export const sendMessage  = async( req, res) => {
    try {
        const {text , image} = req.body
        const { id : receiverId} = req.params
        const senderId = req.user._id

        let imageUrl
        if(image){
            //upload base 64 imag to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image : imageUrl
        })

        await newMessage.save()

        //todo : send message in real time if user is online

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in send Message controller : ",error.message)
        res.status(500).json({msg : "Internal server error"})
    }
}

export const getChatPartners  = async(req,res)=>{
    try {
        const loggeIndUserId = req.user._id
        //find where we are either sendeer or receiver
        const messages = await Message.find({
            $or : [
                {
                    senderId : loggeIndUserId
                },
                {
                    receiverId : loggeIndUserId
                }
            ]
        })

        const chatPartnersId = [ ...new Set(messages.map((msg) => msg.senderId.toString() === loggeIndUserId.toString() 
         ?msg.receiverId 
         : msg.senderId))
        ]

        const chatPartners = await User.find({_id : {$in : chatPartnersId}}).select("-password")

        res.status(200).json(chatPartners)
    } catch (error) {
        console.log("Error in getChatParteners controller : ",error.message)
        res.status(500).json({ msg : "Internal server error"})
    }
}