import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ColumnStatus } from '../../models/columnStatus';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService {
  constructor(private http: HttpClient) {}

  getColumnsById(boardId: number): Observable<ColumnStatus[]> {
    return this.http.get<ColumnStatus[]>(`columns/${boardId}`);
  }

  deleteColumns(idToDelete: number): Observable<any> {
    return this.http.delete<any>(`columns/${idToDelete}`);
  }
}
