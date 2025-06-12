import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Boards, FormBoard } from '../../models/boards';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Boards[]> {
    return this.http.get<Boards[]>('boards');
  }

  postBoard(dataToSave: FormBoard): Observable<Boards[]> {
    return this.http.post<Boards[]>('boards', dataToSave);
  }

  putBoard(dataToSave: FormBoard): Observable<Boards[]> {
    return this.http.put<Boards[]>(`boards/${dataToSave.id}`, dataToSave);
  }

  deleteBoard(idToDelete: number): Observable<any> {
    return this.http.delete<any>(`boards/${idToDelete}`);
  }
}
