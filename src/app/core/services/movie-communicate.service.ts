import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MovieService } from '../../services/movie/service/movie.service';
import { MovieModel } from 'src/app/services/movie/model/movie.model';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

const letterList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const localStorageKey = 'movieList';


@Injectable({
  providedIn: 'root'
})
export class MovieCommunicateService {

  private readonly movieList$ = new BehaviorSubject<MovieModel[]>([
    {
      Actors: "",
      Awards: "",
      BoxOffice: "",
      Country: "",
      DVD: "",
      Director: "",
      Genre: "",
      Language: "",
      Metascore: "",
      Plot: "",
      Poster: "",
      Production: "",
      Rated: "",
      Ratings: "",
      Released: "",
      Response: "",
      Runtime: "",
      Title: "",
      Type: "",
      Website: "",
      Writer: "",
      Year: "",
      imdbID: "",
      imdbRating: "",
      imdbVotes: ""
    }
  ]);
  _movieList: MovieModel[] = [];

  constructor(private movieService: MovieService, private toastr: ToastrService, private spinner: NgxSpinnerService) {

    if (this.hasMoviesInLocalDB()) {
      this.movieList$.next(this.getMoviesFromLocalDB());
      this._movieList = this.getMoviesFromLocalDB();
    }
    else {
      this.getMoviesFromAPI();
    }

  }
  getMovieList(): Observable<MovieModel[]> {
    return this.movieList$.asObservable();
  }
  hasMoviesInLocalDB() {
    return localStorage.getItem(localStorageKey) ? true : false
  }
  getMoviesFromLocalDB() {
    return JSON.parse(localStorage.getItem(localStorageKey));
  }
  setMoviesToLocalDB(movieList: MovieModel[]) {
    localStorage.setItem(localStorageKey, JSON.stringify(movieList))
  }
  getMoviesFromAPI() {
    this.spinner.show();
    letterList.forEach(letter => {
      this.movieService.getMovieFromOMDBApi(letter)
        .subscribe(res => {
          if (res) {
            this._movieList.push(res);
            this.movieList$.next(this._movieList);

            if (this._movieList.length == letterList.length) {
              this.spinner.hide();
              this.toastr.info('Filmler başarıyla getirildi.')
              this.setMoviesToLocalDB(this._movieList);
            }
          }
        })
    })
  }
  updateMovieList(movieList: MovieModel[]) {
    this.movieList$.next(movieList);
    this.setMoviesToLocalDB(movieList);
    this.spinner.hide();
    this.toastr.success('Film listesi güncellendi.')
  }

  deleteMovie(id: string) {
    this.spinner.show();
    const index = this._movieList.indexOf(this._movieList.find(x => x.imdbID == id));
    if (index > -1) {
      this._movieList.splice(index, 1);
      this.toastr.success('Film başarıyla silindi.');
      setTimeout(() => {
        this.updateMovieList(this._movieList);
      }, 5000);
    }
  }

  updateMovie(id, updateMovie: MovieModel) {
    this.spinner.show();
    let _movie: MovieModel = this._movieList.find(x => x.imdbID == id);
    _movie.imdbRating = updateMovie.imdbRating;
    _movie.Title = updateMovie.Title;
    this.toastr.success('Film bilgileri başarıyla güncellendi.');
    setTimeout(() => {
      this.updateMovieList(this._movieList);
    }, 5000);
  }

  addMovie(newMovie: MovieModel) {
    this.spinner.show();
    newMovie.imdbID = Guid.create().toString();
    this._movieList.push(newMovie);
    this.toastr.success('Film başarıyla eklendi.')
    setTimeout(() => {
      this.updateMovieList(this._movieList);
    }, 5000);
  }
}
