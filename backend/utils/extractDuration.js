const ffmpeg = require('fluent-ffmpeg');

const getAudioDuration = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration; // duration in seconds
        resolve(duration);
      }
    });
  });
};


module.exports = {getAudioDuration}
