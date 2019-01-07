import { Component, ViewChild } from '@angular/core';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    @ViewChild('text') oldPost;
    newPost = '';

    onAddPost() {
        this.newPost = this.oldPost.nativeElement.value;
        this.oldPost.nativeElement.value = '';
    }
}
