export interface Poster {
  id: string;
  image: string;
  alt: string;
}

export const posterData: Poster[] = [
  {
    id: 'poster-1',
    image: '/images/poster-1.jpg', // Ganti dengan path gambar poster yang sebenarnya
    alt: 'Kasiko Coffee Poster 1',
  },
  {
    id: 'poster-2',
    image: '/images/poster-2.jpg', // Ganti dengan path gambar poster yang sebenarnya
    alt: 'Kasiko Coffee Poster 2',
  },
  {
    id: 'poster-3',
    image: '/images/poster-3.jpg', // Ganti dengan path gambar poster yang sebenarnya
    alt: 'Kasiko Coffee Poster 3',
  },
];

