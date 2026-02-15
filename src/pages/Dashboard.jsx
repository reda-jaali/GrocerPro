import { useGetCustomersQuery, useGetProductsQuery } from '../features/api/apiSlice';
import { Users, Package, Wallet, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className={`stat-card ${color}`}>
        <div className="stat-content">
            <div>
                <h3 className="stat-title">{title}</h3>
                <p className="stat-value">{value}</p>
                <p className="stat-subtext">{subtext}</p>
            </div>
            <div className="stat-icon-wrapper">
                <Icon size={24} className="stat-icon" />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { data: customers = [] } = useGetCustomersQuery();
    const { data: products = [] } = useGetProductsQuery();

    const totalCustomers = customers.length;
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);
    const totalOutstanding = customers.reduce((acc, c) => acc + (c.totalDue || 0), 0);

    return (
        <div className="dashboard">
            <div className="dashboard-grid">
                <StatCard
                    title="Total Customers"
                    value={totalCustomers}
                    subtext="Active accounts"
                    icon={Users}
                    color="blue"
                />
                <StatCard
                    title="Products"
                    value={totalProducts}
                    subtext="In inventory"
                    icon={Package}
                    color="purple"
                />
                <StatCard
                    title="Inventory Value"
                    value={`$${totalInventoryValue.toFixed(2)}`}
                    subtext="Total asset value"
                    icon={TrendingUp}
                    color="green"
                />
                <StatCard
                    title="Outstanding"
                    value={`$${totalOutstanding.toFixed(2)}`}
                    subtext="To be collected"
                    icon={Wallet}
                    color="orange"
                />
            </div>

            <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    {customers.slice(0, 5).map(customer => (
                        customer.transactions && customer.transactions.length > 0 && (
                            <div key={customer.id} className="activity-item">
                                <div className="activity-icon">
                                    <Wallet size={16} />
                                </div>
                                <div className="activity-details">
                                    <p className="activity-text">
                                        <strong>{customer.name}</strong> has a balance of <strong>${customer.totalDue?.toFixed(2)}</strong>
                                    </p>
                                    <span className="activity-time">Active Customer</span>
                                </div>
                            </div>
                        )
                    ))}
                    {customers.length === 0 && <p className="no-activity">No recent activity found.</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
