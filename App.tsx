
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultsDisplay from './components/ResultsDisplay';
import Spinner from './components/Spinner';
import { analyzeIngredients, extractTextFromImage } from './services/geminiService';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleImageScan = useCallback(async (imageFile: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      setLoadingMessage('Reading ingredients from image...');
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = async () => {
        const base64Image = reader.result?.toString().split(',')[1];
        if (!base64Image) {
          setError('Failed to read image file.');
          setIsLoading(false);
          return;
        }

        const mimeType = imageFile.type;
        const extractedText = await extractTextFromImage(base64Image, mimeType);

        if (!extractedText || extractedText.trim().length < 10) {
           setError('Could not extract a sufficient list of ingredients. Please try another image with a clearer ingredients list.');
           setIsLoading(false);
           return;
        }

        setLoadingMessage('Analyzing ingredients...');
        const result = await analyzeIngredients(extractedText);
        setAnalysisResult(result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError('Error reading file.');
        setIsLoading(false);
      };
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred during analysis. Please try again.');
      setIsLoading(false);
    }
  }, []);
  
  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-300">
          {isLoading ? (
            <div className="text-center">
              <Spinner />
              <p className="mt-4 text-lg text-brand-secondary animate-pulse">{loadingMessage}</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>
              <button
                onClick={handleReset}
                className="mt-6 bg-brand-primary text-white font-bold py-2 px-6 rounded-full hover:bg-brand-secondary transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : analysisResult ? (
            <ResultsDisplay result={analysisResult} onReset={handleReset} />
          ) : (
            <ImageUploader onScan={handleImageScan} />
          )}
        </div>
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Ingredient Scanner AI. Empowering healthier choices.</p>
           <p className="mt-1">Disclaimer: This tool provides an analysis based on AI and public data. It is not a substitute for professional medical or nutritional advice.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
