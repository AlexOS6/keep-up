import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Score } from '../models/score'
import { CreateScoreRequest } from '../models/create-score-request';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/scores';
  
  createScore(request: CreateScoreRequest): Observable<Score> {
    return this.http.post<Score>(this.apiUrl, request);
  }
}
