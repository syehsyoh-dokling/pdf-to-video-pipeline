require('dotenv').config();
const path = require('path');
const { parsePDF } = require('./src/core/pdfParser');

// Dynamic Provider Loading
const config = require('./config/providers.json');
const llmAdapter = require(`./src/adapters/llm/${config.active_providers.llm}`);
const imageAdapter = require(`./src/adapters/image/${config.active_providers.image}`);

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: node generate-cover.js <path-to-pdf>');
  process.exit(1);
}

const inputPdfPath = path.resolve(args[0]);

async function generateCover() {
  console.log('--- Starting Book Cover Generation ---');
  
  // 1. Extract Text from PDF
  console.log('[1/4] Extracting text from PDF...');
  const fullText = await parsePDF(inputPdfPath);
  
  // 2. Grasp the context (Use the first 1500 characters to understand the story)
  const contextSummary = fullText.substring(0, 1500).replace(/\n/g, ' ');
  console.log(`[2/4] Context extracted: "${contextSummary.substring(0, 100)}..."`);
  
  // 3. Prompt Generation via Orchestrator
  console.log('[3/4] Asking AI Orchestrator for Cover Design Prompt...');
  const coverPrompt = await llmAdapter.getPromptForCover(contextSummary);
  console.log(`      Generated Prompt: "${coverPrompt}"`);
  
  // 4. Image Generation
  console.log(`[4/4] Generating Cover Image via ${config.active_providers.image}...`);
  const outputDir = path.resolve(__dirname, 'workspace/output');
  const coverPath = path.join(outputDir, `cover_${Date.now()}.png`);
  
  await imageAdapter.generateImage(coverPrompt, coverPath);
  console.log(`\n✅ Book Cover Generated Successfully!`);
  console.log(`📂 Saved at: ${coverPath}`);
}

generateCover().catch((err) => {
  console.error('Failed to generate cover:', err);
  process.exit(1);
});
