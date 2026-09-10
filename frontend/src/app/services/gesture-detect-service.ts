import { Injectable } from '@angular/core';
import { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Gesture } from '../models/gesture'

@Injectable({
  providedIn: 'root',
})
export class GestureDetectService {

  private isVisible(landmark: NormalizedLandmark) {
    return (landmark.visibility ?? 0) > 0.6;
  }

  isLeftHandUp(landmarks: NormalizedLandmark[]) {
    const leftShoulder = landmarks[11];
    const leftWrist = landmarks[15];

    if (!this.isVisible(leftShoulder) || !this.isVisible(leftWrist)) {
      return false;
    }

    return leftWrist.y < leftShoulder.y;
  }

  isRightHandUp(landmarks: NormalizedLandmark[]) {
    const rightShoulder = landmarks[12];
    const rightWrist = landmarks[16];

    if (!this.isVisible(rightShoulder) || !this.isVisible(rightWrist)) {
      return false;
    }
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
