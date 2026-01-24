import * as faceapi from "face-api.js";

export function drawBoundingBox(video, canvas, detection) {
  if (!detection) return;

  const size = {
    width: video.videoWidth,
    height: video.videoHeight,
  };

  faceapi.matchDimensions(canvas, size);

  const resized = faceapi.resizeResults(detection, size);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  faceapi.draw.drawDetections(canvas, resized);
}
