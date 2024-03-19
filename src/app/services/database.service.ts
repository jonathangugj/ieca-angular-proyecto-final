import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Favoritos {
  id: number,
  name:string,
  timestamp:number
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private APIURL='http://localhost:3000/api/v1';

  constructor(
    private logger:LoggingService,
    private http: HttpClient
  ) { 

  }

  public getFavoritos(): Observable<Favoritos[]> {
    return this.http.get<Favoritos[]>(`${this.APIURL}/favoritos`);
  }
}
