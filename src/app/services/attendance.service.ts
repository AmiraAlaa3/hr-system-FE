import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../models/attendance';
@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'http://127.0.0.1:8000/api/attendances';

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAttendances(): Observable<{ data: Attendance[] }> {
    return this.http.get<{ data: Attendance[] }>(this.apiUrl , { headers: this.getAuthHeaders() });
  }

  getAttendance(id: number): Observable<{ data: Attendance[] }> {
    return this.http.get<{ data: Attendance[] }>(`${this.apiUrl}/${id}` , { headers: this.getAuthHeaders() });
  }


  createAttendance(Attendance: any){
    return this.http.post(this.apiUrl, Attendance, { headers: this.getAuthHeaders() });
  }

  updateAttendance(id: number, Attendance: any){
    return this.http.put(`${this.apiUrl}/${id}`, Attendance, { headers: this.getAuthHeaders() });
  }

  deleteAttendance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  searchAttendances(employeeName?: string, departmentName?: string): Observable<any> {
    let params = new HttpParams();
    if (employeeName) {
      params = params.set('employee_name', employeeName);
    }
    if (departmentName) {
      params = params.set('department_name', departmentName);
    }
    return this.http.get(`${this.apiUrl}/search`, { params,headers: this.getAuthHeaders()  });
  }

  filterAttendancesByDate(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate);
    return this.http.get(`${this.apiUrl}/filterByDate`, { params,headers: this.getAuthHeaders()  });
  }

  importExcelFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/ExcelImport`, formData, { headers: this.getAuthHeaders() });
  }
}
