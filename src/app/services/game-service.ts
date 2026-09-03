import { Injectable } from '@angular/core';
import { Gesture } from '../models/gesture'

@Injectable({
  providedIn: 'root',
})
export class GameService {

  private readonly commands: Gesture[] = [
    Gesture.LEFT_HAND_UP,
    Gesture.RIGHT_HAND_UP,
    Gesture.BOTH_HANDS_UP
  ];

  getRandomCommand() {
    const randomIndex = Math.floor(
      Math.random() * this.commands.length
    );

    return this.commands[randomIndex];
  }

  evaluateRound(command: Gesture, detectedGesture: Gesture) {
    return command === detectedGesture;
  }
}
