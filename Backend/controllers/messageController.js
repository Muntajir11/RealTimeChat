import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

export const sendMessage= async(req, res) => {
    
    try {

        const {message}= req.body;
        const {id: receiverId}= req.params;
        const senderId= req.user.id;

       let conversation = await Conversation.findOne({
            participants: {$all: [senderId,receiverId]},
        })


        if(!conversation){
            conversation= await Conversation.create({
                participants:[senderId, receiverId],
            })
        }

        const newMessage= new Message({
            senderId,
            receiverId,
            message,
        })

        if(newMessage)
        {
            conversation.messages.push(newMessage._id);
        }



        //will add socket.io later on

        
        // await conversation.save();
        // await newMessage.save();

        //this will run in parallel and is faster :D
        await Promise.all([conversation.save(), newMessage.save()]);
        res.status(201).json(newMessage);
        
    } catch (error) {
        console.log("Error in sendMessage Controller:", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};