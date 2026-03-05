import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { MobilityInput, MobilityResult } from '../models/mobility.model';

@Injectable({ providedIn: 'root' })
export class MobilityService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/analyse';

  analyse(input: MobilityInput): Observable<MobilityResult> {
    return this.http.post<MobilityResult>(this.apiUrl, input).pipe(
      catchError((err) => {
        const message = err.error?.error ?? 'Ein unbekannter Fehler ist aufgetreten.';
        return throwError(() => new Error(message));
      }),
    );
  }
}
