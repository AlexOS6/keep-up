import { TestBed } from '@angular/core/testing';
import { NormalizedLandmark } from '@mediapipe/tasks-vision';

import { GestureDetectService } from './gesture-detect-service';
import { Gesture } from '../models/gesture';

describe('GestureDetectService', () => {
  let service: GestureDetectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestureDetectService);
  });

  function landmark(x = 0, y = 0, visibility = 1): NormalizedLandmark {
    return {
      x,
      y,
      z: 0,
      visibility
    };
  }

  function createLandmarks(): NormalizedLandmark[] {
    return Array.from({ length: 33 }, () => landmark());
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return LEFT_HAND_UP when left hand is up', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.7, 0.5);
    landmarks[12] = landmark(0.3, 0.5);
    landmarks[15] = landmark(0.7, 0.3);
    landmarks[16] = landmark(0.3, 0.7);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.LEFT_HAND_UP);
  });

  it('should return NONE when left wrist is not visible', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.7, 0.5);
    landmarks[12] = landmark(0.3, 0.5);
    landmarks[15] = landmark(0.7, 0.3, 0.4);
    landmarks[16] = landmark(0.3, 0.7);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.NONE);
  });

  it('should return RIGHT_HAND_UP when right hand is up', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.7, 0.5);
    landmarks[12] = landmark(0.3, 0.5);
    landmarks[15] = landmark(0.7, 0.7);
    landmarks[16] = landmark(0.3, 0.3);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.RIGHT_HAND_UP);
  });

  it('should return NONE when right wrist is not visible', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.7, 0.5);
    landmarks[12] = landmark(0.3, 0.5);
    landmarks[15] = landmark(0.7, 0.7);
    landmarks[16] = landmark(0.3, 0.3, 0.4);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.NONE);
  });

  it('should return BOTH_HANDS_UP when both hands are up', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.7, 0.5);
    landmarks[12] = landmark(0.3, 0.5);
    landmarks[15] = landmark(0.7, 0.3);
    landmarks[16] = landmark(0.3, 0.3);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.BOTH_HANDS_UP);
  });

  it('should return NONE when wrists are below shoulders', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.7, 0.5);
    landmarks[12] = landmark(0.3, 0.5);
    landmarks[15] = landmark(0.7, 0.7);
    landmarks[16] = landmark(0.3, 0.7);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.NONE);
  });

  it('should return LEFT_ARM_OUT when left arm is out', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.5, 0.5);
    landmarks[13] = landmark(0.6, 0.5);
    landmarks[15] = landmark(0.7, 0.5);

    landmarks[12] = landmark(0.3, 0.5);
    landmarks[16] = landmark(0.3, 0.7);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.LEFT_ARM_OUT);
  });

  it('should return RIGHT_ARM_OUT when right arm is out', () => {
    const landmarks = createLandmarks();

    landmarks[12] = landmark(0.5, 0.5);
    landmarks[14] = landmark(0.4, 0.5);
    landmarks[16] = landmark(0.3, 0.5);

    landmarks[11] = landmark(0.7, 0.5);
    landmarks[15] = landmark(0.7, 0.7);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.RIGHT_ARM_OUT);
  });

  it('should return BOTH_ARMS_OUT when both arms are out', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.6, 0.5);
    landmarks[13] = landmark(0.7, 0.5);
    landmarks[15] = landmark(0.8, 0.5);

    landmarks[12] = landmark(0.4, 0.5);
    landmarks[14] = landmark(0.3, 0.5);
    landmarks[16] = landmark(0.2, 0.5);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.BOTH_ARMS_OUT);
  });

  it('should return NONE when arm is not extended', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.5, 0.5);
    landmarks[13] = landmark(0.6, 0.5);
    landmarks[15] = landmark(0.55, 0.5);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.NONE);
  });

  it('should return NONE when arm is not level', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.5, 0.5);
    landmarks[13] = landmark(0.6, 0.5);
    landmarks[15] = landmark(0.7, 0.8);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.NONE);
  });

  it('should return HANDS_TOGETHER when hands are together', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.7, 0.5);
    landmarks[12] = landmark(0.3, 0.5);
    landmarks[15] = landmark(0.52, 0.5);
    landmarks[16] = landmark(0.48, 0.5);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.HANDS_TOGETHER);
  });

  it('should return NONE when hands are too far apart', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.7, 0.3);
    landmarks[12] = landmark(0.3, 0.3);
    landmarks[15] = landmark(0.7, 0.7);
    landmarks[16] = landmark(0.3, 0.7);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.NONE);
  });

  it('should return NONE when no gesture is detected', () => {
    const landmarks = createLandmarks();

    landmarks[11] = landmark(0.7, 0.3);
    landmarks[12] = landmark(0.3, 0.3);
    landmarks[13] = landmark(0.65, 0.5);
    landmarks[14] = landmark(0.35, 0.5);
    landmarks[15] = landmark(0.7, 0.7);
    landmarks[16] = landmark(0.3, 0.7);

    expect(service.detectGesture(landmarks))
      .toBe(Gesture.NONE);
  });
});
