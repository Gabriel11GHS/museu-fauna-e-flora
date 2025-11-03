export interface Planta {
  idIndividuo: string;
  nomePopular: string | null;
  nomeCientifico: string | null;
  familia: string | null;
  nomeLocal: string;
  fotoIndividuo: string | null;
  fotoTaxonomia: string | null;
  trilhaAudio: string | null;
  anoPlantio: string | null;
  latitude?: string;
  longitude?: string;
  circunferencia?: string;
  diametro?: string;
  procedencia?: string;
  observacao?: string;
  altura?: string;
  diametro_copa?: string;
  ano_supressao?: string | null;
  idTaxonomia: string;
  idLocal: string;
  suprimido?: string | null;
}