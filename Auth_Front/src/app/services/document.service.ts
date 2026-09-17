import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private apiUrl = 'http://localhost/api/offre/Document';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  upload(file: File, typeDocument: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('typeDocument', typeDocument);
    return this.http.post(`${this.apiUrl}/upload`, formData, { headers: new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })});
  }

  getMesDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mes-documents`, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
