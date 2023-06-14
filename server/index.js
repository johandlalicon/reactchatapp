const express = require("express");
const app = express();
const PORT = 4000;
const User = require("./models/User");
const Message = require("./models/Message");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const ws = require("ws");

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: [
      process.env.LOCAL_CLIENT_URL,
      process.env.PROD_CLIENT_URL,
      "http://127.0.0.1:4040",
      "http://127.0.0.1:4041",
    ],
  })
);

const bcryptSalt = bcrypt.genSaltSync(10);

app.get("/", (req, res) => {
  res.json("test ok");
});

//GETS USER DATA USING TOKEN THEN VERIFY TOKEN AND PASSED IN USING useContext TO CHILDREN COMP

app.get("/user", (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
      console.log(userData);
      res.json(userData);
    });
  } catch (error) {
    console.log(err);
    throw error;
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashpw = bcrypt.hashSync(password, bcryptSalt);
    const newUser = await User.create({
      username: username,
      password: hashpw,
    });
    //CREATES TOKEN USING JWT
    //USES USERID AS PAYLOAD INSIDE TOKEN
    jwt.sign(
      { userId: newUser._id, username },
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: newUser._id,
          });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(409).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const verifiedUser = bcrypt.compareSync(password, user.password);
      if (verifiedUser) {
        jwt.sign(
          { userId: user._id, username },
          process.env.JWT_SECRET,
          (err, token) => {
            if (err) throw err.message;
            res
              .cookie("token", token, { sameSite: "none", secure: true })
              .status(201)
              .json({
                id: user._id,
              });
          }
        );
      } else {
        console.log("no user found");
        res.status(401).json({ error: "Invalid Username or Password" });
      }
    }
  } catch (error) {
    console.log("mongo issue");
    res.status(404).json({ error: "User not found" });
  }
});

app.get("/messages/:recipientId/:myId", async (req, res) => {
  const { recipientId, myId } = req.params;
  const messageArchive = await Message.find({
    sender: { $in: [myId, recipientId] },
    recipient: { $in: [myId, recipientId] },
  }).sort({
    createdAt: 1,
  });

  res.json(messageArchive);
});

app.get("/allusers", async (req, res) => {
  const allUsers = await User.find({}, { _id: 1, username: 1 });
  res.json(allUsers);
});

app.post("/addcontact/:contactId/:myId", async (req, res) => {
  const { contactId, myId } = req.params;
  const updatedFriendList = await User.findOneAndUpdate(
    { _id: myId },
    { $push: { friends: contactId } }
  );
  console.log(updatedFriendList.friends);
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { sameSite: "none", secure: true }).json("Logout");
});

// ========================================= //
const server = app.listen(PORT, () => {
  console.log("LISTENING ON PORT", process.env.PORT);
  require("./dbconnection");
});

const wss = new ws.WebSocketServer({ server });

wss.on("connection", (connection, req) => {
  console.log("WS Connected");

  function usersConnected() {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((client) => ({
            userId: client.userId,
            username: client.username,
          })),
        })
      );
    });
  }

  connection.isAlive = true;

  connection.timer = setInterval(() => {
    connection.ping();
    connection.killTimer = setTimeout(() => {
      connection.isAlive = false;
      connection.terminate();
      console.log("a user disconnected");
      usersConnected();
      clearInterval(connection.timer);
    }, 1000);
  }, 3000);

  connection.on("pong", () => {
    clearTimeout(connection.killTimer);
  });

  const cookies = req.headers.cookie; //GETS COOKIE FROM THE CONNECTED USER

  if (cookies !== "token=") {
    const tokenStr = cookies.split(";").find((str) => str.startsWith("token="));
    if (tokenStr) {
      const token = tokenStr.split("=")[1];
      jwt.verify(token, process.env.JWT_SECRET, (error, userData) => {
        if (error) throw error;
        const { userId, username } = userData;
        connection.userId = userId;
        connection.username = username;
      });
    }
  }

  usersConnected();
  //HANDLES DATA RECEIVED FROM CLIENT; RUNS WHEN SERVER RECEIVES MESSAGE FROM CLIENT
  connection.on("message", async (message) => {
    const receiveMsg = JSON.parse(message.toString());
    const { text, recipient } = receiveMsg;
    if (text && recipient) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
      });

      [...wss.clients] //COLLECTION OF USERS THAT'S CONNECTED
        .filter((c) => c.userId === recipient) // FILTERS THE RECIPIENT FROM THE LIST OF CONNECTED USERS
        .forEach(
          (c) =>
            c.send(
              JSON.stringify({
                text,
                sender: connection.userId,
                _id: messageDoc._id,
                recipient,
              })
            ) //AND THEN SENDS DATA TO RECIPIENT
        );
    }
  });
});
