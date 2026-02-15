import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../features/auth/authSlice';
import { Home, Users, Package, LogOut, ShoppingCart } from 'lucide-react';
import './Layout.css';

const Layout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <ShoppingCart size={32} className="logo-icon" />
                    <h1>GrocerPro</h1>
                </div>

                <nav className="nav-menu">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Home size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Users size={20} />
                        <span>Customers</span>
                    </NavLink>
                    <NavLink to="/inventory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Package size={20} />
                        <span>Inventory</span>
                    </NavLink>
                </nav>

                <div className="user-profile">
                    <div className="user-info">
                        <span className="user-name">{user?.username || 'Admin'}</span>
                        <span className="user-role">{user?.role || 'Manager'}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-btn" title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <h2>Overview</h2>
                    <div className="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </header>
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
