import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './redux/store';

import AuthScreen from './pages/AuthScreen';
import ThreadsPage from './pages/ThreadsPage';
import ProfilePage from './pages/ProfilePage';
import AppHeader from './components/AppHeader';
import ThreadFormPage from './pages/ThreadFormPage';

import './App.css';

function App() {
  const isAuthenticated = useSelector((state: RootState) => Boolean(state.auth.token));

  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={ isAuthenticated? <Navigate to="/threads" /> : <AuthScreen />} />
        <Route path="/threads" element={ isAuthenticated ? <ThreadsPage /> : <Navigate to="/" /> } />
        <Route path="/profile" element={ isAuthenticated ? <ProfilePage /> : <Navigate to="/" /> } />
        <Route path="/add-post" element={<ThreadFormPage />} />
        <Route path="/edit-post/:id" element={<ThreadFormPage />} />
        <Route path="*" element={ <div>404 - Page Not Found</div> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
