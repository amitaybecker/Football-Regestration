import { useState } from 'react';
import { useT } from '../i18n';
import { removePlayer, updatePlayerName } from '../hooks/useGame';

export default function PlayerRow({ player, index, allPlayers }) {
  const { t } = useT();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(player.name);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSave() {
    setError('');
    const trimmed = draft.trim();
    if (!trimmed) {
      setError(t('nameRequired'));
      return;
    }
    const dup = allPlayers.some(
      (p) => p.id !== player.id && p.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (dup) {
      setError(t('alreadyRegistered'));
      return;
    }
    setBusy(true);
    try {
      await updatePlayerName(player.id, trimmed);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(t('confirmDelete', { name: player.name }))) return;
    setBusy(true);
    try {
      await removePlayer(player.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <li className="player-row">
      <span className="player-num">{index + 1}.</span>
      {editing ? (
        <>
          <input
            className="player-edit-input"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={50}
            autoFocus
          />
          <button
            type="button"
            className="btn btn-small btn-primary"
            onClick={handleSave}
            disabled={busy}
          >
            {t('save')}
          </button>
          <button
            type="button"
            className="btn btn-small btn-secondary"
            onClick={() => {
              setEditing(false);
              setDraft(player.name);
              setError('');
            }}
            disabled={busy}
          >
            {t('cancel')}
          </button>
        </>
      ) : (
        <>
          <span className="player-name">{player.name}</span>
          <button
            type="button"
            className="btn btn-small btn-secondary"
            onClick={() => setEditing(true)}
            disabled={busy}
          >
            {t('edit')}
          </button>
          <button
            type="button"
            className="btn btn-small btn-danger"
            onClick={handleDelete}
            disabled={busy}
          >
            {t('delete')}
          </button>
        </>
      )}
      {error && <p className="error error-inline">{error}</p>}
    </li>
  );
}
