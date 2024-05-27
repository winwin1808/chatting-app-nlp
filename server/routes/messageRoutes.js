const { sendMsg, getAllMsg } = require("../controllers/messageController");
const router = require('express').Router();

router.post("/addmsg", sendMsg);
router.post("/getmsg", getAllMsg);

module.exports = router;