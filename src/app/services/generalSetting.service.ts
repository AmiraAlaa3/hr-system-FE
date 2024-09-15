import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { General } from '../models/general';  // Correct this path

@Injectable({
  providedIn: 'root'
})
export class GeneralSettingService {
  private apiUrl = 'http://127.0.0.1:8000/api/weekend/1';

  constructor(private http: HttpClient) {}

  getGeneralSettings(): Observable<{ data: General[] }> {
    return this.http.get<{ data: General[] }>(this.apiUrl);
  }
}