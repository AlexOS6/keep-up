import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameOverComponent } from './game-over-component';

describe('GameOverComponent', () => {
  let component: GameOverComponent;
  let fixture: ComponentFixture<GameOverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameOverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameOverComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('score', 700);
    fixture.componentRef.setInput('scoreQualifies', false);
    fixture.componentRef.setInput('scoreQualificationError', false);
    fixture.componentRef.setInput('playerInitials', '');
    fixture.componentRef.setInput('scoreSubmitted', false);
    fixture.componentRef.setInput('scoreSubmitting', false);
    fixture.componentRef.setInput('scoreSubmitError', false);
    fixture.componentRef.setInput('initialsValid', false);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show initials entry when score qualifies', () => {
    fixture.componentRef.setInput('scoreQualifies', true);

    fixture.detectChanges();
  
    const compiled = fixture.nativeElement as HTMLElement;
  
    expect(compiled.textContent).toContain('HIGH SCORE!');
    expect(compiled.querySelector('#player-initials')).toBeTruthy();
  });
  
  it('should not show initials entry when score does not qualify', () => {
    fixture.componentRef.setInput('scoreQualifies', false);
  
    fixture.detectChanges();
  
    const compiled = fixture.nativeElement as HTMLElement;
  
    expect(compiled.textContent).not.toContain('HIGH SCORE!');
    expect(compiled.querySelector('#player-initials')).toBeNull();
  });
    
  it('should show checking message while score qualification is pending', () => {
    fixture.componentRef.setInput('scoreQualifies', null);
  
    fixture.detectChanges();
  
    const compiled = fixture.nativeElement as HTMLElement;
  
    expect(compiled.textContent).toContain('Checking leaderboard...');
  });

  it('should show an error when score qualification fails', () => {
    fixture.componentRef.setInput('scoreQualificationError', true);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Leaderboard unavailable');
  });
});
