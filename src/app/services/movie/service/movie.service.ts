import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieModel } from '../model/movie.model';

const url = 'http://www.omdbapi.com/?t=';
const apiKey = '7e41c3c'

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(
    private http: HttpClient
  ) { }

  getMovies() {

  }

  getMovieFromOMDBApi(letter: string): Observable<MovieModel> {
    return this.http.get<MovieModel>(url + letter + '&apikey=' + apiKey + '&plot=full');
  }


}
