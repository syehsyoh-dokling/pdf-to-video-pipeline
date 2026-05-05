const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function generateImage(prompt, outputPath) {
  const apiKey = process.env.STABILITY_API_KEY;
  
  if (!apiKey) {
    throw new Error('STABILITY_API_KEY is missing in .env');
  }

  // Using Stability AI REST API (Stable Diffusion 3 or SDXL)
  const url = 'https://api.stability.ai/v2beta/stable-image/generate/core';

  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('output_format', 'png');

  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'image/*'
      },
      responseType: 'arraybuffer'
    });

    if (response.status === 200) {
      fs.writeFileSync(outputPath, Buffer.from(response.data));
      return outputPath;
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.error('Stability AI API Error:', error.response ? error.response.data.toString() : error.message);
    throw new Error('Failed to generate image from Stability AI');
  }
}

module.exports = { generateImage };
