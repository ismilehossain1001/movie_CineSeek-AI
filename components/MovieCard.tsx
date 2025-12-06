import React from 'react';
import { Movie } from '../types';
import { StarIcon, CalendarIcon } from './Icons';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, index }) => {
  // Use a stable seed for the image based on title length and year
  const seed = movie.title.length * movie.year;
  const imageUrl = `https://picsum.photos/seed/${seed}/400/600`;

  return (
    <div 
      onClick={() => onClick(movie)}
      className="group relative bg-slate-800 rounded-xl overflow-hidden cursor-pointer transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-slate-700/50 hover:border-indigo-500/50"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={movie.title} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
        
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-yellow-500/20">
          <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs font-bold text-white">{movie.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-500/20">
            {movie.genre[0]}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
             <CalendarIcon className="w-3 h-3" /> {movie.year}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white leading-tight mb-1 group-hover:text-indigo-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
          {movie.summary}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;