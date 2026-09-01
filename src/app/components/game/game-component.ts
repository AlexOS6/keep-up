import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PoseService } from '../../services/pose-service';

@Component({
  selector: 'app-game',
  templateUrl: './game-component.html',
  styleUrl: './game-component.css',
})
export class GameComponent implements AfterViewInit {

  private poseService = inject(PoseService);

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
      const leftShoulder = landmarks[11];
      const leftWrist = landmarks[15];

      const leftHandUp = leftWrist.y < leftShoulder.y;

      console.log('Left hand up:', leftHandUp)
    }

    requestAnimationFrame(() => this.detectPose());
  }
}