// department.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/idepartment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = 'http://127.0.0.1:8000/api/departments';

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<{ data: Department[] }> {
    return this.http.get<{ data: Department[] }>(this.apiUrl);
  }

  getDepartment(id: number): Observable<{ data: Department[] }> {
    return this.http.get<{ data: Department[] }>(`${this.apiUrl}/${id}`);
  }


  createDepartment(department: any){
    return this.http.post(this.apiUrl, department);
  }

  updateDepartment(id: number, department: any){
    return this.http.put(`${this.apiUrl}/${id}`, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchDepartments(name: string): Observable<{ data: Department[] }> {
    return this.http.get<{ data: Department[] }>(`${this.apiUrl}?name=${name}`);
  }
}
