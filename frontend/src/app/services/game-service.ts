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

  getRandomCommand(currentCommand?: Gesture) {
    const availableCommands = this.commands.filter(
    command => command !== currentCommand
  );

    const randomIndex = Math.floor(
      Math.random() * availableCommands.length
    );

    return availableCommands[randomIndex];
  }

  evaluateRound(command: Gesture, detectedGesture: Gesture) {
    return command === detectedGesture;
  }
}
