import { TestBed } from '@angular/core/testing';
import { Gesture } from '../models/gesture'
import { GameService } from './game-service';

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true when gestures match', () => {
    const result = service.evaluateRound(
      Gesture.LEFT_HAND_UP,
      Gesture.LEFT_HAND_UP
    );

    expect(result).toBe(true);
  });

  it('should return false when gestures do not match', () => {
    const result = service.evaluateRound(
      Gesture.LEFT_HAND_UP,
      Gesture.RIGHT_HAND_UP
    );

    expect(result).toBe(false);
  });

  it('should not return the current command', () => {
    const currentCommand = Gesture.LEFT_HAND_UP;
    const result = service.getRandomCommand(currentCommand);
    expect(result).not.toBe(currentCommand);
  })
});
