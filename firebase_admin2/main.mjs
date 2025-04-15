import "dotenv/config";

import express from "express";
import morgan from "morgan";
import firestoreRoutes from "./routes/firestoreRoutes.js";
import firestorageRoutes from "./routes/firestorageRoutes.js";
import realtimeRoutes from "./routes/realtimeRoutes.js";
import authenticationRoutes from "./routes/authenticationRoutes.js";

const app = express();
const PORT = process.env.PORT || 4522;
app.use(express.json());
app.use(morgan("dev"));

app.use("/firestore", firestoreRoutes);
app.use("/storage", firestorageRoutes);
app.use("/realtime", realtimeRoutes);
app.use("/auth", authenticationRoutes);

app.listen(PORT, () => {
  console.log("App is listening on Port", PORT);
});
