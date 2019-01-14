import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
    post: Post;
    private mode = 'create';
    private postId: string;

    constructor(private postsService: PostsService, private route: ActivatedRoute ) {}

    ngOnInit () {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')) {
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.post = this.postsService.getPost(this.postId);
            } else {
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onSavePost(postForm: NgForm) {
        if (postForm.invalid) {
            return;
        }

        if (this.mode === 'create') {
            this.postsService.addPost(postForm.value.title, postForm.value.content);
        } else {
            this.postsService.updatePost(this.postId, postForm.value.title, postForm.value.content);
        }

        postForm.resetForm();
    }
}
