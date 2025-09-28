
import React from 'react';

const LeafIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-white"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.938 4.032a.75.75 0 01.916.38l5.25 10.5a.75.75 0 11-1.33.664L14.3 14.5H5.7l-.474 1.076a.75.75 0 11-1.33-.664l5.25-10.5a.75.75 0 01.792-.38zM6.867 13h6.266L10 6.88 6.867 13z"
      clipRule="evenodd"
    />
     <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
    <path d="M10 4.5c-2.43 2.43-2.43 6.31 0 8.74C12.43 10.81 12.43 6.93 10 4.5zM5.5 10c2.43-2.43 6.31-2.43 8.74 0-2.43 2.43-6.31 2.43-8.74 0z" />
  </svg>
);


const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-brand-secondary to-brand-primary shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 15.5L19 19"></path><path d="M5 11a6 6 0 1012 0 6 6 0 00-12 0z"></path><path d="M10 17l-1-1-1 1"></path></svg>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            Ingredient Scanner AI
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
