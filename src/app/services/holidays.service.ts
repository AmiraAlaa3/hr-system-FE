import { Holidays } from '../models/iholidays';
// department.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/idepartment';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {
  private apiUrl = 'http://127.0.0.1:8000/api/holidays';

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getHolidays(): Observable<{ data: Holidays[] }> {
    return this.http.get<{ data: Holidays[] }>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getHoliday(id: number): Observable<{ data: Holidays[] }> {
    return this.http.get<{ data: Holidays[] }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }


  createHoliday(Holidays: any){
    return this.http.post(this.apiUrl, Holidays,{ headers: this.getAuthHeaders() });
  }

  updateHoliday(id: number, Holidays: any){
    return this.http.put(`${this.apiUrl}/${id}`, Holidays,{ headers: this.getAuthHeaders() });
  }

  deleteHoliday(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`,{ headers: this.getAuthHeaders() });
  }
}
