// Local development MongoDB, for machines without Docker or a MongoDB install.
// Boots a real mongod on 127.0.0.1:27017 with a persistent data folder,
// then stays running until stopped (Ctrl+C).
//
//   node dev-mongo.mjs
//
// Not for production — use a managed MongoDB (Atlas) or Docker there.
import { MongoMemoryServer } from "mongodb-memory-server";
import fs from "node:fs";

const dbPath = "./.local-mongo-data";
fs.mkdirSync(dbPath, { recursive: true });

const server = await MongoMemoryServer.create({
  instance: {
    port: 27017,
    ip: "127.0.0.1",
    dbPath,
    storageEngine: "wiredTiger",
  },
});

console.log(`LOCAL_MONGO_READY ${server.getUri()}`);
console.log("MongoDB is running on 127.0.0.1:27017 — press Ctrl+C to stop.");

const shutdown = async () => {
  await server.stop();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.stdin.resume(); // keep the process alive
