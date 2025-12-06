import React, { useState, useCallback, useRef } from 'react';
import { Movie, SearchState } from './types';
import { searchMoviesWithGemini } from './services/geminiService';
import MovieCard from './components/MovieCard';
import MovieModal from './components/MovieModal';
import { SearchIcon, FilmIcon } from './components/Icons';

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    loading: false,
    error: null,
    hasSearched: false,
  });
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const query = state.query.trim();
    if (!query) return;

    setState(prev => ({ ...prev, loading: true, error: null, hasSearched: true, results: [] }));

    try {
      const movies = await searchMoviesWithGemini(query);
      setState(prev => ({ 
        ...prev, 
        results: movies, 
        loading: false 
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      }));
    }
  }, [state.query]);

  // Suggestions for empty state
  const suggestions = [
    "Sci-fi movies from the 80s",
    "Mind-bending thrillers like Inception",
    "Studio Ghibli films",
    "Underrated horror movies 2023",
    "Cyberpunk aesthetics"
  ];

  const applySuggestion = (text: string) => {
    setState(prev => ({ ...prev, query: text }));
    // We need to trigger search, but state update is async.
    // In a real app we might use useEffect or a ref for the immediate trigger,
    // but here we'll just manually call the service in a timeout or require user to hit enter.
    // For better UX, let's update state and focus input.
    if(inputRef.current) {
        inputRef.current.value = text;
        inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-screen">
        
        {/* Header / Search Section */}
        <div className={`transition-all duration-500 ease-out flex flex-col items-center ${state.hasSearched ? 'py-6' : 'py-20 md:py-32'}`}>
          
          <div className="flex items-center gap-3 mb-6 animate-fade-in-down">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
               <FilmIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
              CineSeek AI
            </h1>
          </div>

          {!state.hasSearched && (
            <p className="text-slate-400 text-lg mb-8 text-center max-w-lg animate-fade-in-up">
              Discover your next favorite film. Describe what you're in the mood for, and let AI curate the list.
            </p>
          )}

          <div className={`w-full max-w-2xl relative group ${state.hasSearched ? '' : 'mb-12'}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={state.query}
                onChange={(e) => setState(prev => ({ ...prev, query: e.target.value }))}
                placeholder="Search for movies, genres, or describe a vibe..."
                className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-700 text-white pl-14 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-lg shadow-2xl transition-all placeholder:text-slate-500"
              />
              <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
              <button 
                type="submit"
                disabled={state.loading || !state.query.trim()}
                className="absolute right-3 top-2.5 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
              >
                {state.loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>

          {/* Suggestions (Only show if no search yet) */}
          {!state.hasSearched && (
            <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => applySuggestion(s)}
                  className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-full text-sm text-slate-400 hover:text-indigo-300 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Section */}
        {state.loading ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-400 animate-pulse">Consulting the archives...</p>
          </div>
        ) : state.error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-red-950/20 border border-red-900/50 rounded-2xl mx-auto max-w-2xl mt-8">
            <h3 className="text-xl font-bold text-red-400 mb-2">Error Encountered</h3>
            <p className="text-red-200/70">{state.error}</p>
            <button 
              onClick={() => handleSearch()} 
              className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex-1 pb-12">
            {state.results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {state.results.map((movie, index) => (
                  <div key={`${movie.title}-${index}`} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                    <MovieCard 
                      movie={movie} 
                      onClick={setSelectedMovie} 
                      index={index}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {state.hasSearched && state.results.length === 0 && !state.loading && (
              <div className="text-center py-20 text-slate-500">
                <p className="text-xl">No movies found matching your criteria.</p>
                <p className="mt-2 text-sm">Try broadening your search.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <MovieModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
      />
    </div>
  );
};

export default App;