import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubtasksService {
  constructor(private http: HttpClient) {}

  deleteSubtask(idToDelete: number): Observable<any> {
    return this.http.delete<any>(`subtasks/${idToDelete}`);
  }
}
