import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor (private httpClient: HttpClient) {}

    getPosts() {
        this.httpClient
            .get<{message: string, posts: any}>('http://localhost:3000/api/posts')
            .pipe(map(
                (fetchedData) => {
                    return fetchedData.posts.map(
                        (post) => {
                            return {
                                title: post.title,
                                content: post.content,
                                id: post._id
                            };
                        }
                    );
                }
            ))
            .subscribe((transformedData) => {
                this.posts = transformedData;
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

        this.httpClient.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
            .subscribe((resData) => {
                const id = resData.postId;
                post.id = id;
                this.posts.push(post);
                this.postsUpdated.next(this.posts);
            });

    }

    deletePost(postId: string) {
        this.httpClient.delete('http://localhost:3000/api/posts/' + postId)
            .subscribe(() => {
                const updatedPosts = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPosts;
                this.postsUpdated.next(this.posts);
            });
    }
}
