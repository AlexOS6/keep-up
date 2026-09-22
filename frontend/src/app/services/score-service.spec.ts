import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Score } from '../models/score';
import { CreateScoreRequest } from '../models/create-score-request';

import { ScoreService } from './score-service';

describe('ScoreService', () => {
  let service: ScoreService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ScoreService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a score', () => {
    const createScoreRequest: CreateScoreRequest = {
      playerInitials: 'AOS',
      score: 700
    };

    const mockScore: Score = {
      id: 1,
      playerInitials: 'AOS',
      score: 700
    };

    service.createScore(createScoreRequest).subscribe((score) => {
      expect(score).toEqual(mockScore);
    });

    const testReq = httpTesting.expectOne(
      'http://localhost:8080/scores'
    );

    expect(testReq.request.method).toBe('POST');
    expect(testReq.request.body).toEqual(createScoreRequest);

    testReq.flush(mockScore);
  });

  it('should get top scores', () => {
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

    service.getTopScores().subscribe((scores) => {
      expect(scores).toEqual(mockScores);
    });

    const testReq = httpTesting.expectOne('http://localhost:8080/scores');
    expect(testReq.request.method).toBe('GET');
    testReq.flush(mockScores);
  });
});
