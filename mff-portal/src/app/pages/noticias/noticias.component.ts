import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Noticia } from '../../models/noticia.model';
import { ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NoticiasComponent implements OnInit {

  private apiService = inject(ApiService);

  public noticias$!: Observable<Noticia[]>;

  ngOnInit(): void {
    this.noticias$ = this.apiService.getNoticias();
  }
}