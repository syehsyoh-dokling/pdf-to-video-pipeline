const axios = require('axios');
const config = require('../../../config/providers.json');

/**
 * Sends the chunk of text to the AI Orchestrator to get an Image Generation Prompt
 */
async function getPromptForScene(textChunk) {
  try {
    const url = config.settings.ai_orchestrator_url || 'http://localhost:4000/api/orchestrate';
    
    // We assume there's a template named 'pdf_to_video_prompt' in the Orchestrator
    const response = await axios.post(url, {
      issue_type: 'pdf_to_video_prompt',
      variables: {
        text: textChunk
      }
    });

    if (response.data && response.data.data) {
      return response.data.data.trim();
    }
    
    // Fallback if orchestrator fails or template not found
    return `Create a cinematic, photorealistic image depicting the following scene: ${textChunk}`;
  } catch (error) {
    console.warn('AI Orchestrator failed, falling back to basic prompt. Error:', error.message);
    return `Create a high quality illustration for this story: ${textChunk}`;
  }
}

/**
 * Sends a summary of the text to the AI Orchestrator to get a Book Cover Prompt
 */
async function getPromptForCover(summaryText) {
  try {
    const url = config.settings.ai_orchestrator_url || 'http://localhost:4000/api/orchestrate';
    
    const response = await axios.post(url, {
      issue_type: 'pdf_cover_prompt',
      variables: {
        text: summaryText
      }
    });

    if (response.data && response.data.data) {
      return response.data.data.trim();
    }
    
    return `A beautiful, professional book cover design based on this story: ${summaryText}. Typography included.`;
  } catch (error) {
    console.warn('AI Orchestrator failed, falling back to basic cover prompt. Error:', error.message);
    return `A professional book cover illustration for a story about: ${summaryText.substring(0, 100)}`;
  }
}

module.exports = { getPromptForScene, getPromptForCover };
