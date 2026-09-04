export interface GenreConfig {
  id: string;
  name: string;
  nameKz: string;
  slug: string;
}

export const BOOK_GENRES: GenreConfig[] = [
  { id: 'all', name: 'Все категории', nameKz: 'Барлық санаттар', slug: 'all' },
  { id: 'fiction', name: 'Художественная литература', nameKz: 'Көркем әдебиет', slug: 'fiction' },
  { id: 'kazakh_classics', name: 'Казахская классика', nameKz: 'Қазақ классикасы', slug: 'kazakh-classics' },
  { id: 'business', name: 'Бизнес и саморазвитие', nameKz: 'Бизнес және даму', slug: 'business' },
  { id: 'psychology', name: 'Психология', nameKz: 'Психология', slug: 'psychology' },
  { id: 'children', name: 'Детская литература', nameKz: 'Балалар әдебиеті', slug: 'children' },
  { id: 'history', name: 'История Казахстана', nameKz: 'Қазақстан тарихы', slug: 'history' },
];
