require('dotenv').config();
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const path = require('path');

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

async function uploadFile(fileName) {
    const filePath = path.join(__dirname, "/content/", fileName);

    console.log("filePath: ", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error("File does not exist:", fileName);
        return;
    }

    try {
        const readableStreamForFile = fs.createReadStream(filePath);
        const options = {
            pinataMetadata: {
                name: fileName,
            },
            pinataOptions: {
                cidVersion: 0
            }
        };

        const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
        console.log("Uploaded to IPFS with result:", result);
        console.log("IPFS Hash:", result.IpfsHash);  // Log the IPFS hash

        // Append the filename and IPFS hash to uploads.log
        const logEntry = `${fileName} => ${result.IpfsHash}\n`;
        fs.appendFileSync('uploads.log', logEntry);
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}

const fileName = process.argv[2]; // Take the filename from the command line argument
if (!fileName) {
    console.log("Please provide a file name");
    process.exit(1);
}

uploadFile(fileName);