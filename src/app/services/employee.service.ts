import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/idepartment';
import { Employee } from '../models/iemployee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://127.0.0.1:8000/api/employees';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getEmployees(): Observable<{ data: Employee[] }> {
    return this.http.get<{ data: Employee[] }>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getEmployee(id: number): Observable<{ data: Employee }> {
    return this.http.get<{ data: Employee }>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createEmployee(employee: any): Observable<any> {
    return this.http.post(this.apiUrl, employee, { headers: this.getAuthHeaders() });
  }

  updateEmployee(id: number, employee: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, employee, { headers: this.getAuthHeaders() });
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  searchEmployee(name: string): Observable<{ data: Employee[] }> {
    return this.http.get<{ data: Employee[] }>(`${this.apiUrl}?name=${name}`, { headers: this.getAuthHeaders() });
  }
}
