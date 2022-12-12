import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Option, Question } from '../model/models';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  private urlOptions!: string;
  private urlQuestion!: string;

  constructor(private http: HttpClient) {
    this.urlQuestion = 'http://localhost:3000/question';
    this.urlOptions = 'http://localhost:3000/options';
  }

  getQuestion(): Observable<Question> {
    return this.http.get<Question>(this.urlQuestion);
  }

  setQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(this.urlQuestion, question);
  }

  getOptions(): Observable<Option[]> {
    return this.http.get<Option[]>(this.urlOptions);
  }

  addOption(option: Option): Observable<Option> {
    return this.http.post<Option>(this.urlOptions, option);
  }

  editOption(option: Option): Observable<Option> {
    return this.http.patch<Option>(this.urlOptions + '/' + option.id, option);
  }

  deleteOption(option: Option): Observable<Option> {
    return this.http.delete<Option>(this.urlOptions + '/' + option.id);
  }

  deleteAllOptions(): Observable<any> {
    return this.http.delete(this.urlOptions);
  }
}
