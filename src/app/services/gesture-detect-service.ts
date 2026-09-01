import { Injectable } from '@angular/core';
import { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Gesture } from '../models/gesture'

@Injectable({
  providedIn: 'root',
})
export class GestureDetectService {

  isLeftHandUp(landmarks: NormalizedLandmark[]) {
    const leftShoulder = landmarks[11];
    const leftWrist = landmarks[15];
    return leftWrist.y < leftShoulder.y;
  }

  isRightHandUp(landmarks: NormalizedLandmark[]) {
    const rightShoulder = landmarks[12];
    const rightWrist = landmarks[16];
    return rightWrist.y < rightShoulder.y;
  }


  detectGesture(landmarks: NormalizedLandmark[]) {
    const leftHandUp = this.isLeftHandUp(landmarks);
    const rightHandUp = this.isRightHandUp(landmarks);

    if (leftHandUp && rightHandUp) {
      return Gesture.BOTH_HANDS_UP;
    }

    if (leftHandUp && !rightHandUp) {
      return Gesture.LEFT_HAND_UP;
    }

    if (!leftHandUp && rightHandUp) {
      return Gesture.RIGHT_HAND_UP;
    }

    return Gesture.NONE;
  }
}
