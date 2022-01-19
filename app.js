const express = require("express");
const fs = require("fs");
const path = require("path");
const https = require("httpolyglot");
const mediasoup = require("mediasoup");

const app = express();

const Room = require("./helpers/Room");
const Peer = require("./helpers/Peer");
const Question = require("./helpers/Question");

const config = require("./config/config");

const options = {
  key: fs.readFileSync(path.join(__dirname, config.sslKey), "utf-8"),
  cert: fs.readFileSync(path.join(__dirname, config.sslCrt), "utf-8"),
};

const httpsServer = https.createServer(options, app);
const io = require("socket.io")(httpsServer, {
  cors: {
    origin: "*",
  },
});

app.use(express.static(path.join(__dirname, "client")));

httpsServer.listen(config.listenPort, () =>
  console.log(
    "Listening on https://" + config.listenIp + ":" + config.listenPort
  )
);

process.on("uncaughtException", (err) =>
  console.error(`Caught exception: ${err}`)
);

// all mediasoup workers
let workers = [];
let nextMediasoupWorkerIdx = 0;

let roomList = new Map();

(async () => await createWorkers())();

async function createWorkers() {
  let { numWorkers } = config.mediasoup;

  for (let i = 0; i < numWorkers; i++) {
    let worker = await mediasoup.createWorker({
      logLevel: config.mediasoup.worker.logLevel,
      logTags: config.mediasoup.worker.logTags,
      rtcMinPort: config.mediasoup.worker.rtcMinPort,
      rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
    });

    worker.on("died", () => {
      console.error(
        "mediasoup worker died, exiting in 2 seconds... [pid:%d]",
        worker.pid
      );
      setTimeout(() => process.exit(1), 2000);
    });

    workers.push(worker);
  }
}

