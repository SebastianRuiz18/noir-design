import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import AdminPanel from './components/Adminpanel';
import Login from './components/Login';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import useCatalogFromFirebase from './hooks/useCatalogFromFirebase';
import logo from './assets/logo.png';
import './Admin.css';

function Admin() {
  const [user, loading, error] = useAuthState(auth);
  
  // THE FIX: Correctly destructure the 'catalog' array from the hook's return object.
  const { catalog, loading: catalogLoading, error: catalogError } = useCatalogFromFirebase();

  if (loading || catalogLoading) {
    return (
      <div className="status-page">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error || catalogError) {
    return (
      <div className="status-page">
        <p>Error: {error?.message || catalogError?.message}</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="admin-page">
        {/* Now we pass the correct catalog array to the Navbar */}
        <Navbar catalog={catalog} logo={logo} />
        <AdminPanel user={user} />
        <Footer />
      </div>
    );
  }

  return <Login />;
}

export default Admin;