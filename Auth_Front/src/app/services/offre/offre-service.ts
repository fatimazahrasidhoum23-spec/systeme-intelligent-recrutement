import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OffreRequest, OffreResponse } from '../../models/offre/offre';

@Injectable({ providedIn: 'root' })
export class OffreSevice {
  private apiUrl = 'http://localhost/api/offre/Offre';

  constructor(private Http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll(): Observable<OffreResponse[]> {
    return this.Http.get<OffreResponse[]>(`${this.apiUrl}`);
  }
  Add(offre: OffreRequest): Observable<OffreResponse> {
    return this.Http.post<OffreResponse>(`${this.apiUrl}/add`, offre, { headers: this.getHeaders() });
  }
  update(id: number, offre: OffreRequest): Observable<OffreResponse> {
    return this.Http.patch<OffreResponse>(`${this.apiUrl}/update/${id}`, offre, { headers: this.getHeaders() });
  }
  getById(id: number): Observable<OffreResponse> {
    return this.Http.get<OffreResponse>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
  getAllArchive(): Observable<OffreResponse[]> {
    return this.Http.get<OffreResponse[]>(`${this.apiUrl}/archive`, { headers: this.getHeaders() });
  }
  delete(id: number): Observable<void> {
    return this.Http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() });
  }
}
