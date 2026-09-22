import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { LeaderboardComponent } from './leaderboard-component';
import { Score } from '../../models/score';
import { ScoreService } from '../../services/score-service';

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;

  const mockScoreService = {
    getTopScores: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockScoreService.getTopScores.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [LeaderboardComponent],
      providers: [
        {
          provide: ScoreService,
          useValue: mockScoreService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load scores', () => {
    const mockScores: Score[] = [
      {
        id: 1,
        playerInitials: 'AOS',
        score: 700
      },
      {
        id: 2,
        playerInitials: 'AOC',
        score: 500
      }
    ];

    mockScoreService.getTopScores.mockReturnValue(of(mockScores));
    component.loadScores();
    expect(component.scores()).toEqual(mockScores);
    expect(component.loading()).toBe(false);
    expect(component.error()).toBe(false);
  });

  it('should handle an error when loading scores', () => {
    mockScoreService.getTopScores.mockReturnValue(
      throwError (() => new Error('Failed to load scores'))
    );

    component.loadScores();

    expect(component.error()).toBe(true);
    expect(component.loading()).toBe(false);
  })
});
