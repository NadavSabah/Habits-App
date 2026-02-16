/**
 * Language Switcher Component
 *
 * Lets the user change the app language. Used in Settings and optionally in header.
 */

import type { SupportedLocale } from '../../types';
import { useLocaleStore } from '../../store/localeStore';

const LOCALE_OPTIONS: { value: SupportedLocale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'he', label: 'עברית' },
];

export function LanguageSwitcher() {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="language-select"
        className="text-sm font-medium text-[var(--color-text)]"
      >
        Language
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={(event) => setLocale(event.target.value as SupportedLocale)}
        className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-[var(--color-text)] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        aria-label="Select language"
      >
        {LOCALE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
