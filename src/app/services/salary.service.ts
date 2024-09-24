import { Injectable } from '@angular/core';
import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Salary } from '../models/salary';
@Injectable({
  providedIn: 'root'
})
export class SalaryService {
  private apiUrl = 'http://127.0.0.1:8000/api/salaries';

  constructor(private http: HttpClient) { }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  getSalary(): Observable<{ data: Salary[] }> {
    return this.http.get<{ data: Salary[] }>(this.apiUrl,{ headers: this.getAuthHeaders() });
  }
  searchSalary(employeeName?: string, month?: number, year?: number): Observable<any> {
    let params = new HttpParams();
    if (month && year && employeeName) {
      params = params.set('month', month).set('year', year).set('name', employeeName);
    }
    return this.http.get(`http://127.0.0.1:8000/api/salary/search?name=${employeeName}&month=${month}&year=${year}`, { params , headers: this.getAuthHeaders() });
  }
  filterSalaryByDate(month: number , year: number): Observable<any> {
        const params = new HttpParams()
          .set('month', month)
          .set('year', year);
        return this.http.get(`http://127.0.0.1:8000/api/salary/search-by-month-year?month=${month}&year=${year}`, { params ,headers: this.getAuthHeaders() });
      }

}
