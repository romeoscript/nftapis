const http = require("http");
const app = require("./app");

const PORT = 5001;

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
