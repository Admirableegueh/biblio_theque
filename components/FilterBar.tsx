// components/FilterBar.tsx
interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  categories: string[];
}

export default function FilterBar({ searchTerm, onSearchChange, selectedCategory, onCategoryChange, categories }: FilterBarProps) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Rechercher un livre..."
        className="p-2 border rounded mb-4 w-full"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className="p-2 border rounded w-full"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">Toutes les catégories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}
