import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConsentFaculty from './pages/ConsentFaculty';
import Waiting from './pages/Waiting';
import Decision from './pages/Decision';
import Results from './pages/Results';
import Rating from './pages/Rating';
import End from './pages/End';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div className="max-w-xl mx-auto p-4">
      <header className="text-center mb-4">
        <h1 className="text-xl font-bold">Grupo EMAR – UIS</h1>
      </header>
      <Routes>
        <Route path="/" element={<ConsentFaculty />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/decision" element={<Decision />} />
        <Route path="/results" element={<Results />} />
        <Route path="/rating" element={<Rating />} />
        <Route path="/end" element={<End />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <footer className="text-center text-sm mt-8">
        Anonimato y uso académico.
      </footer>
    </div>
  );
}
