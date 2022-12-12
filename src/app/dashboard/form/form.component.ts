import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { tap } from 'rxjs';

import { CrudService } from 'src/app/service/crud.service';
import { Option } from 'src/app/model/models';
import { Options } from 'src/app/types/types';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Output() formOutputOptions: EventEmitter<Option[]> = new EventEmitter();

  private optionObj: Option = new Option();

  public optionArr: Options[] = [];
  public addOptionValue: string = '';
  public editOptionValue: string = '';
  public totalOptions: number = 0;
  public disableAddBtn: Boolean = false;

  constructor(private crudService: CrudService) {}

  ngOnInit(): void {
    this.getOptions();
  }

  outputOptionsArr(value: any) {
    this.formOutputOptions.emit(value);
  }

  getOptions() {
    this.crudService
      .getOptions()
      .pipe(
        tap((res) => {
          this.optionArr = res;
          this.outputOptionsArr(this.optionArr);
          this.maxOptions();
        })
      )
      .subscribe({
        error: (err) => alert('Failed to get options list ' + err),
      });
  }

  addOption() {
    if (this.optionArr.length === 10) {
      return alert('maximaal aantal bereikt');
    }

    if (!this.addOptionValue) {
      return alert('Add option text');
    }

    this.optionObj.option_name = this.addOptionValue;

    this.crudService.addOption(this.optionObj).subscribe({
      next: () => {
        this.addOptionValue = '';
        this.ngOnInit();
      },
      error: (err) => {
        alert('No option added ' + err);
      },
    });
  }

  editOption() {
    this.optionObj.option_name = this.editOptionValue;

    this.crudService.editOption(this.optionObj).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err) => {
        alert('Failed to update ' + err);
      },
    });
  }

  deleteOption(option: Option) {
    this.crudService.deleteOption(option).subscribe({
      next: () => {
        this.ngOnInit();
      },
      error: (err) => {
        alert('Failed to delete ' + err);
      },
    });
  }

  callOption(option: Option) {
    this.optionObj = option;
    this.editOptionValue = option.option_name;
  }

  resetOptions() {
    // Dirty cleanup loop
    this.optionArr.map((options) => {
      this.crudService.deleteOption(options).subscribe();
      this.ngOnInit();
    });
  }

  maxOptions() {
    this.totalOptions = this.optionArr.length;
    return (this.disableAddBtn = this.totalOptions === 10 ? true : false);
  }
}
