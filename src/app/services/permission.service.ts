import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Permission } from '../models/permission';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private apiUrl = 'http://127.0.0.1:8000/api/permissions';

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  createPermission(permissionData: Permission): Observable<any> {
    return this.http.post(this.apiUrl, permissionData, { headers: this.getAuthHeaders() });
  }

};


