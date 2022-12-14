import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from 'src/app/modules/shared/confirm-modal/confirm-modal.component';
import { MovieCommunicateService } from '../../../../core/services/movie-communicate.service';
import { MovieFormComponent } from '../movie-form/movie-form.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})

export class MovieCardComponent implements OnInit {

  constructor(
    private movieCommunicateService: MovieCommunicateService,
    private ngbModal: NgbModal
  ) { }

  @Input() movie: any;

  ngOnInit(): void {
  }

  editMovie() {
    const modalRef = this.ngbModal.open(MovieFormComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    })
    modalRef.componentInstance.movie = this.movie;
    modalRef.componentInstance.isEdit = true;
  }
  deleteMovie() {
    const modalRef = this.ngbModal.open(ConfirmModalComponent, {
      size: 'm',
      backdrop: 'static',
      keyboard: false
    })

    modalRef.componentInstance.title = 'Film Silme';
    modalRef.componentInstance.confirmMessage = `${this.movie.Title} filmini silmek istediğinizden emin misiniz?`

    modalRef.result.then(confirmResult => {
      if (confirmResult == true) {
        this.movieCommunicateService.deleteMovie(this.movie.imdbID);
      }
    })

  }
  goToDetails() {
    console.log("detail", this.movie)
  }


}
