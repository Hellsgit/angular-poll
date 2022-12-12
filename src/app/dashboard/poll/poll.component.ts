import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { CrudService } from 'src/app/service/crud.service';
import { Option } from 'src/app/model/models';
import { Chart } from 'src/app/types/types';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss'],
})
export class PollComponent implements OnInit {
  private _data = new BehaviorSubject<Option[]>([]);

  public chart: Chart[] = [];
  public totalVotes: number = 0;
  public disableVote: boolean = false;

  @Input() title = '';
  @Input()
  set poll(value) {
    this._data.next(value);
  }
  get poll() {
    return this._data.getValue();
  }

  constructor(public fb: FormBuilder, private crudService: CrudService) {}

  ngOnInit(): void {
    this._data.subscribe((poll) => {
      this.totalVotes = poll
        .map((obj) => obj.votes)
        .reduce((acc, n) => (acc += n), 0);

      this.chart = poll.map((obj) => ({
        label: obj.option_name,
        percentage: Number(
          ((100 * obj.votes) / this.totalVotes || 0).toFixed(0)
        ),
      }));

      this.disableVote = poll.length < 2 ? true : false;
    });
  }

  pollAnswerForm = this.fb.group({
    pollAnswer: [''],
  });

  get pollForm() {
    return this.pollAnswerForm.get('pollAnswer')?.value;
  }

  onSubmit() {
    console.log(this.poll);

    if (!this.pollForm) {
      return alert('Pls choose an option');
    }

    console.log(this.pollForm);

    const option = this.poll.filter(
      (option) => option.id === Number(this.pollForm)
    );

    // Get as object from the array
    // console.log(option[0]);
    option[0].votes++;

    this.crudService.editOption(option[0]).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err) => {
        alert('Failed to update ' + err);
      },
    });
  }
}
