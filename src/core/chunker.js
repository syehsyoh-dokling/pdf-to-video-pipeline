/**
 * Simple chunker to split text into paragraphs/scenes.
 * Real-world chunking might use NLP to split by sentences or token limits.
 */
function chunkText(text) {
  // Split by double newline (paragraphs)
  const rawChunks = text.split(/\n\s*\n/);
  
  // Filter out empty chunks and clean up
  const chunks = rawChunks
    .map(c => c.replace(/\n/g, ' ').trim())
    .filter(c => c.length > 50); // Ignore very short sentences/titles
    
  return chunks;
}

module.exports = { chunkText };
