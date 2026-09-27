import { AfterViewInit, Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { PoseService } from '../../services/pose-service';
import { GestureDetectService } from '../../services/gesture-detect-service';
import { GameService } from '../../services/game-service';
import { Gesture } from '../../models/gesture';
import { GameState } from '../../models/game-state';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo, faBolt, faArrowRight, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { ScoreService } from '../../services/score-service';
import { CreateScoreRequest } from '../../models/create-score-request';
import { LeaderboardComponent } from '../leaderboard/leaderboard-component';
import { GameOverComponent } from '../game-over/game-over-component';

@Component({
  selector: 'app-game',
  imports: [FontAwesomeModule, LeaderboardComponent, GameOverComponent],
  templateUrl: './game-component.html',
  styleUrl: './game-component.css',
})
export class GameComponent implements AfterViewInit {
  readonly faCircleInfo = faCircleInfo;
  readonly faBolt = faBolt;
  readonly faArrowRight = faArrowRight;
  readonly faTrophy = faTrophy;
  readonly GameState = GameState;

  private poseService = inject(PoseService);
  private gestureDetectService = inject(GestureDetectService);
  private gameService = inject(GameService);
  private scoreService = inject(ScoreService);

  @ViewChild('video')
  video!: ElementRef<HTMLVideoElement>;

  gameState = signal(GameState.IDLE);

  score = signal(0);
  lives = signal(3);
  streak = signal(0);

  playerInitials = signal('');
  scoreQualifies = signal<boolean | null>(null);
  scoreSubmitted = signal(false);

  scoreSubmitError = signal(false);
  scoreSubmitting = signal(false);

  currentCommand = signal(Gesture.NONE);
  detectedGesture = signal(Gesture.NONE);

  roundTime = signal(3);
  timeRemaining = signal(3);
  countdown = signal(3);

  cameraReady = signal(false);
  cameraError = signal<string | null>(null);
  feedback = signal<'success' | 'failure' | null>(null);

  showInstructions = signal(false);
  showLeaderboard = signal(false);

  initialsValid(): boolean {
    return /^[A-Z]{2,3}$/.test(this.playerInitials());
  }

  async ngAfterViewInit() {
    try {
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
      this.cameraReady.set(true);
      this.detectPose();
    } catch (err) {
      console.error('Camera setup unsuccessful:', err);

      this.cameraReady.set(false);
      this.cameraError.set(
        `Camera access is required to play.
        Please allow camera access and reload the page.`
      );
    }
  }

  startGame() {
    this.score.set(0);
    this.streak.set(0);
    this.lives.set(3);
    this.roundTime.set(3);
    this.timeRemaining.set(3);
    this.countdown.set(3);

    this.scoreSubmitted.set(false);
    this.scoreSubmitError.set(false);
    this.scoreSubmitting.set(false);
    this.scoreQualifies.set(null);
    this.playerInitials.set('');

    this.gameState.set(GameState.COUNTDOWN);
    this.startCountdown();
  }

  resetGame() {
    this.score.set(0);
    this.lives.set(3);
    this.roundTime.set(3);
    this.timeRemaining.set(3);
    this.currentCommand.set(Gesture.NONE);

    this.playerInitials.set('');
    this.scoreSubmitted.set(false);
    this.scoreSubmitError.set(false);
    this.scoreSubmitting.set(false);
    this.scoreQualifies.set(null);

    this.gameState.set(GameState.IDLE);
  }

  submitScore() {
    if (!this.initialsValid() || this.scoreSubmitting()) {
      return;
    }

    const request: CreateScoreRequest = {
      playerInitials: this.playerInitials(),
      score: this.score()
    };

    this.scoreSubmitting.set(true);
    this.scoreSubmitError.set(false);

    this.scoreService.createScore(request).subscribe({
      next: (savedScore) => {
        console.log('Score saved:', savedScore);
        this.scoreSubmitted.set(true);
        this.scoreSubmitting.set(false);
      },
      error: (error) => {
        console.error('Failed to save score:', error);
        this.scoreSubmitError.set(true);
        this.scoreSubmitting.set(false);
      }
    });
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

  private evaluateRound() {
    const success = this.gameService.evaluateRound(
      this.currentCommand(),
      this.detectedGesture()
    );

    if (success) {
      this.feedback.set('success');
      this.streak.update(streak => streak + 1);

      const points = Math.min(this.streak() * 10, 100);
      this.score.update(score => score + points);

      this.roundTime.update(time => Math.max(0.8, time - 0.1));
    } else {
      this.feedback.set('failure');
      this.streak.set(0);
      this.lives.update(lives => lives - 1);
      if (this.lives() === 0) { 
        this.gameState.set(GameState.GAME_OVER);
        this.checkScoreQualification();
        return;
      }
    }

    this.currentCommand.set(this.gameService.getRandomCommand(this.currentCommand()));
    this.timeRemaining.set(this.roundTime());
    this.startTimer();

    setTimeout(() => {
      this.feedback.set(null);
    }, 700);
  }

  private startCountdown() {
    const countdownTimer = setInterval(() => {
      this.countdown.update(count => count - 1);

      if (this.countdown() <= 0) {
        clearInterval(countdownTimer);
        this.gameState.set(GameState.PLAYING);
        this.currentCommand.set(this.gameService.getRandomCommand(this.currentCommand()));
        this.startTimer();
      }
    }, 1000);
  }

  private checkScoreQualification() {
    this.scoreQualifies.set(null);

    this.scoreService.qualifiesForTop10(this.score()).subscribe({
      next: (qualifies) => {
        this.scoreQualifies.set(qualifies);
      },
      error: (error) => {
        console.error('Failed to check score qualification:', error);
        this.scoreQualifies.set(false);
      }
    })
  }
}