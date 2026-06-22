import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import IdeaGenerator from './pages/IdeaGenerator.jsx';
import DayPlanner from './pages/DayPlanner.jsx';
import MonthPlanner from './pages/MonthPlanner.jsx';
import Library from './pages/Library.jsx';
import ActivitySheet from './pages/ActivitySheet.jsx';
import ProjectGenerator from './pages/ProjectGenerator.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/generateur" element={<IdeaGenerator />} />
        <Route path="/journee" element={<DayPlanner />} />
        <Route path="/journee/:id" element={<DayPlanner />} />
        <Route path="/mois" element={<MonthPlanner />} />
        <Route path="/mois/:id" element={<MonthPlanner />} />
        {/* Ancien chemin conservé pour compatibilité */}
        <Route path="/semaine" element={<Navigate to="/mois" replace />} />
        <Route path="/semaine/:id" element={<Navigate to="/mois" replace />} />
        <Route path="/bibliotheque" element={<Library />} />
        <Route path="/activite/:id" element={<ActivitySheet />} />
        <Route path="/projets" element={<ProjectGenerator />} />
        <Route path="/projets/:id" element={<ProjectGenerator />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
