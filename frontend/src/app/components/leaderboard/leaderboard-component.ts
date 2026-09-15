import { Component, inject, OnInit, signal } from '@angular/core';
import { ScoreService } from '../../services/score-service';
import { Score } from '../../models/score';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard-component.html',
  styleUrl: './leaderboard-component.css',
  imports: [FaIconComponent]
})
export class LeaderboardComponent implements OnInit {
  private scoreService = inject(ScoreService);

  scores = signal<Score[]>([]);
  loading = signal(false);
  error = signal(false);

  readonly faRotateRight = faRotateRight;

  ngOnInit() {
    this.loadScores();
  }

  loadScores() {
    this.loading.set(true);
    this.error.set(false);

    this.scoreService.getTopScores().subscribe({
      next: (scores) => {
        this.scores.set(scores);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load leaderboard:', error);
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }
}