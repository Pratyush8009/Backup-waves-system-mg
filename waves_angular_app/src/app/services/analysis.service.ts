import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AnalysisService {

    // private baseUrl = 'http://192.168.1.6:8080/api/v1/waves';
    private baseUrl = 'http://localhost:8080/api/v1/waves';
    private apiUrl = environment.apiUrl;


    constructor(private http: HttpClient) { }

    createAnalysis(unitId: string, systemId: string, analysisData: { name: string, description: string, category: string }): Observable<any> {
        const url = `${this.apiUrl}/v1/waves/unit/${unitId}/system/${systemId}/analyses`;
        return this.http.post(url, analysisData);
    }


    getAnalysis(unitId: string, systemId: string, analysisId: string): Observable<any> {
        const url = `${this.apiUrl}/v1/waves/unit/${unitId}/system/${systemId}/analyses/${analysisId}`;
        return this.http.get(url);
    }


    updateAnalysis(unitId: string, systemId: string, analysisId: string, updateData: { name: string, description: string, status: string }): Observable<any> {
        const url = `${this.apiUrl}/v1/waves/unit/${unitId}/system/${systemId}/analyses/${analysisId}`;
        return this.http.put(url, updateData);
    }


    getAnalysisSummary(unitId: string, systemId: string, analysisId: string): Observable<any> {
        const url = `${this.apiUrl}/v1/waves/unit/${unitId}/system/${systemId}/analyses/${analysisId}/results/summary`;
        return this.http.get(url);
    }


    getAnalysisPlots(unitId: string, systemId: string, analysisId: string): Observable<any> {
        const url = `${this.apiUrl}/v1/waves/unit/${unitId}/system/${systemId}/analyses/${analysisId}/plots`;
        return this.http.get(url);
    }


    getAnalysisPipeline(analysisId: string, pipelineId: string): Observable<any> {
        const url = `${this.apiUrl}/v1/waves/analyses/${analysisId}/pipelines/${pipelineId}`;
        return this.http.get(url);
    }

    changeAnalysisStatus(unitId: string, systemId: string, analysisId: string, status: string): Observable<any> {
        const url = `${this.apiUrl}/v1/waves/unit/${unitId}/system/${systemId}/analyses/${analysisId}/status`;
        return this.http.put(url, { status });
    }
}