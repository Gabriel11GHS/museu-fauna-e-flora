export interface Planta {
  // Mantidos da listagem
  idIndividuo: string;
  nomePopular: string | null;
  nomeCientifico: string | null;
  familia: string | null;
  nomeLocal: string;
  fotoIndividuo: string | null;
  fotoTaxonomia: string | null;
  trilhaAudio: string | null;
  anoPlantio: string | null;
  
  // Novos campos da API de detalhe
  latitude?: string;
  longitude?: string;
  circunferencia?: string;
  diametro?: string;
  procedencia?: string;
  observacao?: string;
  altura?: string;
  diametro_copa?: string;
  ano_supressao?: string | null;

  // Campos que já existiam mas podem ser úteis manter
  idTaxonomia: string;
  idLocal: string;
}