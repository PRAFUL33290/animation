import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { STORAGE_KEYS, getCollection, saveCollection } from '../utils/storage.js';
import { uid } from '../utils/id.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activities, setActivities] = useState(() => getCollection(STORAGE_KEYS.activities));
  const [days, setDays] = useState(() => getCollection(STORAGE_KEYS.days));
  const [weeks, setWeeks] = useState(() => getCollection(STORAGE_KEYS.weeks));
  const [projects, setProjects] = useState(() => getCollection(STORAGE_KEYS.projects));

  // Persistance automatique à chaque changement.
  useEffect(() => saveCollection(STORAGE_KEYS.activities, activities), [activities]);
  useEffect(() => saveCollection(STORAGE_KEYS.days, days), [days]);
  useEffect(() => saveCollection(STORAGE_KEYS.weeks, weeks), [weeks]);
  useEffect(() => saveCollection(STORAGE_KEYS.projects, projects), [projects]);

  // ---- Activités (bibliothèque) ----
  const saveActivity = useCallback((activity) => {
    const now = new Date().toISOString();
    setActivities((prev) => {
      const exists = activity.id && prev.some((a) => a.id === activity.id);
      if (exists) {
        return prev.map((a) => (a.id === activity.id ? { ...a, ...activity, updatedAt: now } : a));
      }
      return [{ ...activity, id: activity.id || uid('act'), createdAt: now, updatedAt: now }, ...prev];
    });
  }, []);

  const deleteActivity = useCallback((id) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const getActivity = useCallback((id) => activities.find((a) => a.id === id), [activities]);

  // ---- Journées ----
  const saveDay = useCallback((day) => {
    const now = new Date().toISOString();
    setDays((prev) => {
      const exists = day.id && prev.some((d) => d.id === day.id);
      if (exists) {
        return prev.map((d) => (d.id === day.id ? { ...d, ...day, updatedAt: now } : d));
      }
      return [{ ...day, id: day.id || uid('day'), createdAt: now, updatedAt: now }, ...prev];
    });
  }, []);

  const deleteDay = useCallback((id) => setDays((prev) => prev.filter((d) => d.id !== id)), []);
  const getDay = useCallback((id) => days.find((d) => d.id === id), [days]);

  // ---- Semaines ----
  const saveWeek = useCallback((week) => {
    const now = new Date().toISOString();
    setWeeks((prev) => {
      const exists = week.id && prev.some((w) => w.id === week.id);
      if (exists) {
        return prev.map((w) => (w.id === week.id ? { ...w, ...week, updatedAt: now } : w));
      }
      return [{ ...week, id: week.id || uid('week'), createdAt: now, updatedAt: now }, ...prev];
    });
  }, []);

  const deleteWeek = useCallback((id) => setWeeks((prev) => prev.filter((w) => w.id !== id)), []);
  const getWeek = useCallback((id) => weeks.find((w) => w.id === id), [weeks]);

  // ---- Projets ----
  const saveProject = useCallback((project) => {
    const now = new Date().toISOString();
    setProjects((prev) => {
      const exists = project.id && prev.some((p) => p.id === project.id);
      if (exists) {
        return prev.map((p) => (p.id === project.id ? { ...p, ...project, updatedAt: now } : p));
      }
      return [{ ...project, id: project.id || uid('proj'), createdAt: now, updatedAt: now }, ...prev];
    });
  }, []);

  const deleteProject = useCallback((id) => setProjects((prev) => prev.filter((p) => p.id !== id)), []);
  const getProject = useCallback((id) => projects.find((p) => p.id === id), [projects]);

  const value = {
    activities,
    days,
    weeks,
    projects,
    saveActivity,
    deleteActivity,
    getActivity,
    saveDay,
    deleteDay,
    getDay,
    saveWeek,
    deleteWeek,
    getWeek,
    saveProject,
    deleteProject,
    getProject,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans <AppProvider>');
  return ctx;
}
