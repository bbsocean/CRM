// controllers/aiVideoCallController.js
const { Server } = require("socket.io");

exports.handleVideoCall = (req, res) => {
  const { offer } = req.body;
  const io = new Server();
  
  io.on("connection", (socket) => {
    socket.emit("video-call-offer", offer);

    socket.on("video-call-answer", (answer) => {
      res.status(200).json({ answer });
    });
  });

  io.listen(3001);
};
