import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solution } from '../../schemas/solutions';
import { CreateProblemResultDTO, Problem } from '../../schemas/problems';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = '/api'; // proxy

  constructor(private http: HttpClient) {}

  // test endpoint
  getHello(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.baseUrl}/test`);
  }

  getProblems(): Observable<Problem[]> {
    return this.http.get<Problem[]>(`${this.baseUrl}/problems`);
  }

  getProblem(id: number): Observable<Problem> {
    return this.http.get<Problem>(`${this.baseUrl}/problems/${id}`);
  }

  createProblem(problem: Problem): Observable<CreateProblemResultDTO> {
    return this.http.post<CreateProblemResultDTO>(`${this.baseUrl}/problems`, problem);
  }

  getSolutions(): Observable<Solution[]> {
    return this.http.get<Solution[]>(`${this.baseUrl}/solutions`);
  }

  getSolutionsForProblem(problemId: number): Observable<Solution> {
    return this.http.get<Solution>(`${this.baseUrl}/solutions/problem/${problemId}`);
  }
}
