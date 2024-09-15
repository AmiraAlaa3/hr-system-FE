import { Holidays } from './../models/ihoildays';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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


  createHoliday(hoilday: any){
    return this.http.post(this.apiUrl, hoilday);
  }

  updateHoliday(id: number, hoilday: any){
    return this.http.put(`${this.apiUrl}/${id}`, hoilday);
  }

  deleteHoliday(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
