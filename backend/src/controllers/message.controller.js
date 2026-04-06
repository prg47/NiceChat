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

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required." });
        }
        if (senderId.equals(receiverId)) {
            return res.status(400).json({ message: "Cannot send messages to yourself." });
        }
        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ message: "Receiver not found." });
        }

        let imageUrl;
        if (image) {
            // Build form data for Cloudinary REST API
            const formData = new FormData();
            formData.append("file", image);                                      // base64 string
            formData.append("upload_preset", "ml_default");                 // your unsigned preset name
            formData.append("folder", "chat_images");                            // optional

            const cloudinaryRes = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!cloudinaryRes.ok) {
                const err = await cloudinaryRes.json();
                console.log("Cloudinary error:", err);
                return res.status(400).json({ message: "Image upload failed.", detail: err });
            }

            const cloudinaryData = await cloudinaryRes.json();
            imageUrl = cloudinaryData.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // todo: real-time socket emit here

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

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