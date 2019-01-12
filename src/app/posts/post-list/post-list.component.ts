import { Component, OnInit, OnDestroy } from '@angular/core';
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
    private postsSubscr = new Subscription();

    constructor(private postsService: PostsService) {}

    ngOnInit() {
        this.postsService.getPosts();
        this.postsSubscr = this.postsService.getPostsUpdatedListener()
            .subscribe(
                (posts: Post[]) => {
                    this.posts = posts;
                }
            );
    }

    ngOnDestroy() {
        this.postsSubscr.unsubscribe();
    }

    onDelete(postId: string) {
        this.postsService.deletePost(postId);
    }

}
