// src/app/pages/flora/mapa-flora.component.ts

import { Component, Input, AfterViewInit, ChangeDetectionStrategy, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Planta } from '../../models/planta.model';

declare var L: any;

@Component({
  selector: 'app-mapa-flora',
  standalone: true,
  imports: [CommonModule],
  // MODIFICAÇÃO: Usamos o host para obter a referência do elemento
  template: '', 
  styles: [':host { display: block; height: 450px; width: 100%; border-radius: 8px; z-index: 1; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapaFloraComponent implements AfterViewInit, OnDestroy {
  // Usamos um setter para reagir à chegada de novos dados
  @Input() set plantasFiltradas(plantas: Planta[]) {
    this._plantas = plantas;
    // Se o mapa já foi inicializado, apenas atualiza os marcadores
    if (this.map) {
      this.atualizarMarcadores();
    }
  }
  private _plantas: Planta[] = [];
  
  private map: any;
  private markersLayer: any;

  constructor(private elRef: ElementRef) { // Injetamos a referência do elemento
    // A configuração dos ícones continua correta aqui.
    const iconRetinaUrl = 'assets/images/leaflet/marker-icon-2x.png';
    const iconUrl = 'assets/images/leaflet/marker-icon.png';
    const shadowUrl = 'assets/images/leaflet/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl, iconUrl, shadowUrl,
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
      tooltipAnchor: [16, -28], shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  ngAfterViewInit(): void {
    // A inicialização agora acontece aqui, no elemento hospedeiro do componente
    this.inicializarMapa();
  }

  ngOnDestroy(): void {
    // Boa prática: remove o mapa ao destruir o componente para evitar vazamentos de memória
    if (this.map) {
      this.map.remove();
    }
  }

  private inicializarMapa(): void {
    if (this.map) return;

    // O mapa agora é criado no próprio elemento do componente (<app-mapa-flora>)
    this.map = L.map(this.elRef.nativeElement).setView([-22.0029, -47.8913], 16);
    this.markersLayer = new L.FeatureGroup().addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Como os dados podem ter chegado antes do mapa ser inicializado,
    // chamamos atualizarMarcadores aqui para a carga inicial.
    this.atualizarMarcadores();
  }

  private atualizarMarcadores(): void {
    if (!this.map) return;

    this.markersLayer.clearLayers();
    
    const plantasComCoord = this._plantas.filter(p => p.latitude && p.longitude);

    if (plantasComCoord.length === 0) {
      this.map.setView([-22.0029, -47.8913], 16);
      return;
    }

    plantasComCoord.forEach(planta => {
      const lat = parseFloat(planta.latitude!);
      const lng = parseFloat(planta.longitude!);
      if (!isNaN(lat) && !isNaN(lng)) {
        const marker = L.marker([lat, lng]).bindPopup(`<b>${planta.nomePopular}</b><br><i>${planta.nomeCientifico}</i>`);
        this.markersLayer.addLayer(marker);
      }
    });
    
    // Forçamos o recalculo do tamanho e ajustamos o zoom
    // O setTimeout garante que isso ocorra após a renderização final do Angular
    setTimeout(() => {
      this.map.invalidateSize();
      this.map.fitBounds(this.markersLayer.getBounds(), { padding: [50, 50] });
    }, 0);
  }
}