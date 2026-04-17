import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { generateBudgetTemplate, ROOM_NAMES, type RoomKey } from '../utils/templateGenerator';
import { templateSignup } from '../utils/templateSignup';

const ALL_ROOMS: { key: RoomKey; emoji: string }[] = [
  { key: 'lazienka',   emoji: '🚿' },
  { key: 'kuchnia',    emoji: '🍳' },
  { key: 'salon',      emoji: '🛋️' },
  { key: 'sypialnia',  emoji: '🛏️' },
  { key: 'korytarz',   emoji: '🚪' },
  { key: 'instalacje', emoji: '⚡' },
];

export default function SzablonBudzetuRemontu() {
  const [selectedRooms, setSelectedRooms] = useState<RoomKey[]>(
    ALL_ROOMS.map(r => r.key)
  );
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const toggleRoom = (key: RoomKey) => {
    setSelectedRooms(prev =>
      prev.includes(key) ? prev.filter(r => r !== key) : [...prev, key]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Podaj poprawny adres email'); return; }
    if (selectedRooms.length === 0) { setError('Wybierz co najmniej jedno pomieszczenie'); return; }
    setError('');
    generateBudgetTemplate(selectedRooms);
    setSubmitted(true);
    templateSignup(email, selectedRooms).catch(console.error);
  };

  return (
    <>
      <Helmet>
        <title>Darmowy szablon budżetu remontu 2026 | RenoHub</title>
        <meta
          name="description"
          content="Arkusz Excel do planowania kosztów remontu — osobna karta dla każdego pomieszczenia, ceny materiałów 2026. Pobierz za darmo."
        />
      </Helmet>

      <main className="min-h-screen bg-gray-950 text-white pb-24">
        {/* Hero */}
        <div className="max-w-2xl mx-auto px-4 pt-16 pb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Darmowy szablon budżetu remontu 2026
          </h1>
          <p className="text-gray-400 text-lg">
            Arkusz Excel — rozpisz koszty każdego pomieszczenia osobno
          </p>
          <ul className="mt-6 text-left space-y-2 text-gray-300 text-sm max-w-md mx-auto">
            <li>✓ Osobna karta dla każdego pomieszczenia</li>
            <li>✓ Ceny materiałów wg stawek rynkowych 2026</li>
            <li>✓ Automatyczne sumowanie kosztów</li>
            <li>✓ Rezerwa budżetowa i robocizna wliczone</li>
          </ul>
        </div>

        {/* Card */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-gray-900 border border-white/5 rounded-2xl p-6 space-y-6">
            {!submitted ? (
              <>
                <div>
                  <p className="text-sm font-semibold text-white mb-3">
                    Które pomieszczenia remontujesz?
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ALL_ROOMS.map(({ key, emoji }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleRoom(key)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                          selectedRooms.includes(key)
                            ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                            : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <span>{emoji}</span>
                        <span>{ROOM_NAMES[key]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    inputMode="email"
                    placeholder="twoj@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
                  >
                    Pobierz szablon za darmo →
                  </button>
                  <p className="text-xs text-gray-500">
                    Pobierając, zgadzasz się na otrzymywanie informacji o CalcReno.{' '}
                    <a href="/privacy-policy" className="underline hover:text-gray-300">
                      Polityka prywatności
                    </a>
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto">
                  <span className="text-teal-400 text-xl">✓</span>
                </div>
                <p className="font-semibold text-white text-lg">Szablon pobierany!</p>
                <p className="text-sm text-gray-400">
                  Plik Excel pojawi się w folderze Pobrane.
                  Wyślemy też potwierdzenie na podany adres email.
                </p>
                <a
                  href="/kalkulator-remontu"
                  className="inline-block mt-4 text-teal-400 text-sm hover:underline"
                >
                  Oblicz dokładny kosztorys jednego pomieszczenia →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
