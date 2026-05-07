import { useT } from '../i18n';
import RegistrationForm from './RegistrationForm';
import PlayerRow from './PlayerRow';

function formatDate(iso, lang) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function GameView({ game, players, onRequestNewGame }) {
  const { t, lang } = useT();
  const max = game.maxPlayers;
  const count = players.length;
  const remaining = Math.max(0, max - count);
  const isFull = count >= max;

  return (
    <div className="game-view">
      <section className="card">
        <h2 className="game-when">
          {t('gameOn', { date: formatDate(game.date, lang), time: game.time })}
        </h2>
        <p className="game-count">
          <strong>{count}</strong> {t('of')} <strong>{max}</strong>
        </p>
        <p className={isFull ? 'spots full' : 'spots'}>
          {isFull ? t('gameFull') : t('spotsRemaining', { n: remaining })}
        </p>
      </section>

      <section className="card">
        <h3>{t('registeredPlayers')}</h3>
        {players.length === 0 ? (
          <p className="muted">—</p>
        ) : (
          <ul className="player-list">
            {players.map((p, i) => (
              <PlayerRow key={p.id} player={p} index={i} allPlayers={players} />
            ))}
          </ul>
        )}
        <RegistrationForm players={players} disabled={isFull} />
      </section>

      <button type="button" className="btn btn-link new-game-link" onClick={onRequestNewGame}>
        {t('newGame')}
      </button>
    </div>
  );
}
