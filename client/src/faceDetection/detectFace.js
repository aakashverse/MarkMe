import * as faceapi from "face-api.js";

export async function detectFace(video) {
  return await faceapi
    .detectSingleFace(
      video,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.6,
      })
    )
    .withFaceLandmarks()
    .withFaceDescriptor();
}
