import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:8080/api/products';
    // Mock Python AI URL
    private aiUrl = 'http://localhost:5000/predict';

    constructor(private http: HttpClient) { }

    createProduct(product: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/create`, product);
    }

    getProduct(id: any): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    updateStage(id: any, stage: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/update-stage?stage=${stage}`, {});
    }

    // Calls the Python AI module
    predictQuality(imageFile: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', imageFile);
        return this.http.post(this.aiUrl, formData);
    }
}
