import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { User } from '../models/user';
import { Group } from '../models/group';
@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://127.0.0.1:8000/api/groups';
  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getGroups(): Observable<{ data: Group[] }> {
    return this.http.get<{ data: Group[] }>(this.apiUrl,{ headers: this.getAuthHeaders() });
  }
}
