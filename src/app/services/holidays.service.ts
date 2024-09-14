import { Holidays } from '../models/iholidays';
// department.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/idepartment';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {
  private apiUrl = 'http://127.0.0.1:8000/api/holidays';

  constructor(private http: HttpClient) { }

  getHolidays(): Observable<{ data: Holidays[] }> {
    return this.http.get<{ data: Holidays[] }>(this.apiUrl);
  }

  getHoliday(id: number): Observable<{ data: Holidays[] }> {
    return this.http.get<{ data: Holidays[] }>(`${this.apiUrl}/${id}`);
  }


  createHoliday(Holidays: any){
    return this.http.post(this.apiUrl, Holidays);
  }

  updateHoliday(id: number, Holidays: any){
    return this.http.put(`${this.apiUrl}/${id}`, Holidays);
  }

  deleteHoliday(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
