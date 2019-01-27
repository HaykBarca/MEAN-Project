import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription, Subject } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    posts: Post[] = [];
    isLoading = false;
    totalPosts = 0;
    currentPage = 1;
    postsPerPage = 5;
    pageSizeOptions = [2, 5, 10, 20];
    userId: string;
    userIsAuthenticated = false;
    private authStatusSubs = new Subscription();
    private postsSubscr = new Subscription();

    constructor(private postsService: PostsService, private authService: AuthService) {}

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.postsSubscr = this.postsService.getPostsUpdatedListener()
            .subscribe(
                (postData: {posts: Post[], postCount: number}) => {
                    this.isLoading = false;
                    this.totalPosts = postData.postCount;
                    this.posts = postData.posts;
                }
            );

        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSubs = this.authService.getUserStatus()
                .subscribe(isAuth => {
                    this.userIsAuthenticated = isAuth;
                    this.userId = this.authService.getUserId();
                });
    }

    onChangePage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }

    ngOnDestroy() {
        this.postsSubscr.unsubscribe();
        this.authStatusSubs.unsubscribe();
    }

    onDelete(postId: string) {
        this.isLoading = true;
        this.postsService.deletePost(postId).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        });
    }

}
