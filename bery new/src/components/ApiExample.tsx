import React, { useState, useEffect } from 'react';
import { authService, storeService, itemService, customerService, orderService, wishlistService } from '../services';

const ApiExample: React.FC = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customerInfo, setCustomerInfo] = useState<any>(null);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Example function to fetch stores
  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await storeService.getStores('all');
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example function to fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await itemService.getLatestProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example function to fetch customer info
  const fetchCustomerInfo = async () => {
    setLoading(true);
    try {
      const data = await customerService.getCustomerInfo();
      setCustomerInfo(data);
    } catch (error) {
      console.error('Error fetching customer info:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example function to fetch wishlist
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example function to fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrderHistory();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example login function
  const handleLogin = async () => {
    try {
      const loginData = {
        phone: '1234567890',
        password: 'password123'
      };
      const response = await authService.login(loginData);
      console.log('Login successful:', response);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">6amMart API Integration Example</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button 
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login Example
        </button>
        
        <button 
          onClick={fetchStores}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Stores
        </button>
        
        <button 
          onClick={fetchProducts}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Products
        </button>
        
        <button 
          onClick={fetchCustomerInfo}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Customer Info
        </button>
        
        <button 
          onClick={fetchWishlist}
          className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Wishlist
        </button>
        
        <button 
          onClick={fetchOrders}
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Fetch Orders
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {stores.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Stores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stores.map(store => (
              <div key={store.id} className="border p-4 rounded">
                <h3 className="font-bold">{store.name}</h3>
                <p>Rating: {store.avg_rating}</p>
                <p>Delivery Time: {store.delivery_time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product.id} className="border p-4 rounded">
                <h3 className="font-bold">{product.name}</h3>
                <p>Price: ${product.price}</p>
                <p>Discount: {product.discount}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {customerInfo && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Customer Info</h2>
          <div className="border p-4 rounded">
            <p>Name: {customerInfo.f_name} {customerInfo.l_name}</p>
            <p>Email: {customerInfo.email}</p>
            <p>Phone: {customerInfo.phone}</p>
            <p>Loyalty Points: {customerInfo.loyalty_point}</p>
          </div>
        </div>
      )}

      {wishlist.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Wishlist</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wishlist.map(item => (
              <div key={item.id} className="border p-4 rounded">
                <h3 className="font-bold">{item.item.name}</h3>
                <p>Price: ${item.item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <div className="grid grid-cols-1 gap-4">
            {orders.map(order => (
              <div key={order.id} className="border p-4 rounded">
                <p>Order ID: {order.id}</p>
                <p>Status: {order.order_status}</p>
                <p>Amount: ${order.order_amount}</p>
                <p>Payment: {order.payment_status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiExample;