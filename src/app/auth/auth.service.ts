import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string;
    private isAuthenticated = false;
    private userAuthenSubject = new Subject<boolean>();

    constructor(private httpClient: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getUserStatus() {
        return this.userAuthenSubject.asObservable();
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    signupUser(email: string, password: string) {
        const authData: AuthData = {email, password};
        this.httpClient.post('http://localhost:3000/api/users/signup', authData)
            .subscribe(response => {
                console.log(response);
            });
    }

    loginUser(email: string, password: string) {
        const authData: AuthData = {email, password};
        this.httpClient.post<{token: string}>('http://localhost:3000/api/users/login', authData)
            .subscribe(response => {
                this.token = response.token;
                if (this.token) {
                    this.isAuthenticated = true;
                    this.userAuthenSubject.next(true);
                    this.saveTokenInLocalStorage(this.token);
                    this.router.navigate(['/']);
                }
            });
    }

    logoutUser() {
        this.token = null;
        this.isAuthenticated = false;
        this.userAuthenSubject.next(false);
        this.removeTokenFromLocalStorage();
        this.router.navigate(['/']);
    }

    autoAuth() {
        const authInfo = this.getAuthData();

        if (authInfo) {
            this.token = authInfo.token;
            this.isAuthenticated = true;
            this.userAuthenSubject.next(true);
        }
    }

    private saveTokenInLocalStorage(token: string) {
        localStorage.setItem('token', token);
    }

    private removeTokenFromLocalStorage() {
        localStorage.removeItem('token');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        return {token};
    }
}
