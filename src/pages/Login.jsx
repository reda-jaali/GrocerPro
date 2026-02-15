import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import { useGetUsersQuery } from '../features/api/apiSlice';
import toast from 'react-hot-toast';
import { Lock, User } from 'lucide-react';
import clsx from 'clsx';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: users } = useGetUsersQuery();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 800));

        if (!users) {
            toast.error('Unable to connect to server');
            setIsLoading(false);
            return;
        }

        const user = users.find(
            (u) => u.username === username && u.password === password
        );

        if (user) {
            dispatch(login(user));
            toast.success(`Welcome back, ${user.username}!`);
            navigate('/');
        } else {
            toast.error('Invalid credentials');
        }
        setIsLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="icon-bg">
                        <Lock size={32} color="white" />
                    </div>
                    <h1>GrocerPro</h1>
                    <p>Login to manage your store</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <User className="input-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="login-input"
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="login-input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={clsx('login-btn', isLoading && 'loading')}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Demo Credentials: admin / password123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
