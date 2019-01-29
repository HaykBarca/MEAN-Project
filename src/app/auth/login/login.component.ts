import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    isLoading = false;
    private userAuthSubs: Subscription;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.userAuthSubs = this.authService.getUserStatus().subscribe(result => {
            this.isLoading = false;
        });
    }

    ngOnDestroy() {
        this.userAuthSubs.unsubscribe();
    }

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.authService.loginUser(form.value.email, form.value.password);
        this.isLoading = true;
    }
}
