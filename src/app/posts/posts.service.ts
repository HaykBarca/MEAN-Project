import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor (private httpClient: HttpClient) {}

    getPosts() {
        this.httpClient.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
            .subscribe((fetchedData) => {
                this.posts = fetchedData.posts;
                this.postsUpdated.next(this.posts);
            });
    }

    getPostsUpdatedListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post: Post = {
            id: null,
            title: title,
            content: content
        };

        this.httpClient.post<{message: string}>('http://localhost:3000/api/posts', post)
            .subscribe((resData) => {
                console.log(resData);
                this.posts.push(post);
                this.postsUpdated.next(this.posts);
            });

    }
}
