/**
 * Habit Category Filter Component
 *
 * Filter buttons/tabs: All, Morning, Evening, Other.
 * Highlights the selected category. Matches Design/README (filter pills).
 */

import type { HabitCategoryFilterProps, HabitCategory } from '../../types';

const CATEGORY_OPTIONS: { value: HabitCategory | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'MORNING', label: 'Morning' },
  { value: 'EVENING', label: 'Evening' },
  { value: 'OTHER', label: 'Other' },
];

const baseButtonClasses =
  'inline-flex items-center justify-center rounded-card px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
const unselectedClasses =
  'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400';
const selectedClasses =
  'bg-primary text-white hover:bg-primary-hover focus:ring-primary-light';

export function HabitCategoryFilter({
  selectedCategory,
  onCategoryChange,
}: HabitCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {CATEGORY_OPTIONS.map((option) => {
        const isSelected = selectedCategory === option.value;
        return (
          <button
            key={option.value ?? 'all'}
            type="button"
            onClick={() => onCategoryChange(option.value)}
            className={`${baseButtonClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
            aria-pressed={isSelected}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
