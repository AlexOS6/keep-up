import { Injectable } from '@angular/core';
import { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Gesture } from '../models/gesture';

@Injectable({
  providedIn: 'root',
})
export class GestureDetectService {

  private isVisible(landmark: NormalizedLandmark) {
    return (landmark.visibility ?? 0) > 0.6;
  }

  private isLeftHandUp(landmarks: NormalizedLandmark[]) {
    const leftShoulder = landmarks[11];
    const leftWrist = landmarks[15];

    if (!this.isVisible(leftShoulder) || !this.isVisible(leftWrist)) {
      return false;
    }

    return leftWrist.y < leftShoulder.y;
  }

  private isRightHandUp(landmarks: NormalizedLandmark[]) {
    const rightShoulder = landmarks[12];
    const rightWrist = landmarks[16];

    if (!this.isVisible(rightShoulder) || !this.isVisible(rightWrist)) {
      return false;
    }
    return rightWrist.y < rightShoulder.y;
  }

  private isLeftArmOut(landmarks: NormalizedLandmark[]) {
    const leftShoulder = landmarks[11];
    const leftElbow = landmarks[13];
    const leftWrist = landmarks[15];

    if (
      !this.isVisible(leftShoulder) ||
      !this.isVisible(leftElbow) ||
      !this.isVisible(leftWrist)
    ) {
      return false;
    }

    const verticalTolerance = 0.22;

    const armLevel =
      Math.abs(leftWrist.y - leftShoulder.y) < verticalTolerance &&
      Math.abs(leftElbow.y - leftShoulder.y) < verticalTolerance;

    const armExtended =
      leftWrist.x > leftElbow.x &&
      leftElbow.x > leftShoulder.x;

    return armLevel && armExtended;
  }

  private isRightArmOut(landmarks: NormalizedLandmark[]) {
    const rightShoulder = landmarks[12];
    const rightElbow = landmarks[14];
    const rightWrist = landmarks[16];

    if (
      !this.isVisible(rightShoulder) || 
      !this.isVisible(rightElbow) || 
      !this.isVisible(rightWrist)
    ) {
      return false;
    }

    const verticalTolerance = 0.22;

    const armLevel =
      Math.abs(rightWrist.y - rightShoulder.y) < verticalTolerance &&
      Math.abs(rightElbow.y - rightShoulder.y) < verticalTolerance;

    const armExtended = 
      rightWrist.x < rightElbow.x && 
      rightElbow.x < rightShoulder.x;

    return armLevel && armExtended;
  }

  private isHandsTogether(landmarks: NormalizedLandmark[]) {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];

    if (
      !this.isVisible(leftShoulder) || 
      !this.isVisible(rightShoulder) || 
      !this.isVisible(leftWrist) || 
      !this.isVisible(rightWrist)
    ) {
      return false;
    }

    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    const wristXDistance = Math.abs(leftWrist.x - rightWrist.x);
    const wristYDistance = Math.abs(leftWrist.y - rightWrist.y);

    return (
      wristXDistance < shoulderWidth * 0.5 &&
      wristYDistance < shoulderWidth * 0.5
    );
  }

  detectGesture(landmarks: NormalizedLandmark[]) {
    if (this.isHandsTogether(landmarks)) {
      return Gesture.HANDS_TOGETHER;
    }

    const leftArmOut = this.isLeftArmOut(landmarks);
    const rightArmOut = this.isRightArmOut(landmarks);

    if (leftArmOut && rightArmOut) {
      return Gesture.BOTH_ARMS_OUT;
    }

    if (leftArmOut) {
      return Gesture.LEFT_ARM_OUT;
    }

    if (rightArmOut) {
      return Gesture.RIGHT_ARM_OUT;
    }

    const leftHandUp = this.isLeftHandUp(landmarks);
    const rightHandUp = this.isRightHandUp(landmarks);

    if (leftHandUp && rightHandUp) {
      return Gesture.BOTH_HANDS_UP;
    }

    if (leftHandUp) {
      return Gesture.LEFT_HAND_UP;
    }

    if (rightHandUp) {
      return Gesture.RIGHT_HAND_UP;
    }

    return Gesture.NONE;
  }
}
