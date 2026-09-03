import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { PoseService } from '../../services/pose-service';
import { GestureDetectService } from '../../services/gesture-detect-service';
import { GameService } from '../../services/game-service';
import { Gesture } from '../../models/gesture';

@Component({
  selector: 'app-game',
  templateUrl: './game-component.html',
  styleUrl: './game-component.css',
})
export class GameComponent implements AfterViewInit {

  private poseService = inject(PoseService);
  private gestureDetectService = inject(GestureDetectService);
  private gameService = inject(GameService);

  @ViewChild('video')
  video!: ElementRef<HTMLVideoElement>;

  score = signal(0);
  timeRemaining = signal(3);
  currentCommand = signal(Gesture.NONE);
  detectedGesture = signal(Gesture.NONE);
  isGameRunning = signal(false);

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
    this.score.set(0);
    this.timeRemaining.set(3);
    this.isGameRunning.set(true);
    this.currentCommand.set(this.gameService.getRandomCommand());
    this.startTimer();
  }

  private detectPose() {
    const videoElement = this.video.nativeElement;
    const result = this.poseService.detect(videoElement);

    const landmarks = result?.landmarks[0];

    if (landmarks) {
      this.detectedGesture.set(this.gestureDetectService.detectGesture(landmarks));
    }

    requestAnimationFrame(() => this.detectPose());
  }

  private evaluateRound() {
    const success = this.gameService.evaluateRound(
      this.currentCommand(),
      this.detectedGesture()
    );

    if (success) {
      this.score.update(score => score + 1);

      this.currentCommand.set(
        this.gameService.getRandomCommand()
      );

      this.timeRemaining.set(3);
      this.startTimer();
    } else {
      this.isGameRunning.set(false);
    }
  }

  private startTimer() {
    const timer = setInterval(() => {
      this.timeRemaining.update(time => time -1);

      if (this.timeRemaining() == 0) {
        clearInterval(timer);
        this.evaluateRound();
      }
    }, 1000);
  }

}