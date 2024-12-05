const { auth } = require("../config/firebaseInit");

async function authorizeAdmin(req, res, next) {
  try {
    // Get token from request headers (assuming the token is sent in the Authorization header)
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Verify the token
    const decodedToken = await auth.verifyIdToken(token);

    // Check if the user has the 'admin' claim
    if (decodedToken.admin) {
      req.user = decodedToken; // Add user information to request object
      next(); // Proceed to the next middleware or route handler
    } else {
      return res
        .status(403)
        .json({ error: "Forbidden: Insufficient permissions" });
    }
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

module.exports = authorizeAdmin;
