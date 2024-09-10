import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
    email: string;
    password: string | number;
}

@Injectable({
    providedIn: 'root',
})


export class LoginService {
    private loginUrl = 'http://127.0.0.1:8000/api/login';

    constructor(private http: HttpClient) { }

    isTokenExpired(token: string): boolean {
        return !token || token.trim() === '';
    }

    isLoggedIn(): boolean {
        const token = localStorage.getItem('token');
        return token !== null && token.trim() !== '';
    }

    login(email: string, password: string): Observable<any> {
        const body = { email, password };
        return this.http.post<any>(this.loginUrl, body);
    }

    logout(): void {
        localStorage.removeItem('token');
    }
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