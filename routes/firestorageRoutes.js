const express = require("express");
const { bucket } = require("../config/firebaseInit.js");
const multer = require('multer');
const path = require("path");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

async function uploadFile(filePath, destination) {
  try {
    const newFileName = Date.now() + path.extname(filePath.originalname);
    const options = {
      destination: destination ? destination + "/" + newFileName : newFileName,
    };

    const data = await bucket.upload(filePath.path, options);
    return {
      error: null, uploaded: true, oldFileName: filePath.originalname, fileSize: filePath.size, name: newFileName, url:
        `https://firebasestorage.googleapis.com/v0/b/wingfi-9b5b7.appspot.com/o/${newFileName}?alt=media`
    }
  } catch (error) {
    return { error: error.message, uploaded: false }
  }
}

/**
 * Create a new document in a collection
 */

router.post("/addPic", upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file; // Path to the temporary uploaded file
    const data = await uploadFile(filePath);
    if (data.uploaded) {
      return res
        .status(201)
        .json({ message: "Document created successfully", ...data });
    }
  } catch (error) {
    console.log("Error creating document:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


/**
 * Delete a document by ID
 */


async function deleteFile(fileName) {
  try {
    // Attempt to delete the file from the bucket
    await bucket.file(fileName).delete();

    // Log the success message
    console.log(`${fileName} deleted`);

    // Return a success response
    return { error: null, deleted: true, fileName };
  } catch (error) {
    // Log the error message
    console.error(`Error deleting file: ${fileName}`);
    console.error(error.message);

    // Return the error in the response
    return { error: error.message, deleted: false, fileName };
  }
}

router.delete("/deletePic", async (req, res) => {
  try {
    const { path } = req.body;
    console.log(path)
    const data = await deleteFile(path);
    console.log(data)
    return res.status(200).json({ ...data });
  } catch (error) {
    console.error("Error fetching document:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


/**
 * Upload a document Modified
 */

async function uploadFileToFirestore(filePath, destination) {
    try {
        const newFileName = Date.now() + path.extname(filePath.originalname);
        const destinationPath = destination
            ? `rabbit-turtle/${destination}/${newFileName}`
            : `rabbit-turtle/${newFileName}`;

        // Upload file to Firebase Storage
        await bucket.upload(filePath.path, { destination: destinationPath });

        // Make file publicly accessible
        await bucket.file(destinationPath).makePublic();

        // Generate the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;

        return {
            error: null,
            uploaded: true,
            oldFileName: filePath.originalname,
            fileSize: filePath.size,
            name: newFileName,
            url: publicUrl,
        };
    } catch (error) {
        throw new Error(error.message)
    }
}

/**
 * Delete a document by ID Modified
 */

async function deleteFileFromFirestore(fileUrl) {
    // Extract the file path from the URL
    const baseUrl = `https://storage.googleapis.com/${bucket.name}/`;

    if (!fileUrl.startsWith(baseUrl)) {
        throw new Error("Invalid file URL. Must be from the correct Firebase Storage bucket.");
    }

    const filePath = fileUrl.replace(baseUrl, "");

    // Attempt to delete the file from the bucket
    await bucket.file(filePath).delete();

    // Return a success response
    return { error: null, deleted: true, fileName: filePath };
}

module.exports = router;
