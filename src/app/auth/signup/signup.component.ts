import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
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

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.authService.signupUser(form.value.email, form.value.password);
        this.isLoading = true;
    }
}
