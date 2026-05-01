import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { generateBudgetTemplate, ROOM_NAMES, type RoomKey } from '../utils/templateGenerator';
import { generateBudgetPdf } from '../utils/pdfGenerator';
import { templateSignup } from '../utils/templateSignup';

const ALL_ROOMS: { key: RoomKey }[] = [
  { key: 'lazienka' },
  { key: 'kuchnia' },
  { key: 'salon' },
  { key: 'sypialnia' },
  { key: 'korytarz' },
  { key: 'instalacje' },
];

type Format = 'excel' | 'pdf';

export default function SzablonBudzetuRemontu() {
  const [selectedRooms, setSelectedRooms] = useState<RoomKey[]>(
    ALL_ROOMS.map(r => r.key)
  );
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [downloaded, setDownloaded] = useState<Set<Format>>(new Set());
  const [loading, setLoading] = useState<Format | null>(null);

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
    setSubmitted(true);
  };

  const handleDownload = async (format: Format) => {
    if (loading) return;
    setLoading(format);

    // Fire email only once regardless of how many formats they download
    if (!emailSent) {
      setEmailSent(true);
      templateSignup(email, selectedRooms).catch(console.error);
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', { send_to: 'AW-17946979757/yGBiCICctvwbEK3b5O1C' });
      }
    }

    try {
      if (format === 'excel') {
        await generateBudgetTemplate(selectedRooms);
      } else {
        generateBudgetPdf(selectedRooms);
      }
      setDownloaded(prev => new Set(prev).add(format));
    } catch (err) {
      console.error(`[download ${format}]`, err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Darmowy szablon budżetu remontu 2026 | RenoHub</title>
        <meta
          name="description"
          content="Arkusz Excel lub PDF do planowania kosztów remontu — osobna sekcja dla każdego pomieszczenia, ceny materiałów 2026. Pobierz za darmo."
        />
      </Helmet>

      <main className="min-h-screen bg-gray-950 text-white pb-24">
        {/* Hero */}
        <div className="max-w-2xl mx-auto px-4 pt-16 pb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Darmowy szablon budżetu remontu 2026
          </h1>
          <p className="text-gray-400 text-lg">
            Pobierz Excel lub PDF — rozpisz koszty każdego pomieszczenia osobno
          </p>
          <ul className="mt-6 text-left space-y-2 text-gray-300 text-sm max-w-md mx-auto">
            <li>✓ Osobna sekcja dla każdego pomieszczenia</li>
            <li>✓ Ceny materiałów wg stawek rynkowych 2026</li>
            <li>✓ Automatyczne sumowanie kosztów (Excel)</li>
            <li>✓ Gotowy do druku szablon (PDF)</li>
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
                    {ALL_ROOMS.map(({ key }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleRoom(key)}
                        className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors text-left ${
                          selectedRooms.includes(key)
                            ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                            : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {ROOM_NAMES[key]}
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
                    Dalej — wybierz format →
                  </button>
                  <p className="text-xs text-gray-500">
                    Pobierając, zgadzasz się na otrzymywanie informacji od RenoHub.{' '}
                    <a href="/privacy-policy" className="underline hover:text-gray-300">
                      Polityka prywatności
                    </a>
                  </p>
                </form>
              </>
            ) : (
              <div className="space-y-5">
                <div className="text-center space-y-1">
                  <p className="font-semibold text-white text-lg">Wybierz format do pobrania</p>
                  <p className="text-sm text-gray-400">
                    Możesz pobrać oba — potwierdzenie e-mail zostanie wysłane tylko raz.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Excel button */}
                  <button
                    type="button"
                    onClick={() => handleDownload('excel')}
                    disabled={loading === 'excel'}
                    className={`relative flex flex-col gap-1.5 p-4 rounded-xl border text-left transition-colors ${
                      downloaded.has('excel')
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    } disabled:opacity-60`}
                  >
                    {downloaded.has('excel') && (
                      <span className="absolute top-3 right-3 text-teal-400 text-xs font-semibold">Pobrano</span>
                    )}
                    <span className="text-sm font-semibold text-white">Excel (.xlsx)</span>
                    <span className="text-xs text-gray-400">
                      Formuły, automatyczne sumowanie, edytowalne komórki
                    </span>
                    <span className={`text-xs font-semibold mt-1 ${downloaded.has('excel') ? 'text-teal-400' : 'text-teal-500'}`}>
                      {loading === 'excel' ? 'Generowanie...' : 'Pobierz →'}
                    </span>
                  </button>

                  {/* PDF button */}
                  <button
                    type="button"
                    onClick={() => handleDownload('pdf')}
                    disabled={loading === 'pdf'}
                    className={`relative flex flex-col gap-1.5 p-4 rounded-xl border text-left transition-colors ${
                      downloaded.has('pdf')
                        ? 'border-teal-500 bg-teal-500/10'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    } disabled:opacity-60`}
                  >
                    {downloaded.has('pdf') && (
                      <span className="absolute top-3 right-3 text-teal-400 text-xs font-semibold">Pobrano</span>
                    )}
                    <span className="text-sm font-semibold text-white">PDF</span>
                    <span className="text-xs text-gray-400">
                      Gotowy do druku, lista materiałów z cenami
                    </span>
                    <span className={`text-xs font-semibold mt-1 ${downloaded.has('pdf') ? 'text-teal-400' : 'text-teal-500'}`}>
                      {loading === 'pdf' ? 'Generowanie...' : 'Pobierz →'}
                    </span>
                  </button>
                </div>

                {emailSent && (
                  <p className="text-xs text-gray-500 text-center">
                    Wysłaliśmy potwierdzenie na {email}
                  </p>
                )}

                <div className="border-t border-white/5 pt-4 text-center">
                  <a
                    href="/kalkulator-remontu"
                    className="text-teal-400 text-sm hover:underline"
                  >
                    Oblicz dokładny kosztorys jednego pomieszczenia →
                  </a>
                </div>

                <div className="border border-teal-500/30 bg-teal-500/5 rounded-xl p-4 space-y-2.5">
                  <p className="text-sm font-semibold text-white">
                    Chcesz pełne doświadczenie mobilne?
                  </p>
                  <p className="text-xs text-gray-400">
                    Zarejestruj konto teraz i zablokuj 3 miesiące za darmo przy starcie.
                  </p>
                  <a
                    href="/register"
                    className="block w-full text-center border border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Zarejestruj konto w RenoHub →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
