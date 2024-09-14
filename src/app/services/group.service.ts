import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { User } from '../models/user';
import { Group } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://127.0.0.1:8000/api/groups';
  constructor(private http: HttpClient) { }

  getGroups(): Observable<{ data: Group[] }> {
    return this.http.get<{ data: Group[] }>(this.apiUrl);
  }
}