import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.appUrls + '/posts/';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor (private httpClient: HttpClient,
                 private router: Router) {}

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.httpClient
            .get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
            .pipe(map(
                (fetchedData) => {
                    return {posts: fetchedData.posts.map(
                        (post) => {
                            return {
                                title: post.title,
                                content: post.content,
                                id: post._id,
                                imagePath: post.imagePath,
                                creator: post.creator
                            };
                        }
                    ),
                    maxPosts: fetchedData.maxPosts
                    };
                }
            ))
            .subscribe((transformedPostData) => {
                this.posts = transformedPostData.posts;
                this.postsUpdated.next({posts: this.posts, postCount: transformedPostData.maxPosts});
            });
    }

    getPostsUpdatedListener() {
        return this.postsUpdated.asObservable();
    }

    getPost (id: string) {
        return this.httpClient.get<{
            _id: string,
            title: string,
            content: string,
            imagePath: string,
            creator: string
        }>(BACKEND_URL + id);
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.httpClient.post<{message: string, post: Post}>(BACKEND_URL, postData)
            .subscribe((resData) => {
                this.router.navigate(['/']);
            });

    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {
                id,
                title,
                content,
                imagePath: image,
                creator: null
            };
        }
        this.httpClient.put(BACKEND_URL + id, postData)
            .subscribe(response => {
                this.router.navigate(['/']);
            });
    }

    deletePost(postId: string) {
        return this.httpClient.delete(BACKEND_URL + postId);
    }
}
