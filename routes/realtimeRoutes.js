const express = require("express");
const { realtimeDb } = require("../config/firebaseInit.js");

const router = express.Router();

/**
 * Create or update a data entry in Realtime Database
 */
router.post("/setData", async (req, res) => {
  try {
    const { path, data } = req.body;

    if (!path || !data) {
      return res.status(400).json({ error: "path and data are required" });
    }

    await realtimeDb.ref(path).set(data);

    return res.status(201).json({ message: "Data set successfully" });
  } catch (error) {
    console.error("Error setting data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Read data from a specific path
 */
router.get("/getData", async (req, res) => {
  try {
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({ error: "path is required" });
    }

    const snapshot = await realtimeDb.ref(path).once("value");
    const data = snapshot.val();

    if (data === null) {
      return res
        .status(404)
        .json({ message: "No data found at the specified path" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Update data at a specific path
 */
router.put("/updateData", async (req, res) => {
  try {
    const { path, updates } = req.body;

    if (!path || !updates) {
      return res.status(400).json({ error: "path and updates are required" });
    }

    await realtimeDb.ref(path).update(updates);

    return res.status(200).json({ message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Delete data at a specific path
 */
router.delete("/deleteData", async (req, res) => {
  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json({ error: "path is required" });
    }

    await realtimeDb.ref(path).remove();

    return res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Fetch data from a specific path
 */
router.get("/fetchData", async (req, res) => {
  try {
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({ error: "path is required" });
    }

    const snapshot = await realtimeDb.ref(path).once("value");
    const data = snapshot.val();

    if (data === null) {
      return res
        .status(404)
        .json({ message: "No data found at the specified path" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
