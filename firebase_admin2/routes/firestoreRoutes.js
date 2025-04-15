const express = require("express");
const { firestore } = require("../config/firebaseInit.js");

const router = express.Router();

/**
 * Create a new document in a collection
 */
router.post("/createDocument", async (req, res) => {
  try {
    const { collectionPath, documentData, documentId } = req.body;

    if (!collectionPath || !documentData) {
      return res
        .status(400)
        .json({ error: "collectionPath and documentData are required" });
    }

    const collectionRef = firestore.collection(collectionPath);

    let docRef;
    if (documentId) {
      docRef = collectionRef.doc(documentId);
      await docRef.set(documentData);
    } else {
      docRef = await collectionRef.add(documentData);
    }

    return res
      .status(201)
      .json({ id: docRef.id, message: "Document created successfully" });
  } catch (error) {
    console.error("Error creating document:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Read a document by ID
 */
router.get("/getDocument", async (req, res) => {
  try {
    const { collectionPath, documentId } = req.query;

    if (!collectionPath || !documentId) {
      return res
        .status(400)
        .json({ error: "collectionPath and documentId are required" });
    }

    const docRef = firestore.collection(collectionPath).doc(documentId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Document not found" });
    }

    return res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching document:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Update a document by ID
 */
router.put("/updateDocument", async (req, res) => {
  try {
    const { collectionPath, documentId, updatedData } = req.body;

    if (!collectionPath || !documentId || !updatedData) {
      return res.status(400).json({
        error: "collectionPath, documentId, and updatedData are required",
      });
    }

    const docRef = firestore.collection(collectionPath).doc(documentId);
    await docRef.update(updatedData);

    return res.status(200).json({ message: "Document updated successfully" });
  } catch (error) {
    console.error("Error updating document:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Delete a document by ID
 */
router.delete("/deleteDocument", async (req, res) => {
  try {
    const { collectionPath, documentId } = req.body;

    if (!collectionPath || !documentId) {
      return res
        .status(400)
        .json({ error: "collectionPath and documentId are required" });
    }

    const docRef = firestore.collection(collectionPath).doc(documentId);
    await docRef.delete();

    return res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * Fetch all documents in a collection (with optional filters)
 */
router.post("/fetchCollection", async (req, res) => {
  try {
    const { collectionPath, where = [], limit = 10 } = req.body;

    if (!collectionPath) {
      return res.status(400).json({ error: "collectionPath is required" });
    }

    let query = firestore.collection(collectionPath);

    if (where.length > 0) {
      where.forEach((condition) => {
        query = query.where(
          condition.field,
          condition.operator,
          condition.value
        );
      });
    }

    query = query.limit(limit);

    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No documents found" });
    }

    const documents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
