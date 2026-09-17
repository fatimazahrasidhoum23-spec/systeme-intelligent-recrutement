import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OffreResponse } from '../../models/offre/offre';

@Injectable({ providedIn: 'root' })
export class CandidatService {
  private offreUrl = 'http://localhost/api/offre/Offre';
  private candidatureUrl = 'http://localhost/api/offre/candidature';
  private documentUrl = 'http://localhost/api/offre/document';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAll(): Observable<OffreResponse[]> {
    return this.http.get<OffreResponse[]>(this.offreUrl);
  }

  postuler(dto: any): Observable<any> {
    return this.http.post(`${this.candidatureUrl}/postuler`, dto, { headers: this.getHeaders() });
  }

  uploadDocument(file: File, typeDocument: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('typeDocument', typeDocument);
    return this.http.post(`${this.documentUrl}/upload`, formData, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` })
    });
  }

  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>(this.documentUrl, { headers: this.getHeaders() });
  }

  deleteCandidature(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost/api/offre/candidature/delete/${id}`, { headers: this.getHeaders() });
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.documentUrl}/${id}`, { headers: this.getHeaders() });
  }

  suivreParEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.candidatureUrl}/suivi/email/${email}`, { headers: this.getHeaders() });
  }

  getPreselectionnees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.candidatureUrl}/preselectionnees`, { headers: this.getHeaders() });
  }

  valider(id: number): Observable<any> {
    return this.http.patch(`${this.candidatureUrl}/valider`, { id }, { headers: this.getHeaders() });
  }

  eliminer(id: number): Observable<any> {
    return this.http.patch(`${this.candidatureUrl}/eliminer`, { id }, { headers: this.getHeaders() });
  }
}
