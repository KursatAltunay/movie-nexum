import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MovieModel } from 'src/app/services/movie/model/movie.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MovieCommunicateService } from '../../../../core/services/movie-communicate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss'],
  providers: [FormBuilder],
})
export class MovieFormComponent implements OnInit {

  movie: MovieModel;
  movieForm: FormGroup;
  isEdit: boolean = false;
  pattern = "[a-zA-Z0-9 ]+"
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private movieCommunicateService: MovieCommunicateService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.movieForm = this.formBuilder.group({
      Title: new FormControl({ value: this.movie ? this.movie.Title : '', disabled: false }, [Validators.maxLength(250), Validators.pattern(this.pattern), Validators.required]),
      imdbRating: new FormControl({ value: this.movie ? this.movie.imdbRating : '', disabled: false }, Validators.required),
      Actors: new FormControl({ value: this.movie ? this.movie.Actors : '', disabled: this.isEdit }, Validators.required),
      Poster: new FormControl({ value: this.movie ? this.movie.Poster : '', disabled: this.isEdit }, Validators.required),
      Plot: new FormControl({ value: this.movie ? this.movie.Plot : '', disabled: this.isEdit }, Validators.required),
      Awards: new FormControl({ value: this.movie ? this.movie.Awards : '', disabled: this.isEdit }),
      BoxOffice: new FormControl({ value: this.movie ? this.movie.BoxOffice : '', disabled: this.isEdit }),
      Country: new FormControl({ value: this.movie ? this.movie.Country : '', disabled: this.isEdit }),
      DVD: new FormControl({ value: this.movie ? this.movie.DVD : '', disabled: this.isEdit }),
      Director: new FormControl({ value: this.movie ? this.movie.Director : '', disabled: this.isEdit }),
      Genre: new FormControl({ value: this.movie ? this.movie.Genre : '', disabled: this.isEdit }),
      Language: new FormControl({ value: this.movie ? this.movie.Language : '', disabled: this.isEdit }),
      Production: new FormControl({ value: this.movie ? this.movie.Production : '', disabled: this.isEdit }),
      Released: new FormControl({ value: this.movie ? this.movie.Released : '', disabled: this.isEdit }),
      Runtime: new FormControl({ value: this.movie ? this.movie.Runtime : '', disabled: this.isEdit }),
      Type: new FormControl({ value: this.movie ? this.movie.Type : '', disabled: this.isEdit }),
      Website: new FormControl({ value: this.movie ? this.movie.Website : '', disabled: this.isEdit }),
      Writer: new FormControl({ value: this.movie ? this.movie.Writer : '', disabled: this.isEdit }),
      Year: new FormControl({ value: this.movie ? this.movie.Year : '', disabled: this.isEdit }),
      imdbVotes: new FormControl({ value: this.movie ? this.movie.imdbVotes : '', disabled: this.isEdit }),
    })
  }

  getFormTitle() {
    return this.isEdit ? "D??zenle" : "Ekle";
  }

  saveButton() {
    if (!this.movieForm.valid) {
      this.movieForm.markAllAsTouched();
      this.toastr.warning('Gerekli alanlar?? doldurunuz.')
      return;
    }
    const newMovie: MovieModel = this.movieForm.getRawValue();

    if (this.isEdit) {
      this.movieCommunicateService.updateMovie(this.movie.imdbID, newMovie);
    }
    else {
      this.movieCommunicateService.addMovie(newMovie)
    }
    this.activeModal.close();
  }

  generateMovie() {
    this.movieForm.patchValue({
      Title: 'Zugurt Aga',
      imdbRating: "8.7",
      Actors: "??ener ??en, Erdal ??zya??c??lar, F??sun Demirel, Nilg??n Nazl??, Atilla Yi??it, Can Koluk??sa, Bahri Selin",
      Poster: 'https://upload.wikimedia.org/wikipedia/tr/thumb/7/73/Z%C3%BC%C4%9F%C3%BCrt_A%C4%9Fa_film.jpg/220px-Z%C3%BC%C4%9F%C3%BCrt_A%C4%9Fa_film.jpg',
      Plot: "T??rkiye'de feodalizmin ????k??????n?? konu alan filmde ??ener ??en Haraptar k??y??n??n a??as??d??r. K??ye sonradan ??al????mak i??in gelen kurnaz Keke?? Salman, kurakl??k sebebiyle yeterince ??r??n elde edemeyen k??y halk??n?? ??rg??tleyerek A??a'n??n mallar??n?? ??almalar??n?? ve bu mallar?? satarak ??stanbul'a g????melerini sa??lar. Elinde avucunda pek az ??ey kalan ve marabalar??n?? kaybeden A??a da k??yden kente g????erek aslen iyi y??rekli ki??ili??i ve ailesi ile ??stanbul'da yeni bir ya??am kurmaya ??al????acakt??r.",
      Awards: "Uluslararas?? ??stanbul Sinema G??nleri Y??l??n En ??yi T??rk Filmi",
      BoxOffice: "",
      Country: "T??rkiye",
      DVD: "",
      Director: "Nesli ????lge??en",
      Genre: "Dram, Komedi",
      Language: "T??rk??e",
      Production: "Kadri Yurdatap",
      Released: "01 01 1986",
      Runtime: "110 Dakika",
      Type: "Sinema filmi",
      Website: "",
      Writer: "Yavuz Turgul",
      Year: "1985",
      imdbVotes: "8.7",
    });
  }


}
