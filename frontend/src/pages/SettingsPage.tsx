/**
 * Settings Page
 *
 * User profile, language, notification settings, and logout.
 */

import { useNavigate } from 'react-router-dom';
import { NotificationSettings } from '../components/notifications/NotificationSettings';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../store/authStore';

export function SettingsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] p-6">
      <div className="mx-auto max-w-xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--color-text-heading)]">
            Settings
          </h1>
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </Button>
        </header>

        <section className="rounded-card border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-[var(--color-text-heading)]">
            Profile
          </h2>
          {user != null && (
            <dl className="text-sm text-[var(--color-text)]">
              <div>
                <dt className="inline font-medium opacity-80">Email: </dt>
                <dd className="inline">{user.email}</dd>
              </div>
              {user.name != null && user.name !== '' && (
                <div>
                  <dt className="inline font-medium opacity-80">Name: </dt>
                  <dd className="inline">{user.name}</dd>
                </div>
              )}
            </dl>
          )}
        </section>

        <section className="rounded-card border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-[var(--color-text-heading)]">
            Language
          </h2>
          <LanguageSwitcher />
        </section>

        <NotificationSettings />

        <section className="rounded-card border border-gray-200 bg-white p-6 shadow-sm">
          <Button type="button" variant="danger" onClick={handleLogout}>
            Log out
          </Button>
        </section>
      </div>
    </div>
  );
}
