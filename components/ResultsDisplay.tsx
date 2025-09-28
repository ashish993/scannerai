
import React from 'react';
import type { AnalysisResult, FlaggedIngredient } from '../types';
import { HealthRating } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ratingConfig = {
  [HealthRating.Safe]: {
    text: 'Safe',
    color: 'text-rating-green',
    bgColor: 'bg-rating-green-bg',
    borderColor: 'border-rating-green',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  [HealthRating.Caution]: {
    text: 'Use with Caution',
    color: 'text-rating-yellow',
    bgColor: 'bg-rating-yellow-bg',
    borderColor: 'border-rating-yellow',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  [HealthRating.Avoid]: {
    text: 'Not Recommended',
    color: 'text-rating-red',
    bgColor: 'bg-rating-red-bg',
    borderColor: 'border-rating-red',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

const IngredientCard: React.FC<{ ingredient: FlaggedIngredient }> = ({ ingredient }) => {
    const isAvoid = ingredient.rating === HealthRating.Avoid;
    const cardColor = isAvoid ? 'bg-rating-red-bg' : 'bg-rating-yellow-bg';
    const borderColor = isAvoid ? 'border-rating-red' : 'border-rating-yellow';

    return (
        <div className={`p-4 rounded-lg border-l-4 ${cardColor} ${borderColor}`}>
            <h4 className="font-bold text-gray-800">{ingredient.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{ingredient.description}</p>
        </div>
    );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  const config = ratingConfig[result.overallRating];

  return (
    <div className="animate-fade-in">
      <div className={`p-6 rounded-xl border-2 ${config.bgColor} ${config.borderColor}`}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className={config.color}>{config.icon}</div>
          <div>
            <h2 className={`text-2xl font-bold ${config.color}`}>{config.text}</h2>
            <p className="text-gray-700 mt-1">{result.summary}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        {result.flaggedIngredients.length > 0 ? (
            <>
                <h3 className="text-xl font-bold text-brand-secondary mb-4">Flagged Ingredients</h3>
                <div className="space-y-4">
                    {result.flaggedIngredients.map((ing) => (
                        <IngredientCard key={ing.name} ingredient={ing} />
                    ))}
                </div>
            </>
        ) : (
             <div className="text-center p-6 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-800">No potentially harmful ingredients were found based on our analysis.</p>
            </div>
        )}
      </div>

      <div className="mt-8">
        <details className="bg-gray-50 rounded-lg p-4 cursor-pointer">
            <summary className="font-semibold text-gray-700">View Full Ingredient List</summary>
            <p className="text-sm text-gray-600 mt-3 break-words">
                {result.allIngredients.join(', ')}
            </p>
        </details>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={onReset}
          className="bg-brand-primary text-white font-bold py-2 px-8 rounded-full hover:bg-brand-secondary transition-colors"
        >
          Scan Another Product
        </button>
      </div>
    </div>
  );
};

export default ResultsDisplay;
