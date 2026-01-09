export interface Poster {
  id: string;
  image: string;
  alt: string;
}

export const posterData: Poster[] = [
  {
    id: 'poster-1',
    image: '/images/kasiko.jpg', // Ganti dengan path gambar poster yang sebenarnya
    alt: 'Kasiko Coffee Poster 1',
  },
  {
    id: 'poster-2',
    image: '/images/kasiko2.jpg', // Ganti dengan path gambar poster yang sebenarnya
    alt: 'Kasiko Coffee Poster 2',
  },
  {
    id: 'poster-3',
    image: '/images/kasiko3.jpg', // Ganti dengan path gambar poster yang sebenarnya
    alt: 'Kasiko Coffee Poster 3',
  },
];

