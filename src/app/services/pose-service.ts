import { Injectable } from '@angular/core';
import { FilesetResolver, PoseLandmarker, PoseLandmarkerResult } from '@mediapipe/tasks-vision'

@Injectable({
  providedIn: 'root',
})
export class PoseService {

  private poseLandmarker?: PoseLandmarker;

  async loadMediaPipe() {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );
    
    this.poseLandmarker = 
    await PoseLandmarker.createFromOptions(
      vision,
    {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
      },

      runningMode: 'VIDEO',
      numPoses: 1
    }
    ); 
  }

  detect(video: HTMLVideoElement) {
    if (!this.poseLandmarker) {
      return undefined;
    }

    return this.poseLandmarker.detectForVideo(
      video,
      performance.now()
    );
  }
}
