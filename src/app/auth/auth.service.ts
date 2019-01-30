import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';

import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.appUrls + '/users';

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
        this.httpClient.post(BACKEND_URL + '/signup', authData)
            .subscribe(response => {
                this.router.navigate(['/']);
            }, error => {
                this.userAuthenSubject.next(false);
            });
    }

    loginUser(email: string, password: string) {
        const authData: AuthData = {email, password};
        this.httpClient.post<{token: string, userId: string}>(BACKEND_URL + '/login', authData)
            .subscribe(response => {
                this.token = response.token;
                if (this.token) {
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.userAuthenSubject.next(true);
                    this.saveTokenInLocalStorage(this.token, this.userId);
                    this.router.navigate(['/']);
                }
            }, error => {
                this.userAuthenSubject.next(false);
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
