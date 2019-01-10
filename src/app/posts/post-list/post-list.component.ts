import { Component, Input } from '@angular/core';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
    // posts = [
    //     {title: 'First Title', content: 'First content'},
    //     {title: 'Second Title', content: 'Second title'},
    //     {title: 'Third Title', content: 'Third title'}
    // ];
    @Input() posts: Post[] = [];

    constructor(private postsService: PostsService) {}

}
