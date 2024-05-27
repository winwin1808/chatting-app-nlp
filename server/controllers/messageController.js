import Messages from '../model/messageModel.js'; 

export const sendMsg = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
        if (data) return res.status(200).json({ msg: "Message added successfully." });
        else return res.status(200).json({ msg: "Failed to add message to the database" });
    } catch (ex) {
        next(ex);
    }
};

export const getAllMsg = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });

        res.json(projectedMessages);
    } catch (err) {
        next(err);
    }
};
