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
    private userId: string;
    private userAuthenSubject = new Subject<boolean>();

    constructor(private httpClient: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getUserStatus() {
        return this.userAuthenSubject.asObservable();
    }

    getUserId() {
        return this.userId;
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
        this.httpClient.post<{token: string, userId: string}>('http://localhost:3000/api/users/login', authData)
            .subscribe(response => {
                this.token = response.token;
                if (this.token) {
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.userAuthenSubject.next(true);
                    this.saveTokenInLocalStorage(this.token, this.userId);
                    this.router.navigate(['/']);
                }
            });
    }

    logoutUser() {
        this.token = null;
        this.isAuthenticated = false;
        this.userAuthenSubject.next(false);
        this.removeTokenFromLocalStorage();
        this.userId = null;
        this.router.navigate(['/']);
    }

    autoAuth() {
        const authInfo = this.getAuthData();

        if (authInfo) {
            this.token = authInfo.token;
            this.isAuthenticated = true;
            this.userId = authInfo.userId;
            this.userAuthenSubject.next(true);
        }
    }

    private saveTokenInLocalStorage(token: string, userId: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
    }

    private removeTokenFromLocalStorage() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token) {
            return;
        }

        return {token, userId};
    }
}
