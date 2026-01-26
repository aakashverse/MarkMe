import * as faceapi from "face-api.js";

export function drawBoundingBox(video, canvas, detection) {
  if (!detection) return;

  const displaySize = {
    width: video.videoWidth,
    height: video.videoHeight,
  }
  
  // set canvas h&w acc. to vidio
  canvas.width = displaySize.width;
  canvas.height = displaySize.height;

  faceapi.matchDimensions(canvas, displaySize);

  const resized = faceapi.resizeResults(detection, displaySize);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  faceapi.draw.drawDetections(canvas, resized);
}
