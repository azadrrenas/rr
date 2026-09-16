import type {
  Perfume,
  Bag,
  Pen,
  StationeryItem,
  Movie,
  Series,
  MusicSheet,
  GalleryPhoto,
} from "@prisma/client";

export type {
  Perfume,
  Bag,
  Pen,
  StationeryItem,
  Movie,
  Series,
  MusicSheet,
  GalleryPhoto,
};

/** Perfume oluşturma/güncelleme formlarında kullanılan giriş tipi. */
export interface PerfumeInput {
  title: string;
  description?: string;
  coverImage?: string;
  externalLink?: string;
  isFavorite?: boolean;
  displayOrder?: number;
  brand?: string;
  notes?: string;
}

export interface BagInput {
  title: string;
  description?: string;
  coverImage?: string;
  externalLink?: string;
  isFavorite?: boolean;
  displayOrder?: number;
  brand?: string;
  model?: string;
  color?: string;
}

export interface PenInput {
  title: string;
  description?: string;
  coverImage?: string;
  externalLink?: string;
  isFavorite?: boolean;
  displayOrder?: number;
  brand?: string;
  model?: string;
}

export interface StationeryItemInput {
  title: string;
  description?: string;
  coverImage?: string;
  externalLink?: string;
  isFavorite?: boolean;
  displayOrder?: number;
  itemType?: string;
}

export interface ShowInput {
  title: string;
  description?: string;
  coverImage?: string;
  isFavorite?: boolean;
  displayOrder?: number;
  genre?: string;
  imdbRating?: number;
  releaseYear?: number;
  trailerLink?: string;
  watchLink?: string;
}

export interface MusicSheetInput {
  title: string;
  description?: string;
  coverImage?: string;
  isFavorite?: boolean;
  displayOrder?: number;
  composer?: string;
  pdfUrl?: string;
  listenLink?: string;
  youtubeLink?: string;
  spotifyLink?: string;
}

export interface GalleryPhotoInput {
  title?: string;
  description?: string;
  coverImage: string;
  isFavorite?: boolean;
  displayOrder?: number;
  category?: string;
}

/** Api'lerden dönen standart hata gövdesi. */
export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

/** Dashboard istatistik kartları için tip. */
export interface DashboardStats {
  totalPerfumes: number;
  totalBags: number;
  totalPens: number;
  totalStationeryItems: number;
  totalMovies: number;
  totalSeries: number;
  totalMusicSheets: number;
  totalGalleryPhotos: number;
}
