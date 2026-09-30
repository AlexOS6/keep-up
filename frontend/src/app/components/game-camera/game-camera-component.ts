import { AfterViewInit, Component, ElementRef, inject, output, signal, ViewChild } from '@angular/core';

import { PoseService } from '../../services/pose-service';
import { GestureDetectService } from '../../services/gesture-detect-service';
import { Gesture } from '../../models/gesture';

@Component({
  selector: 'app-game-camera',
  imports: [],
  templateUrl: './game-camera-component.html',
  styleUrl: './game-camera-component.css',
})
export class GameCameraComponent implements AfterViewInit {
  private poseService = inject(PoseService);
  private gestureDetectService = inject(GestureDetectService);

  @ViewChild('video')
  video!: ElementRef<HTMLVideoElement>;

  gestureDetected = output<Gesture>();
  cameraReady = output<boolean>();
  cameraError = output<string>();

  cameraLoaded = signal(false);

  async ngAfterViewInit() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      const videoElement = this.video.nativeElement;
      videoElement.srcObject = stream;

      await new Promise<void>((resolve) => {
        videoElement.onloadedmetadata = () => {
          resolve();
        };
      });

      await videoElement.play();
      await this.poseService.loadMediaPipe();

      this.cameraLoaded.set(true);
      this.cameraReady.emit(true);

      this.detectPose();
    } catch (error) {
      console.error('Camera setup unsuccessful:', error);
      this.cameraReady.emit(false);
      this.cameraError.emit(
        `Camera access is required to play.
        Allow camera access in browser settings and reload.`
      );
    }
  }

  private detectPose() {
    const videoElement = this.video.nativeElement;

    const result = this.poseService.detect(videoElement);
    const landmarks = result?.landmarks[0];

    if (landmarks) {
      const gesture = this.gestureDetectService.detectGesture(landmarks);
      this.gestureDetected.emit(gesture);
    }

    requestAnimationFrame(() => this.detectPose());
  }
}
