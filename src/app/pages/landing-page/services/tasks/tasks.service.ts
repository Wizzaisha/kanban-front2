import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormTask, Task } from '../../models/tasks';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  postTask(dataToSave: FormTask): Observable<Task> {
    return this.http.post<Task>('tasks', dataToSave);
  }
}
