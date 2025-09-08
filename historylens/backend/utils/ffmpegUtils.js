const { spawn } = require('child_process');
const fs = require('fs');

// Example ffmpeg command:
// ffmpeg -y -framerate 1/duration -i img%03d.png -i audio.mp3 -c:v libx264 -c:a aac -shortest output.mp4

function createSlideshow(images, audioPath, outputPath, perImageDuration) {
  return new Promise((resolve, reject) => {
    // Create a temporary filelist for ffmpeg
    const fileList = images.map(img => `file '${img}'`).join('\n');
    const fileListPath = outputPath + '.txt';
    fs.writeFileSync(fileListPath, fileList);
    const args = [
      '-y',
      '-f', 'concat',
      '-safe', '0',
      '-i', fileListPath,
      '-framerate', (1 / perImageDuration).toString(),
      ...(audioPath ? ['-i', audioPath] : []),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      ...(audioPath ? ['-c:a', 'aac', '-shortest'] : []),
      outputPath
    ];
    const ffmpeg = spawn('ffmpeg', args);
    ffmpeg.stderr.on('data', data => {
      if (process.env.LOG_LEVEL === 'debug')
        console.log('ffmpeg:', data.toString());
    });
    ffmpeg.on('close', code => {
      fs.unlinkSync(fileListPath);
      if (code === 0) resolve();
      else reject(new Error('ffmpeg failed with code ' + code));
    });
  });
}

module.exports = { createSlideshow };
