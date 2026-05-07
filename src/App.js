import { useState } from 'react';
import { isConfigured } from './firebase';
import { useT } from './i18n';
import { useGame } from './hooks/useGame';
import GameView from './components/GameView';
import CreateGameForm from './components/CreateGameForm';
import LanguageToggle from './components/LanguageToggle';
import './App.css';

export default function App() {
  const { t } = useT();
  const { game, players, loading } = useGame();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('appTitle')}</h1>
        <LanguageToggle />
      </header>

      <main className="app-main">
        {!isConfigured && <div className="banner banner-error">{t('notConfigured')}</div>}

        {isConfigured && loading && <div className="banner">{t('loading')}</div>}

        {isConfigured && !loading && !game && !showCreate && (
          <div className="empty-state">
            <p>{t('noActiveGame')}</p>
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              {t('createGameCta')}
            </button>
          </div>
        )}

        {isConfigured && !loading && game && !showCreate && (
          <GameView
            game={game}
            players={players}
            onRequestNewGame={() => setShowCreate(true)}
          />
        )}

        {isConfigured && showCreate && (
          <CreateGameForm
            existingGame={game}
            onDone={() => setShowCreate(false)}
            onCancel={() => setShowCreate(false)}
          />
        )}
      </main>
    </div>
  );
}
