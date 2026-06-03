import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import LoadingScreen from './components/ui/LoadingScreen';

// Lazy loading components for optimized bundles
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Contact = lazy(() => import('./pages/Contact'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const CreateEvent = lazy(() => import('./pages/CreateEvent'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetails />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="contact" element={<Contact />} />
              
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="mybookings" element={<MyBookings />} />
                <Route path="create-event" element={<CreateEvent />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
