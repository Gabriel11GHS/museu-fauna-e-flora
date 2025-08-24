import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Planta } from '../../models/planta.model';

declare var L: any;

@Component({
  selector: 'app-mapa-flora',
  standalone: true,
  imports: [CommonModule],
  template: `<div id="flora-map" style="height: 450px; width: 100%; border-radius: 8px; z-index: 1;"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapaFloraComponent implements AfterViewInit, OnChanges {
  @Input() plantasFiltradas: Planta[] = [];
  private map: any;
  private markersLayer = new L.FeatureGroup();

   constructor() {
    // Esta é a correção principal: redefine o caminho padrão dos ícones do Leaflet
    const iconRetinaUrl = 'assets/mapa/leaflet/marker-icon-2x.png';
    const iconUrl = 'assets/mapa/leaflet/marker-icon.png';
    const shadowUrl = 'assets/mapa/leaflet/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['plantasFiltradas'] && this.map) {
      this.atualizarMarcadores();
    }
  }

  private inicializarMapa(): void {
    if (this.map) return;
    this.map = L.map('flora-map').setView([-22.0029, -47.8913], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    this.map.addLayer(this.markersLayer);
    this.atualizarMarcadores();
  }

  private atualizarMarcadores(): void {
    this.markersLayer.clearLayers();
    if (!this.plantasFiltradas || this.plantasFiltradas.length === 0) {
      this.map.setView([-22.0029, -47.8913], 16);
      return;
    }

    this.plantasFiltradas.forEach(planta => {
      if (planta.latitude && planta.longitude) {
        const lat = parseFloat(planta.latitude);
        const lng = parseFloat(planta.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = L.marker([lat, lng]).bindPopup(`<b>${planta.nomePopular}</b><br><i>${planta.nomeCientifico}</i>`);
          this.markersLayer.addLayer(marker);
        }
      }
    });

    if (this.markersLayer.getLayers().length > 0) {
      this.map.fitBounds(this.markersLayer.getBounds(), { padding: [50, 50] });
    } else {
      this.map.setView([-22.0029, -47.8913], 16);
    }
  }
}