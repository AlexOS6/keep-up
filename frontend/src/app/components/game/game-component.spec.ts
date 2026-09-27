import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { GameComponent } from './game-component';
import { ScoreService } from '../../services/score-service';
import { PoseService } from '../../services/pose-service';
import { GestureDetectService } from '../../services/gesture-detect-service';
import { GameService } from '../../services/game-service';
import { GameState } from '../../models/game-state';

describe('Game', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  const mockScoreService = {
    createScore: vi.fn()
  };

  const mockPoseService = {
    loadMediaPipe: vi.fn(),
    detect: vi.fn()
  };

  const mockGestureDetectService = {
    detectGesture: vi.fn()
  };

  const mockGameService = {
    getRandomCommand: vi.fn(),
    evaluateRound: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        {
          provide: ScoreService,
          useValue: mockScoreService
        },
        {
          provide: PoseService,
          useValue: mockPoseService
        },
        {
          provide: GestureDetectService,
          useValue: mockGestureDetectService
        },
        {
          provide: GameService,
          useValue: mockGameService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept valid initials', () => {
    component.playerInitials.set('AOS');
    expect(component.initialsValid()).toBe(true);
  });

  it('should reject invalid initials', () => {
    component.playerInitials.set('A!');

    expect(component.initialsValid()).toBe(false);
  });

  it('should reject initials that are too short', () => {
    component.playerInitials.set('A');

    expect(component.initialsValid()).toBe(false);
  });

  it('should submit a valid score', () => {
    component.playerInitials.set('AOS');
    component.score.set(700);

    const savedScore = {
      id: 1,
      playerInitials: 'AOS',
      score: 700
    };

    mockScoreService.createScore.mockReturnValue(of(savedScore));
    component.submitScore();

    expect(mockScoreService.createScore).toHaveBeenCalledWith({
      playerInitials: 'AOS',
      score: 700
    });

    expect(component.scoreSubmitted()).toBe(true);
    expect(component.scoreSubmitting()).toBe(false);
    expect(component.scoreSubmitError()).toBe(false);
  });
  
  it('should handle an error when submitting a score', () => {
    component.playerInitials.set('AOS');
    component.score.set(700);

    mockScoreService.createScore.mockReturnValue(
      throwError(() => new Error('Failed to save score'))
    );

    component.submitScore();

    expect(component.scoreSubmitted()).toBe(false);
    expect(component.scoreSubmitError()).toBe(true);
    expect(component.scoreSubmitting()).toBe(false);
  });

  it('should not submit a score with invalid initials', () => {
    component.playerInitials.set('A1');
    component.score.set(700);

    component.submitScore();

    expect(mockScoreService.createScore).not.toHaveBeenCalled();
  });

  it('should not submit while a score is already being submitted', () => {
    component.playerInitials.set('AOS');
    component.scoreSubmitting.set(true);

    component.submitScore();

    expect(mockScoreService.createScore).not.toHaveBeenCalled();
  });
});