import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-game-over',
  imports: [FontAwesomeModule],
  templateUrl: './game-over-component.html',
  styleUrl: './game-over-component.css',
})
export class GameOverComponent {
  score = input.required<number>();
  scoreQualifies = input.required<boolean | null>();

  playerInitials = input.required<string>();
  scoreSubmitted = input.required<boolean>();
  scoreSubmitting = input.required<boolean>();
  scoreSubmitError = input.required<boolean>();
  initialsValid = input.required<boolean>();

  initialsChanged = output<string>();
  submit = output<void>();
  playAgain = output<void>();

  faArrowRight = faArrowRight;
}
