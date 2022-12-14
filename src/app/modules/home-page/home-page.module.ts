import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieCardComponent } from './home/movie-card/movie-card.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { MovieFormComponent } from './home/movie-form/movie-form.component';


@NgModule({
  declarations: [HomeComponent, MovieCardComponent, MovieFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent },
    ]),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
  ]
})
export class HomePageModule { }
