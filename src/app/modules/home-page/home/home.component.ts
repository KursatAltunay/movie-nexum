import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MovieCommunicateService } from '../../../core/services/movie-communicate.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MovieModel } from 'src/app/services/movie/model/movie.model';
import { LanguageModel } from 'src/app/services/movie/model/language.model';
import { GenreModel } from 'src/app/services/movie/model/genre.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MovieFormComponent } from './movie-form/movie-form.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('searchButton') searchButton: ElementRef;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchButtonIcon') searchButtonIcon: ElementRef;

  movieList: MovieModel[] = [];
  movieDisplayList: MovieModel[] = [];
  displayIdList: string[] = [];
  languages: LanguageModel[] = [];
  genres: GenreModel[] = [];
  selectedLanguages: string[] = [];
  selectedGenres: string[] = [];


  yearSortList = [
    { id: 1, text: "Eskiden yeniye" },
    { id: 2, text: "Yeniden eskiye" },
  ];

  ratingSortList = [
    { id: 1, text: "Küçükten büyüğe" },
    { id: 2, text: "Büyükten küçüğe" },
  ]
  selectedYearSort: number;
  selectedRatingSort: number;

  destroyed$ = new Subject();
  constructor(
    private movieCommunicateService: MovieCommunicateService,
    private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getMovieList();
    this.cdr.detectChanges();
  }

  onSearchInputChange(e) {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue) {
      this.searchButtonIcon.nativeElement.setAttribute('class', 'fa fa-times');
      this.searchButton.nativeElement.disabled = false;
      this.movieDisplayList = [...this.movieList.filter(x => x.Title.toLowerCase().includes(searchValue))];
      this.updateListAndSort();
    }
    else {
      this.clearSearch();
      this.updateListAndSort();
    }
  }

  clearSearch() {
    this.searchInput.nativeElement.value = '';
    this.searchButtonIcon.nativeElement.setAttribute('class', 'fa fa-search');
    this.searchButton.nativeElement.disabled = true;
    this.movieDisplayList = [...this.movieList];
    this.updateListAndSort();
  }

  updateListAndSort() {
    this.displayIdList = this.movieDisplayList.map(x => x.imdbID);
    this.generateLanguageList();
    this.generateGenreList();
    this.sorting();
  }

  getMovieList() {
    this.movieCommunicateService.getMovieList()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res => {
        if (res) {
          this.movieList = res;
          this.movieDisplayList = [...this.movieList];
          this.clearSearch();
          this.updateListAndSort();
        }
      })
  }

  sorting(sortBy?: string) {
    let _movieList = this.movieList.filter(x => this.displayIdList.includes(x.imdbID));
    if ((sortBy == 'rate' && this.selectedRatingSort) || (sortBy == 'year' && !this.selectedYearSort && this.selectedRatingSort)) {
      _movieList.sort((a, b) => this.compareByRate(a, b))
    }
    else {
      _movieList.sort((a, b) => this.compareByDate(a, b))
    }
    this.movieDisplayList = [..._movieList];
  }

  compareByDate(movie1: MovieModel, movie2: MovieModel) {
    let date1 = +movie1.Year ? movie1.Year : movie1.Released.split(' ')[2];
    let date2 = +movie2.Year ? movie2.Year : movie2.Released.split(' ')[2];
    if (this.selectedYearSort == 1) {
      return date1 > date2 ? 1 : date1 < date2 ? -1 : this.compareByRate(movie1, movie2);
    }
    else {
      return date1 < date2 ? 1 : date1 > date2 ? -1 : this.compareByRate(movie1, movie2);
    }
  }

  compareByRate(movie1: MovieModel, movie2: MovieModel) {
    let rate1 = movie1.imdbRating;
    let rate2 = movie2.imdbRating;
    if (this.selectedRatingSort == 1) {
      return rate1 > rate2 ? 1 : rate1 < rate2 ? -1 : this.compareByDate(movie1, movie2);
    }
    else {
      return rate1 < rate2 ? 1 : rate1 > rate2 ? -1 : this.compareByDate(movie1, movie2);
    }
  }

  generateLanguageList() {
    this.languages = [];
    this.movieDisplayList.map(x => {
      const _languages = x.Language.split(',');
      _languages.map(_language => {
        _language = _language.trimStart();
        _language = _language.trim();
        if (!this.languages.some(a => a.Language == _language)) {
          this.languages.push({ Language: _language })
        }
      })
    })
  }

  generateGenreList() {
    this.genres = [];
    this.movieDisplayList.map(x => {
      const _genres = x.Genre.split(',');
      _genres.map(_genre => {
        _genre = _genre.trimStart();
        _genre = _genre.trim();
        if (!this.genres.some(a => a.Genre == _genre)) {
          this.genres.push({ Genre: _genre })
        }
      })
    })
  }

  onFilterSelectChanged() {
    let _languageIds: string[] = [];
    let _genreIds: string[] = [];

    _languageIds = this.getLanguageSelectChangeIdList();
    _genreIds = this.getGenreSelectChangeIdList();

    this.displayIdList = _languageIds.filter(x => _genreIds.includes(x))
    this.sorting()
  }

  getLanguageSelectChangeIdList() {
    let _ids: string[] = [];
    if (this.selectedLanguages.length != 0) {
      this.selectedLanguages.forEach(language => {
        this.movieList.filter(x => x.Language.includes(language)).map(x => {
          if (!_ids.some(y => y == x.imdbID)) {
            _ids.push(x.imdbID)
          }
        })
      })
    }
    else {
      _ids = this.movieList.map(x => x.imdbID)
    }
    return _ids;
  }

  getGenreSelectChangeIdList() {
    let _ids: string[] = [];
    if (this.selectedGenres.length != 0) {
      this.selectedGenres.forEach(genre => {
        this.movieList.filter(x => x.Genre.includes(genre)).map(x => {
          if (!_ids.some(y => y == x.imdbID)) {
            _ids.push(x.imdbID)
          }
        })
      })
    }
    else {
      _ids = this.movieList.map(x => x.imdbID)
    }
    return _ids;
  }

  addNewMovie() {
    const modalRef = this.ngbModal.open(MovieFormComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });

  }


  // setMovieList() {
  //   this.movieCommunicateService.setMovies(this.movieList);
  // }


}
