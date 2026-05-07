import { useState } from 'react';
import { useT } from '../i18n';
import { createGame } from '../hooks/useGame';

export default function CreateGameForm({ existingGame, onDone, onCancel }) {
  const { t } = useT();
  const [date, setDate] = useState(existingGame?.date ?? '');
  const [time, setTime] = useState(existingGame?.time ?? '');
  const [maxPlayers, setMaxPlayers] = useState(existingGame?.maxPlayers ?? 14);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!date || !time) {
      setError(t('invalidDateTime'));
      return;
    }
    const max = Number(maxPlayers);
    if (!Number.isInteger(max) || max < 1 || max > 50) {
      setError(t('invalidMaxPlayers'));
      return;
    }
    if (existingGame && !window.confirm(t('replaceGameWarning'))) {
      return;
    }

    setSubmitting(true);
    try {
      await createGame({ date, time, maxPlayers: max });
      onDone();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{t('createNewGameTitle')}</h2>

      <label className="field">
        <span>{t('date')}</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label className="field">
        <span>{t('time')}</span>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </label>

      <label className="field">
        <span>{t('maxPlayers')}</span>
        <input
          type="number"
          min="1"
          max="50"
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(e.target.value)}
          required
        />
      </label>

      {error && <p className="error">{error}</p>}

      <div className="actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {t('create')}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}
