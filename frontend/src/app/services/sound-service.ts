import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SoundService {

  private successSound = new Audio('/sounds/success.mp3');
  private failureSound = new Audio('/sounds/failure.mp3');
  private countdownSound = new Audio('/sounds/countdown.mp3');
  private goSound = new Audio('/sounds/go.mp3');
  private highScoreSound = new Audio('/sounds/highscore.mp3');

  playSuccess() {
    this.successSound.currentTime = 0;
    this.successSound.play();
  }

  playFailure() {
    this.failureSound.currentTime = 0;
    this.failureSound.play();
  }

  playCountdown() {
    this.countdownSound.currentTime = 0;
    this.countdownSound.play();
  }

  playGo() {
    this.goSound.currentTime = 0;
    this.goSound.play();
  }

  playHighScore() {
    this.highScoreSound.currentTime = 0;
    this.highScoreSound.play();
  }
}
