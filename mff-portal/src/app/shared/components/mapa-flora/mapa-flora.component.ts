import { Component, Input, AfterViewInit, ChangeDetectionStrategy, ElementRef, OnDestroy, NgZone} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Planta } from '../../../models/planta.model';

declare var L: any;

@Component({
  selector: 'app-mapa-flora',
  standalone: true,
  imports: [CommonModule],
  template: '', 
  styles: [':host { display: block; height: 450px; width: 100%; border-radius: 8px; z-index: 1; }'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapaFloraComponent implements AfterViewInit, OnDestroy {
  @Input() set plantasFiltradas(plantas: Planta[]) {
    this._plantas = plantas;
    if (this.map) {
      this.atualizarMarcadores();
    }
  }
  private _plantas: Planta[] = [];
  
  private map: any;
  private markersLayer: any;

  constructor(private elRef: ElementRef, 
              private router: Router, 
              private ngZone: NgZone) { 
    const iconRetinaUrl = 'assets/mapa/leaflet/marker-mff-2x.png';
    const iconUrl = 'assets/mapa/leaflet/marker-mff.png';
    const shadowUrl = 'assets/mapa/leaflet/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl, iconUrl, shadowUrl,
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
      tooltipAnchor: [16, -28], shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private inicializarMapa(): void {
    if (this.map) return;

    this.map = L.map(this.elRef.nativeElement).setView([-22.0029, -47.8913], 16);
    this.markersLayer = new L.FeatureGroup().addTo(this.map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxNativeZoom: 19,
      maxZoom: 22    
    }).addTo(this.map);

    this.map.on('popupopen', (e: any) => {
      const popupContent = e.popup._contentNode;
      const link = popupContent.querySelector('.popup-navigation-link');
      if (link) {
        link.addEventListener('click', (event: MouseEvent) => {
          event.preventDefault(); // Previne o comportamento padrão do link
          const id = (event.currentTarget as HTMLElement).dataset['id'];
          if (id) {
            this.navegarParaPlanta(id);
          }
        });
      }
    });

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
      if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
        const popupContent = `
          <div style="text-align: center;">
            <b style="font-size: 1.1em;">${planta.nomePopular}</b><br>
            <i style="font-size: 0.9em;">${planta.nomeCientifico}</i>
            <hr style="margin: 8px 0; border: 0; border-top: 1px solid #ccc;">
            <a href="/Ficha/${planta.idIndividuo}" 
               class="popup-navigation-link" 
               data-id="${planta.idIndividuo}"
               style="color: #3a8c3a; font-weight: bold; text-decoration: none;">
              Ver Detalhes &rarr;
            </a>
          </div>
        `;

        const marker = L.marker([lat, lng]).bindPopup(popupContent);
        this.markersLayer.addLayer(marker);
      }
    });
    
    setTimeout(() => {
      this.map.invalidateSize();
      this.map.fitBounds(this.markersLayer.getBounds(), { 
        padding: [50, 50],
        maxZoom: 22
      });
    }, 0);
  }
    private navegarParaPlanta(id: string): void {
    this.ngZone.run(() => {
      this.router.navigate(['/flora', id]);
    });
  }
}