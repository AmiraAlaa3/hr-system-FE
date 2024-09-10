import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
    email: string;
    password: string|number;
}

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    // private apiUrl = 'http://127.0.0.1:8000/api/login';

    // constructor(private http: HttpClient) {}

    // login(user: User): Observable<any> {
    //     return this.http.post(`${this.apiUrl}/login`, user);
    // }

    // logout(): Observable<any> {
    //     const headers = new HttpHeaders({
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //     });
    //     return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
    // }

    // getUser(): Observable<any> {
    //     const headers = new HttpHeaders({
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
    //     });
    //     return this.http.get(`${this.apiUrl}/user`, { headers });
    // }
}