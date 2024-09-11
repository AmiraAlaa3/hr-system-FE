import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/idepartment';
import { Employee } from '../models/iemployee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://127.0.0.1:8000/api/employees';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<{ data: Employee[] }> {
    return this.http.get<{ data: Employee[] }>(this.apiUrl);
  }

  getEmployee(id: number): Observable<{ data: Employee[] }> {
    return this.http.get<{ data: Employee[] }>(`${this.apiUrl}/${id}`);
  }


  createEmployee(employee: any){
    return this.http.post(this.apiUrl, employee);
  }

  updateEmployee(id: number, employee: any){
    return this.http.put(`${this.apiUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchEmployee(name: string): Observable<{ data: Employee[] }> {
    return this.http.get<{ data: Employee[] }>(`${this.apiUrl}?name=${name}`);
  }
}
