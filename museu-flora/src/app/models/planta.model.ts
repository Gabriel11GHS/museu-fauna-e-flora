export interface Planta {
  id: number;
  nome: string;               // nomePopular
  nomeCientifico: string;     // nomeCientifico
  classeCientifica: string;   // familia
  local: string;              // nomeLocal
  imagem?: string;            // fotoTaxonomia ou fotoIndividuo
  audio?: string;             // trilhaAudio
}
