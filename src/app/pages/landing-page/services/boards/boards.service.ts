import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Boards } from '../../models/boards';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Boards[]> {
    return this.http.get<Boards[]>('boards');
  }
}
