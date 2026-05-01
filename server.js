const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const swarm = require("./src/server/swarm");
const store = require("./src/server/store");
const api = require("./src/server/api");

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const handled = await api.handle(req, res);
      if (handled) return;
    } catch (err) {
      console.error("[server]", err);
    }
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: { origin: "*" },
    path: "/api/socket",
  });
  swarm.bindIO(io);
  swarm.seedDefaults();

  io.on("connection", (socket) => {
    socket.emit("snapshot", store.snapshot());
  });

  httpServer.listen(port, hostname, () => {
    console.log(`> Octo Swarm ready at http://${hostname}:${port}`);
  });
});
