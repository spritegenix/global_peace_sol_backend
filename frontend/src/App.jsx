import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Categories from './pages/Categories';
import Directory from './pages/Directory';
import BusinessDetails from './pages/BusinessDetails';
import AddBusiness from './pages/AddBusiness';
import EditBusiness from './pages/EditBusiness';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Private Route Component
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/directory" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
        <Routes>
          <Route path="/admin" element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboard />
            </PrivateRoute>
          } />

          <Route path="*" element={
            <>
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/directory" element={<Directory />} />
                  <Route path="/business/:id" element={<BusinessDetails />} />
                  <Route path="/add-business" element={
                    <PrivateRoute>
                      <AddBusiness />
                    </PrivateRoute>
                  } />
                  <Route path="/edit-business/:id" element={
                    <PrivateRoute>
                      <EditBusiness />
                    </PrivateRoute>
                  } />
                  <Route path="/profile" element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } />
                  <Route path="/auth" element={<Auth />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
