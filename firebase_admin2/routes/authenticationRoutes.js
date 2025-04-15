const express = require("express");
const { auth } = require("../config/firebaseInit.js");

const router = express.Router();

/**
 * Register a new user
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userRecord = await auth.createUser({
      email,
      password,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", uid: userRecord.uid });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Login a user
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Firebase Auth does not provide direct sign-in functionality on the backend.
    // Use Firebase Admin SDK to validate the user token instead.
    return res.status(400).json({
      error:
        "Direct login functionality is not available. Use client SDK for login.",
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Send password reset email
 */
router.post("/resetPassword", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    await auth.sendPasswordResetEmail(email);

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Get user information
 */
router.get("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    const userRecord = await auth.getUser(uid);

    return res.status(200).json(userRecord);
  } catch (error) {
    console.error("Error fetching user information:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Delete a user
 */
router.delete("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    await auth.deleteUser(uid);

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Update user information
 */
router.put("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const { email, password, displayName, photoURL } = req.body;

    const updateUserRecord = await auth.updateUser(uid, {
      email,
      password,
      displayName,
      photoURL,
    });

    return res
      .status(200)
      .json({ message: "User updated successfully", user: updateUserRecord });
  } catch (error) {
    console.error("Error updating user information:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/add-admin", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }
    await auth.setCustomUserClaims(uid, { admin: true });
    console.log(`Custom claim 'admin' set for user ${uid}`);
    return res
      .status(200)
      .json({ message: "Admin Assigned Successfully", user: uid });
  } catch (error) {
    console.error("Error setting custom claim:", error);
  }
});

router.put("/remove-admin", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }
    await auth.setCustomUserClaims(uid, { admin: false });
    console.log(`Custom claim 'admin' set for user ${uid}`);
    return res
    .status(200)
    .json({ message: "Admin removed Successfully", user: uid });
  } catch (error) {
    console.error("Error setting custom claim:", error);
  }
});

module.exports = router;
