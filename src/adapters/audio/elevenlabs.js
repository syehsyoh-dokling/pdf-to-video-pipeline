const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function generateAudio(text, outputPath) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJcg'; // Default Adam voice

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is missing in .env');
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const headers = {
    'Accept': 'audio/mpeg',
    'xi-api-key': apiKey,
    'Content-Type': 'application/json'
  };

  const data = {
    text: text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75
    }
  };

  try {
    const response = await axios.post(url, data, {
      headers: headers,
      responseType: 'arraybuffer' // important for audio files
    });

    fs.writeFileSync(outputPath, response.data);
    return outputPath;
  } catch (error) {
    console.error('ElevenLabs API Error:', error.response ? error.response.data.toString() : error.message);
    throw new Error('Failed to generate audio from ElevenLabs');
  }
}

module.exports = { generateAudio };
