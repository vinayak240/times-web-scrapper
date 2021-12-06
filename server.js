const http = require("http");
const { URI_PATH, PORT } = require("./constants");
const { fetchTimeStores } = require("./lib");

const reqListener = async (req, res) => {
  if (req.url == URI_PATH) {
    let data = await fetchTimeStores();
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data, null, 4));
  } else res.end("Invalid Request!");
};

const server = http.createServer(reqListener);

server.listen(PORT, () => {
  console.info(`[PID: ${process.pid}] STARTED the Service at PORT : ${PORT}`);
});