io.on("connection", (socket) => {
  socket.on("createRoom", async ({ room_id }, callback) => {
    if (roomList.has(room_id)) {
      callback("already exists");
    } else {
      console.log("Created room", { room_id: room_id });

      let worker = await getMediasoupWorker();

      roomList.set(room_id, new Room(room_id, worker, io));

      callback(room_id);
    }
  });

  socket.on("join", ({ room_id, userId }, cb) => {
    console.log("User joined", { room_id, userId });

    if (!roomList.has(room_id)) return cb({ error: "Room does not exist" });

    roomList.get(room_id).addPeer(new Peer(socket.id, userId));

    socket.room_id = room_id;

    cb(roomList.get(room_id).toJson());
  });

  socket.on("getProducers", () => {
    if (!roomList.has(socket.room_id)) return;

    console.log("Get producers", {
      userId: `${
        roomList.get(socket.room_id).getPeers().get(socket.id).userId
      }`,
    });

    // send all the current producer to newly joined member
    let producerList = roomList.get(socket.room_id).getProducerListForPeer();

    socket.emit("newProducers", producerList);
  });

  socket.on("getUsers", () => {
    if (!roomList.has(socket.room_id)) return;
    console.log("Get users", {
      userId: `${
        roomList.get(socket.room_id).getPeers().get(socket.id).userId
      }`,
    });
    let userList = roomList.get(socket.room_id).getAllUsers();
    socket.emit("newUsers", userList);
  });

  socket.on("getRouterRtpCapabilities", (_, callback) => {
    console.log("Get RouterRtpCapabilities", {
      userId: `${
        roomList.get(socket.room_id).getPeers().get(socket.id).userId
      }`,
    });

    try {
      callback(roomList.get(socket.room_id).getRtpCapabilities());
    } catch (e) {
      callback({
        error: e.message,
      });
    }
  });

  socket.on("createWebRtcTransport", async (_, callback) => {
    console.log("Create webrtc transport", {
      userId: `${
        roomList.get(socket.room_id).getPeers().get(socket.id).userId
      }`,
    });

    try {
      const { params } = await roomList
        .get(socket.room_id)
        .createWebRtcTransport(socket.id);

      callback(params);
    } catch (err) {
      console.error(err);
      callback({
        error: err.message,
      });
    }
  });

  socket.on(
    "connectTransport",
    async ({ transport_id, dtlsParameters }, callback) => {
      console.log("Connect transport", {
        userId: `${
          roomList.get(socket.room_id).getPeers().get(socket.id).userId
        }`,
      });

      if (!roomList.has(socket.room_id)) return;
      await roomList
        .get(socket.room_id)
        .connectPeerTransport(socket.id, transport_id, dtlsParameters);

      callback("success");
    }
  );

  socket.on(
    "produce",
    async ({ kind, rtpParameters, producerTransportId }, callback) => {
      if (!roomList.has(socket.room_id))
        return callback({ error: "not is a room" });

      let producer_id = await roomList
        .get(socket.room_id)
        .produce(socket.id, producerTransportId, rtpParameters, kind);

      console.log("Produce", {
        type: `${kind}`,
        userId: `${
          roomList.get(socket.room_id).getPeers().get(socket.id).userId
        }`,
        id: `${producer_id}`,
      });

      callback({ producer_id });
    }
  );

  socket.on(
    "consume",
    async ({ consumerTransportId, producerId, rtpCapabilities }, callback) => {
      //TODO null handling
      let params = await roomList
        .get(socket.room_id)
        .consume(socket.id, consumerTransportId, producerId, rtpCapabilities);

      console.log("Consuming", {
        userId: `${
          roomList.get(socket.room_id) &&
          roomList.get(socket.room_id).getPeers().get(socket.id).userId
        }`,
        producer_id: `${producerId}`,
        consumer_id: `${params.id}`,
      });

      callback(params);
    }
  );

  socket.on("resume", async (data, callback) => {
    await consumer.resume();

    callback();
  });

  socket.on("getMyRoomInfo", (_, cb) => {
    cb(roomList.get(socket.room_id).toJson());
  });

  socket.on("disconnect", async () => {
    console.log("Disconnect", {
      userId: `${
        roomList.get(socket.room_id) &&
        roomList.get(socket.room_id).getPeers().get(socket.id).userId
      }`,
    });
    if (!socket.room_id) return;
    await roomList.get(socket.room_id).removePeer(socket.id);
  });

  socket.on("producerClosed", ({ producer_id }) => {
    console.log("Producer close", {
      userId: `${
        roomList.get(socket.room_id) &&
        roomList.get(socket.room_id).getPeers().get(socket.id).userId
      }`,
    });

    roomList.get(socket.room_id).closeProducer(socket.id, producer_id);
  });

  socket.on("exitRoom", async (_, callback) => {
    console.log("Exit room", {
      userId: `${
        roomList.get(socket.room_id) &&
        roomList.get(socket.room_id).getPeers().get(socket.id).userId
      }`,
    });
    if (!roomList.has(socket.room_id)) {
      callback({
        error: "not currently in a room",
      });
      return;
    }

    // close transports
    await roomList.get(socket.room_id).removePeer(socket.id);
    await roomList.get(socket.room_id);

    if (roomList.get(socket.room_id).getPeers().size === 0) {
      roomList.delete(socket.room_id);
    }
    socket.room_id = null;
    callback("successfully exited room");
  });

  socket.on("addMassage", ({ userId, text }) => {
    roomList.get(socket.room_id).addMsg({ userId, text });
  });

  socket.on("getMassages", () => {
    if (!roomList.has(socket.room_id)) return;
    let massage = roomList.get(socket.room_id).getAllMsgs();
    socket.emit("newMassage", massage);
  });

  socket.on("handUp", ({ userId }) => {
    roomList.get(socket.room_id).handUp({ userId });
  });

  socket.on("createPoll", ({ userId, question, versions, anonymus }) => {
    if (!roomList.has(socket.room_id)) return;
    roomList
      .get(socket.room_id)
      .addQuestion(new Question(userId, question, versions, anonymus));
  });
  socket.on("getPolls", ({ userId }) => {
    if (!roomList.has(socket.room_id)) return;
    let question = roomList.get(socket.room_id).getAllPolls({ userId });
    socket.emit("newPoll", question);
  });

  socket.on("votePoll", ({ userId, questionId, versionId }) => {
    if (!roomList.has(socket.room_id)) return;
    roomList
      .get(socket.room_id)
      .voteQuestion({ userId, questionId, versionId });
  });
});

function getMediasoupWorker() {
  const worker = workers[nextMediasoupWorkerIdx];

  if (++nextMediasoupWorkerIdx === workers.length) nextMediasoupWorkerIdx = 0;

  return worker;
}

