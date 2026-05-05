require('dotenv').config();
const path = require('path');
const { runPipeline } = require('./src/core/pipeline');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node run-pipeline.js <path-to-pdf>');
  process.exit(1);
}

const inputPdfPath = path.resolve(args[0]);

runPipeline(inputPdfPath)
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('Pipeline failed with error:', err);
    process.exit(1);
  });
