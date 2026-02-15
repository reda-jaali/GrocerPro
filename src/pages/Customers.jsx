import { useState } from 'react';
import { useGetCustomersQuery, useAddCustomerMutation } from '../features/api/apiSlice';
import { Link } from 'react-router-dom';
import { UserPlus, Search, ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';
import './Customers.css';

const Customers = () => {
    const { data: customers = [], isLoading } = useGetCustomersQuery();
    const [addCustomer] = useAddCustomerMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        if (!newCustomerName.trim()) return;

        // Check uniqueness
        const exists = customers.some(c => c.name.toLowerCase() === newCustomerName.toLowerCase());
        if (exists) {
            toast.error('Customer already exists!');
            return;
        }

        try {
            await addCustomer({
                name: newCustomerName,
                totalDue: 0,
                transactions: [],
                createdAt: new Date().toISOString()
            }).unwrap();
            toast.success('Customer added successfully');
            setNewCustomerName('');
            setIsModalOpen(false);
        } catch (err) {
            toast.error('Failed to add customer');
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="customers-page">
            <div className="page-header">
                <h1 className="page-title">Customers</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <UserPlus size={18} />
                    New Customer
                </button>
            </div>

            <div className="search-bar">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {isLoading ? (
                <div className="loading-state">Loading customers...</div>
            ) : (
                <div className="customers-grid">
                    {filteredCustomers.map((customer) => (
                        <div key={customer.id} className="customer-card">
                            <div className="customer-avatar">
                                <User size={24} />
                            </div>
                            <div className="customer-info">
                                <h3>{customer.name}</h3>
                                <p className={`balance ${customer.totalDue > 0 ? 'debt' : 'clean'}`}>
                                    Due: ${customer.totalDue?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                            <Link to={`/customers/${customer.id}`} className="view-btn">
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    ))}
                    {filteredCustomers.length === 0 && (
                        <div className="empty-state">No customers found.</div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add New Customer</h2>
                        <form onSubmit={handleAddCustomer}>
                            <div className="form-group">
                                <label>Customer Name</label>
                                <input
                                    type="text"
                                    value={newCustomerName}
                                    onChange={(e) => setNewCustomerName(e.target.value)}
                                    placeholder="Enter name"
                                    autoFocus
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Create Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
