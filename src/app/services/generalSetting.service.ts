import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { General } from '../models/general';  // Correct this path

@Injectable({
  providedIn: 'root'
})
export class GeneralSettingService {
  private apiUrl = 'http://127.0.0.1:8000/api/setting';

  constructor(private http: HttpClient) {}
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


  getGeneralSettings(): Observable<{ data: General[] }> {
    return this.http.get<{ data: General[] }>(this.apiUrl , { headers: this.getAuthHeaders()});
  }

  updateGeneralSetting(id: number, General: any){
    return this.http.put(`${this.apiUrl}/${id}`, General, { headers: this.getAuthHeaders() });
  }


}
