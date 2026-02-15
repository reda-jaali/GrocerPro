import { useState } from 'react';
import { useGetProductsQuery, useAddProductMutation, useDeleteProductMutation } from '../features/api/apiSlice';
import { Package, Plus, Search, Trash2, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import './Inventory.css';

const Inventory = () => {
    const { data: products = [], isLoading } = useGetProductsQuery();
    const [addProduct] = useAddProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'General', stock: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!newProduct.name || !newProduct.price) return;

        try {
            await addProduct({
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                category: newProduct.category,
                stock: parseInt(newProduct.stock) || 0
            }).unwrap();
            toast.success('Product added to inventory');
            setNewProduct({ name: '', price: '', category: 'General', stock: 0 });
            setIsModalOpen(false);
        } catch (err) {
            toast.error('Failed to add product');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                toast.success('Product deleted');
            } catch (err) {
                toast.error('Failed to delete product');
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="inventory-page">
            <div className="page-header">
                <h1 className="page-title">Inventory</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Product
                </button>
            </div>

            <div className="search-bar">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="inventory-grid">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-icon">
                            <Package size={24} />
                        </div>
                        <div className="product-details">
                            <h3>{product.name}</h3>
                            <span className="category-tag">{product.category}</span>
                            <div className="product-meta">
                                <span className="price">${product.price.toFixed(2)}</span>
                                <span className="stock">Qty: {product.stock}</span>
                            </div>
                        </div>
                        <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add New Product</h2>
                        <form onSubmit={handleAddProduct}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock Qty</label>
                                    <input
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    className="product-select"
                                >
                                    <option value="General">General</option>
                                    <option value="Dairy">Dairy</option>
                                    <option value="Bakery">Bakery</option>
                                    <option value="Produce">Produce</option>
                                    <option value="Beverages">Beverages</option>
                                    <option value="Household">Household</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
