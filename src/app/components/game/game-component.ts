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
    const result = this.poseService.detect(videoElement);
    console.log(result);
  }

  startGame() {
    this.score;
    this.timeRemaining;
    this.currentCommand;
  }
}
