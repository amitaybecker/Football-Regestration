import { useState } from 'react';
import { useT } from '../i18n';
import { registerPlayer } from '../hooks/useGame';

export default function RegistrationForm({ players, disabled }) {
  const { t } = useT();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t('nameRequired'));
      return;
    }
    const exists = players.some(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      setError(t('alreadyRegistered'));
      return;
    }
    setSubmitting(true);
    try {
      await registerPlayer(trimmed);
      setName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('yourName')}
        maxLength={50}
        disabled={disabled || submitting}
        aria-label={t('yourName')}
      />
      <button type="submit" className="btn btn-primary" disabled={disabled || submitting}>
        {t('register')}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
