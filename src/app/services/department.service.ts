// department.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/idepartment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://127.0.0.1:8000/api/departments';

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getDepartments(): Observable<{ data: Department[] }> {
    return this.http.get<{ data: Department[] }>(this.apiUrl , { headers: this.getAuthHeaders() });
  }

  getDepartment(id: number): Observable<{ data: Department[] }> {
    return this.http.get<{ data: Department[] }>(`${this.apiUrl}/${id}` ,  { headers: this.getAuthHeaders() });
  }


  createDepartment(department: any){
    return this.http.post(this.apiUrl, department , { headers: this.getAuthHeaders() });
  }

  updateDepartment(id: number, department: any){
    return this.http.put(`${this.apiUrl}/${id}`, department, { headers: this.getAuthHeaders() });
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  searchDepartments(name: string): Observable<{ data: Department[] }> {
    return this.http.get<{ data: Department[] }>(`${this.apiUrl}?name=${name}`, { headers: this.getAuthHeaders() });
  }
}
