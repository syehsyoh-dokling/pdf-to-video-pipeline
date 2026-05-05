const fs = require('fs');
const pdf = require('pdf-parse');

async function parsePDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    
    // Return extracted text
    return data.text;
  } catch (error) {
    console.error('Failed to parse PDF:', error);
    throw error;
  }
}

module.exports = { parsePDF };
