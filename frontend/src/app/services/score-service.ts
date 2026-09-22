import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Score } from '../models/score'
import { CreateScoreRequest } from '../models/create-score-request';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/scores`;
  
  createScore(request: CreateScoreRequest): Observable<Score> {
    return this.http.post<Score>(this.apiUrl, request);
  }

  getTopScores(): Observable<Score[]> {
    return this.http.get<Score[]>(this.apiUrl);
  }
}
