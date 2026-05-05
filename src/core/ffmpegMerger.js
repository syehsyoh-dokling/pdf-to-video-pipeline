const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

/**
 * Creates a video from a static image and audio file using FFmpeg.
 * Adds a slow zoom-in (Ken Burns) effect to make it dynamic.
 */
function mergeImageAndAudio(imagePath, audioPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      // Input 1: The static image, looped
      .input(imagePath)
      .loop()
      // Input 2: The audio file
      .input(audioPath)
      // Apply Zoom/Pan filter for dynamic feel
      .complexFilter([
        "zoompan=z='min(zoom+0.0015,1.5)':d=700:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'[v]"
      ])
      .outputOptions([
        '-map [v]',         // use filtered video
        '-map 1:a',         // use audio from input 1
        '-c:v libx264',     // H.264 codec
        '-c:a aac',         // AAC audio
        '-b:a 192k',
        '-pix_fmt yuv420p', // Pixel format for wide compatibility
        '-shortest'         // End encoding when the shortest input (audio) ends
      ])
      .save(outputPath)
      .on('end', () => {
        console.log(`Video created successfully: ${outputPath}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err.message);
        reject(err);
      });
  });
}

/**
 * Concatenates multiple scene videos into one final video
 */
function concatVideos(videoPaths, finalOutputPath) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();
    
    videoPaths.forEach(vp => command.input(vp));
    
    command
      .on('error', (err) => reject(err))
      .on('end', () => resolve(finalOutputPath))
      .mergeToFile(finalOutputPath, path.dirname(finalOutputPath));
  });
}

module.exports = { mergeImageAndAudio, concatVideos };
