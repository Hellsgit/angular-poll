import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';

import { Question } from 'src/app/model/models';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public questionObj: any = new Question();
  public optionArrayToChild: any = [];

  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.getQuestion();
  }

  onOutputOptions(arrData: any) {
    this.optionArrayToChild = arrData;
  }

  getQuestion() {
    this.crudService
      .getQuestion()
      .pipe(
        tap((res) => {
          this.questionObj.title = res.title;
        })
      )
      .subscribe({ error: (err) => alert('Failed to get question ' + err) });
  }

  setQuestion() {
    this.crudService.setQuestion(this.questionObj).subscribe({
      next: () => this.ngOnInit(),
      error: (err) => alert('Failed to set question ' + err),
    });
  }
}
