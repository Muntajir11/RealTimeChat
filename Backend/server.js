import { getEnv } from "./config/env.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import configureExpress from "./bootstrap/configureExpress.js";
import { app, server } from "./socket/socket.js";

getEnv();
configureExpress(app);

const PORT = getEnv().PORT;

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});
