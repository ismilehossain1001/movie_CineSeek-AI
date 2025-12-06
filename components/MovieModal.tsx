import React from 'react';
import { Movie } from '../types';
import { StarIcon, CalendarIcon, ClockIcon, XIcon, FilmIcon } from './Icons';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  // Use a hash of the title to consistently pick an image seed
  const seed = movie.title.length * movie.year;
  const imageUrl = `https://picsum.photos/seed/${seed}/800/600`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 md:h-80 w-full shrink-0">
          <img 
            src={imageUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 shadow-sm">{movie.title}</h2>
            {movie.tagline && (
              <p className="text-slate-300 italic text-sm md:text-base border-l-4 border-indigo-500 pl-3">
                "{movie.tagline}"
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="flex flex-wrap gap-4 mb-6 text-sm md:text-base text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-white">{movie.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              <span>{movie.year}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full">
              <ClockIcon className="w-4 h-4 text-indigo-400" />
              <span>{movie.runtime}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full">
              <FilmIcon className="w-4 h-4 text-indigo-400" />
              <span>{movie.director}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Plot Summary</h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                {movie.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((g) => (
                    <span key={g} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded text-sm">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Top Cast</h3>
                <ul className="space-y-2">
                  {movie.cast.map((actor) => (
                    <li key={actor} className="flex items-center gap-2 text-slate-200">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      {actor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;