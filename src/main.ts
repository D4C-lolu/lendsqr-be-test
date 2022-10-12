import * as dotenv from "dotenv";

//Load environment variables
dotenv.config();

import { PORT } from "./config/constants";
import {
  logger,
  connectToDatabase,
  disconnectFromDatabase,
  createServer,
} from "./api/utils";

const app = createServer();

app.get("/", (req, res) => {
  res.send("E-wallet API up and running!");
});

const server = app.listen(PORT, async () => {
  await connectToDatabase();
  logger.info(`Server listening at http://localhost:${PORT}`);
});

const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];

function gracefulShutdown(signal: string) {
  process.on(signal, async () => {
    logger.info("Goodbye, got signal", signal);
    server.close();
    // disconnect from the db
    await disconnectFromDatabase();
    logger.info("My work here is done");
    process.exit(0);
  });
}

for (let signal of signals) {
  gracefulShutdown(signal);
}
