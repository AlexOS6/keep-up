import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { PoseService } from '../../services/pose-service';
import { GestureDetectService } from '../../services/gesture-detect-service';
import { GameService } from '../../services/game-service';
import { Gesture } from '../../models/gesture';
import { GameState } from '../../models/game-state';

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

   readonly GameState = GameState;

  score = signal(0);
  roundTime = signal(3);
  timeRemaining = signal(3);
  currentCommand = signal(Gesture.NONE);
  detectedGesture = signal(Gesture.NONE);
  countdown = signal(3);

  gameState = signal(GameState.IDLE);

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
    this.roundTime.set(3);
    this.timeRemaining.set(3);
    this.countdown.set(3);
    this.gameState.set(GameState.COUNTDOWN);
    this.startCountdown();
  }

  resetGame() {
    this.score.set(0);
    this.roundTime.set(3);
    this.timeRemaining.set(3);
    this.currentCommand.set(Gesture.NONE);
    this.gameState.set(GameState.IDLE);
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
        this.gameService.getRandomCommand(this.currentCommand())
      );

      this.roundTime.update(time => Math.max(0.8, time - 0.1));
      this.timeRemaining.set(this.roundTime());
      this.startTimer();
    } else {
      this.gameState.set(GameState.GAME_OVER);
    }
  }
  
  private startTimer() {
    const startTime = performance.now();

    const updateTimer = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;
      const remainingTime = this.roundTime() - elapsedTime;
      
      if (remainingTime <= 0) {
        this.timeRemaining.set(0);
        this.evaluateRound();
        return;
      }

      this.timeRemaining.set(remainingTime);
      requestAnimationFrame(updateTimer);
    };

  requestAnimationFrame(updateTimer);
  }

  private startCountdown() {
    const countdownTimer = setInterval(() => {
      this.countdown.update(count => count - 1);

      if (this.countdown() <= 0) {
        clearInterval(countdownTimer);
        this.gameState.set(GameState.PLAYING);
        this.currentCommand.set(this.gameService.getRandomCommand());
        this.startTimer();
      }
    }, 1000);
  }
}