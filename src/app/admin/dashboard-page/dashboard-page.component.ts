import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from "../../shared/posts.service";
import {Post} from "../../shared/interfaces";
import {Subscription} from "rxjs";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  public posts: Post[] = []
  public searchStr = '';
  private pSub: Subscription
  private dSub: Subscription

  constructor(
    private postsService: PostsService,
    private alertService: AlertService,
  ) { }

  public ngOnInit(): void {
    this.pSub = this.postsService.getAll().subscribe(posts => {
      this.posts = posts
    })
  }

  public ngOnDestroy(): void {
    this.pSub && this.pSub.unsubscribe()
    this.dSub && this.dSub.unsubscribe()
  }

  public remove(id: string) {
    this.dSub = this.postsService.remove(id).subscribe(_ => {
      this.posts = this.posts.filter(post => post.id !== id)
      this.alertService.danger('Пост был удален')
    })
  }
}
