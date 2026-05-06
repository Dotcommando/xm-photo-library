export interface IPhoto {
  id: string;
  seed: string;
  thumbnailUrl: string;
  fullUrl: string;
}

export interface IPhotosPage {
  items: IPhoto[];
  nextOffset: number;
}
