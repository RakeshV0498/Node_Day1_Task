import express from "express";
import fs from "fs";
import path from "path";
import os from "os";

const server = express();
const port = 8100;

// Define the folder path in the system's temporary directory
const folderPath = path.join(os.tmpdir(), "timestamps");

// Middleware to parse JSON bodies
server.use(express.json());

server.get("/", (req, res) => {
  const endpoints = server._router.stack
    .filter((r) => r.route)
    .map((r) => ({
      path: r.route.path,
      method: Object.keys(r.route.methods)[0].toUpperCase(),
    }));

  res.json({ endpoints });
});

// Endpoint to create a file with the current timestamp
server.get("/create-file", (req, res) => {
  // Get the current date and time
  const now = new Date();
  const timestamp = now.toLocaleString("en-GB", { timeZone: "UTC" });

  // Create the message with username and timestamp
  const message = `This file is created by the user ${
    os.userInfo().username
  } and created at ${timestamp}`;

  // Create the filename in the format DDMMYYYY_HHmmSS.txt
  const filename = `${now.getDate().toString().padStart(2, "0")}${(
    now.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${now.getFullYear()}_${now
    .getHours()
    .toString()
    .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}.txt`;

  // Ensure the folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Define the full path to the new file
  const filePath = path.join(folderPath, filename);

  // Write the message to the file
  fs.writeFile(filePath, message, (err) => {
    if (err) {
      return res.status(500).send("Error writing file");
    }
    res.send(`File created: ${filename} stored on ${folderPath}`);
  });
});

// Endpoint to list all files in the folder
server.get("/list-all-files", (req, res) => {
  try {
    // Read all files in the folder
    const files = fs.readdirSync(folderPath).map((filename) => {
      return path.join(folderPath, filename);
    });
    // Send the list of files as a JSON response
    res.json({ files });
  } catch (err) {
    // If an error occurs, send a 500 status code with an error message
    res.status(500).send("Error listing files");
  }
});

// Endpoint to display the contents of a specific file
server.get('/file-contents/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(folderPath, filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`${new Date().toString()}: Server listening on ${port}`);
});
