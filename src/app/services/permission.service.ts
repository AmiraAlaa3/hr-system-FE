import { Permission } from './../models/permission';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private apiUrl = 'http://127.0.0.1:8000/api/permissions'; // API endpoint

  constructor(private http: HttpClient) {}

  createPermission(permission: Permission): Observable<Permission> {
    return this.http.post<Permission>(this.apiUrl, permission);
  }
  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.apiUrl);
  }
}
