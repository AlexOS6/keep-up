import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game implements AfterViewInit {
  @ViewChild('video')
  video!: ElementRef<HTMLVideoElement>;

  score = 0;
  timeRemaining = 3;
  currentCommand = "Raise both hands";
  detectedGesture = 'NONE';

  async ngAfterViewInit() {
    const stream = await navigator.mediaDevices.getUserMedia({video: true});
    this.video.nativeElement.srcObject = stream;
  }

  startGame() {
    this.score;
    this.timeRemaining;
    this.currentCommand;
  }
}
