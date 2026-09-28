import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCameraComponent } from './game-camera-component';

describe('GameCameraComponent', () => {
  let component: GameCameraComponent;
  let fixture: ComponentFixture<GameCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameCameraComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameCameraComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
