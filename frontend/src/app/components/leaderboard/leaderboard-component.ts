import { Component, inject, OnInit, signal } from '@angular/core';
import { ScoreService } from '../../services/score-service';
import { Score } from '../../models/score';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard-component.html',
  styleUrl: './leaderboard-component.css'
})
export class LeaderboardComponent implements OnInit {
  private scoreService = inject(ScoreService);

  scores = signal<Score[]>([]);

  ngOnInit() {
    this.loadScores();
  }

  loadScores() {
    this.scoreService.getTopScores().subscribe({
      next: (scores) => {
        this.scores.set(scores);
      },
      error: (error) => {
        console.error('Failed to load leaderboard:', error);
      }
    });
  }
}