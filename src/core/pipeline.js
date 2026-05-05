const path = require('path');
const { parsePDF } = require('./pdfParser');
const { chunkText } = require('./chunker');
const { mergeImageAndAudio, concatVideos } = require('./ffmpegMerger');

// Dynamic Provider Loading based on config
const config = require('../../config/providers.json');
const llmAdapter = require(`../adapters/llm/${config.active_providers.llm}`);
const audioAdapter = require(`../adapters/audio/${config.active_providers.audio}`);
const imageAdapter = require(`../adapters/image/${config.active_providers.image}`);

async function runPipeline(pdfPath) {
  console.log('--- Starting PDF-to-Video Pipeline ---');
  
  // 1. Extract and Chunk PDF
  console.log('[1/5] Extracting text from PDF...');
  const fullText = await parsePDF(pdfPath);
  
  console.log('[2/5] Chunking text into scenes...');
  const scenes = chunkText(fullText);
  console.log(`Found ${scenes.length} scenes to process.`);
  
  const generatedVideos = [];
  const outputDir = path.resolve(__dirname, '../../workspace/output');

  // Process each scene
  for (let i = 0; i < scenes.length; i++) {
    const sceneText = scenes[i];
    console.log(`\n--- Processing Scene ${i + 1}/${scenes.length} ---`);
    console.log(`Text preview: "${sceneText.substring(0, 50)}..."`);
    
    // File paths
    const audioPath = path.join(outputDir, `scene_${i+1}.mp3`);
    const imagePath = path.join(outputDir, `scene_${i+1}.png`);
    const videoPath = path.join(outputDir, `scene_${i+1}.mp4`);

    // 3. Audio Generation
    console.log('  -> Generating Audio (ElevenLabs)...');
    await audioAdapter.generateAudio(sceneText, audioPath);
    
    // 4. Prompt Generation via Orchestrator
    console.log('  -> Asking AI Orchestrator for Image Prompt...');
    const imagePrompt = await llmAdapter.getPromptForScene(sceneText);
    console.log(`     Prompt: "${imagePrompt}"`);
    
    // 5. Image Generation
    console.log('  -> Generating Image (Stability AI)...');
    await imageAdapter.generateImage(imagePrompt, imagePath);
    
    // 6. Video Assembly via FFmpeg
    console.log('  -> Assembling Video Scene with FFmpeg (Zoom Pan effect)...');
    await mergeImageAndAudio(imagePath, audioPath, videoPath);
    
    generatedVideos.push(videoPath);
  }

  // 7. Final Merge
  if (generatedVideos.length > 1) {
    console.log('\n[5/5] Merging all scenes into final video...');
    const finalOutputPath = path.join(outputDir, 'FINAL_VIDEO.mp4');
    await concatVideos(generatedVideos, finalOutputPath);
    console.log(`\n✅ Pipeline Finished Successfully! Final video at: ${finalOutputPath}`);
  } else {
    console.log(`\n✅ Pipeline Finished Successfully! Single scene video at: ${generatedVideos[0]}`);
  }
}

module.exports = { runPipeline };
