import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    public userAuthenticated = false;
    private authListenerSubs: Subscription;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.userAuthenticated = this.authService.getIsAuth();
        this.authListenerSubs = this.authService
            .getUserStatus()
            .subscribe(status => {
                this.userAuthenticated = status;
            });
    }

    ngOnDestroy() {
        this.authListenerSubs.unsubscribe();
    }

    onLogout() {
        this.authService.logoutUser();
    }
}
