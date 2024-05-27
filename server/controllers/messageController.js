// const User = require('../model/userModel');
const Messages = require('../model/messageModel');

module.exports.sendMsg = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        console.log(333,from, to, message);
        const data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
        console.log(444,data)
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
        next(ex);
    }
};
module.exports.getAllMsg = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        console.log(123, req.body);
        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });
        console.log(312, messages);
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