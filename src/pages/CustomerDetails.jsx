import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCustomersQuery, useUpdateCustomerMutation, useDeleteCustomerMutation, useGetProductsQuery } from '../features/api/apiSlice';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { ArrowLeft, Trash2, CheckCircle, Plus, ShoppingBag } from 'lucide-react';
import './CustomerDetails.css';

const CustomerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // We need to find the specific customer from the list or fetch one.
    // json-server supports /customers/:id but useGetCustomersQuery fetches all.
    // I'll stick to picking from the list for simplicity, or I could add useGetCustomerQuery.
    // Actually, useGetCustomersQuery returns all, I can select.
    // Better: add useGetCustomerQuery to apiSlice?
    // For now, filtering is okay if the list isn't huge.

    const { customer, isLoading } = useGetCustomersQuery(undefined, {
        selectFromResult: ({ data, isLoading }) => ({
            customer: data?.find((c) => c.id === id),
            isLoading
        }),
    });

    const { data: products = [] } = useGetProductsQuery();
    const [updateCustomer] = useUpdateCustomerMutation();
    const [deleteCustomer] = useDeleteCustomerMutation();

    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);

    if (isLoading) {
        return <div className="loading-state">Loading customer details...</div>;
    }

    if (!customer) {
        return <div className="loading-state">Customer not found.</div>;
    }

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!selectedProductId) return;

        const product = products.find(p => p.id === selectedProductId);
        if (!product) return;

        const newTransaction = {
            id: uuidv4(),
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: parseInt(quantity),
            total: product.price * parseInt(quantity),
            date: new Date().toISOString(),
        };

        const updatedTransactions = [...(customer.transactions || []), newTransaction];
        const newTotalDue = (customer.totalDue || 0) + newTransaction.total;

        try {
            await updateCustomer({
                id: customer.id,
                transactions: updatedTransactions,
                totalDue: newTotalDue,
            }).unwrap();
            toast.success('Product added to tab');
            setIsAddProductOpen(false);
            setSelectedProductId('');
            setQuantity(1);
        } catch (err) {
            toast.error('Failed to update customer');
        }
    };

    const handleSettlePayment = async () => {
        if (!window.confirm(`Settle total payment of $${customer.totalDue?.toFixed(2)} and close account?`)) return;

        try {
            await deleteCustomer(customer.id).unwrap();
            toast.success('Payment settled and account closed');
            navigate('/customers');
        } catch (err) {
            toast.error('Failed to settle payment');
        }
    };

    return (
        <div className="details-page">
            <div className="details-header">
                <button className="back-btn" onClick={() => navigate('/customers')}>
                    <ArrowLeft size={20} />
                    Back
                </button>
                <div className="customer-title">
                    <h1>{customer.name}</h1>
                    <span className={`status-badge ${customer.totalDue > 0 ? 'active' : 'inactive'}`}>
                        {customer.totalDue > 0 ? 'Active Tab' : 'Clean Slate'}
                    </span>
                </div>
            </div>

            <div className="details-grid">
                <div className="transactions-section">
                    <div className="section-header">
                        <h2>Transaction History</h2>
                        <button className="btn btn-primary btn-sm" onClick={() => setIsAddProductOpen(true)}>
                            <Plus size={16} /> Add Item
                        </button>
                    </div>

                    <div className="transactions-table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customer.transactions && customer.transactions.length > 0 ? (
                                    customer.transactions.map((t) => (
                                        <tr key={t.id}>
                                            <td>{new Date(t.date).toLocaleDateString()}</td>
                                            <td>{t.productName}</td>
                                            <td>{t.quantity}</td>
                                            <td>${t.price.toFixed(2)}</td>
                                            <td>${t.total.toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="empty-table">No items added yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="summary-section">
                    <div className="summary-card">
                        <h3>Total Due</h3>
                        <div className="total-amount">${customer.totalDue?.toFixed(2) || '0.00'}</div>
                        <p className="summary-note">Payment is due at the end of the month.</p>

                        <button
                            className="btn btn-danger settle-btn"
                            onClick={handleSettlePayment}
                            disabled={!customer.totalDue || customer.totalDue === 0}
                        >
                            <CheckCircle size={18} />
                            Settle & Close Account
                        </button>
                    </div>
                </div>
            </div>

            {isAddProductOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add Item to Tab</h2>
                        <form onSubmit={handleAddProduct}>
                            <div className="form-group">
                                <label>Select Product</label>
                                <select
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(e.target.value)}
                                    className="product-select"
                                    autoFocus
                                >
                                    <option value="">-- Choose Product --</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} - ${p.price.toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsAddProductOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={!selectedProductId}>
                                    Add Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDetails;
