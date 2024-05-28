import Messages from '../model/messageModel.js';
import Conversations from '../model/conversationModel.js';
export const sendMsg = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id: receiver } = req.params;
        const sender = req.user._id;

        let conversation = await Conversations.findOne({
            participants: { $all: [sender, receiver] },
        })

        if (!conversation) {
            conversation = await Conversations.create({
                participants: [sender, receiver],
            });
        }

        const newMessage = new Messages({
            message,
            sender,
            receiver,
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);
        res.status(201).json(newMessage);
        // const { from, to, message } = req.body;
        // const data = await Messages.create({
        //     message: { text: message },
        //     users: [from, to],
        //     sender: from,
        // });
        // if (data) return res.status(200).json({ msg: "Message added successfully." });
        // else return res.status(200).json({ msg: "Failed to add message to the database" });
    } catch (error) {
        console.log("Error in sendMsg controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }
};
// export const sendMsg = async (req, res, next) => {
//     try {
//         const { from, to, message } = req.body;
//         const data = await Messages.create({
//             message: { text: message },
//             users: [from, to],
//             sender: from,
//         });
//         if (data) return res.status(200).json({ msg: "Message added successfully." });
//         else return res.status(200).json({ msg: "Failed to add message to the database" });
//     } catch (ex) {
//         next(ex);
//     }
// };

export const getAllMsg = async (req, res, next) => {
    try {
        const { id: userToChatId } = req.params;
        const sender = req.user._id;

        const conversation = await Conversations.findOne({
            participants: { $all: [sender, userToChatId] },
        }).populate("messages");
        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getAllMsg controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
// export const getAllMsg = async (req, res, next) => {
//     try {
//         const { from, to } = req.body;
//         const messages = await Messages.find({
//             users: {
//                 $all: [from, to],
//             },
//         }).sort({ updatedAt: 1 });
//         const projectedMessages = messages.map((msg) => {
//             return {
//                 fromSelf: msg.sender.toString() === from,
//                 message: msg.message.text,
//             };
//         });

//         res.json(projectedMessages);
//     } catch (err) {
//         next(err);
//     }
// };
