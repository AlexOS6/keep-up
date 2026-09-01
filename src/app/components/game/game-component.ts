import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PoseService } from '../../services/pose-service';
import { GestureDetectService } from '../../services/gesture-detect-service';

@Component({
  selector: 'app-game',
  templateUrl: './game-component.html',
  styleUrl: './game-component.css',
})
export class GameComponent implements AfterViewInit {

  private poseService = inject(PoseService);
  private gestureDetectService = inject(GestureDetectService);

  @ViewChild('video')
  video!: ElementRef<HTMLVideoElement>;

  score = 0;
  timeRemaining = 3;
  currentCommand = "Raise both hands";
  detectedGesture = 'NONE';

  async ngAfterViewInit() {
    const stream = await navigator.mediaDevices.getUserMedia({video: true});

    const videoElement = this.video.nativeElement;
    videoElement.srcObject = stream;

    await new Promise<void>((resolve) => {
      videoElement.onloadedmetadata = () => {
        resolve();
      }
    });

    await videoElement.play();
    await this.poseService.loadMediaPipe();
    this.detectPose();
  }

  startGame() {
    this.score;
    this.timeRemaining;
    this.currentCommand;
  }

  private detectPose() {
    const videoElement = this.video.nativeElement;
    const result = this.poseService.detect(videoElement);

    const landmarks = result?.landmarks[0];

    if (landmarks) {
      const gesture =
      this.gestureDetectService.detectGesture(landmarks);

      console.log('Detected Gesture:', gesture);
    }

    requestAnimationFrame(() => this.detectPose());
  }
}