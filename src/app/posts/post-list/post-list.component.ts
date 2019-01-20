import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

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
    private postsSubscr = new Subscription();

    constructor(private postsService: PostsService) {}

    ngOnInit() {
        this.isLoading = true;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
        this.postsSubscr = this.postsService.getPostsUpdatedListener()
            .subscribe(
                (postData: {posts: Post[], postCount: number}) => {
                    this.isLoading = false;
                    this.totalPosts = postData.postCount;
                    this.posts = postData.posts;
                }
            );
    }

    onChangePage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }

    ngOnDestroy() {
        this.postsSubscr.unsubscribe();
    }

    onDelete(postId: string) {
        this.isLoading = true;
        this.postsService.deletePost(postId).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage);
        });
    }

}
