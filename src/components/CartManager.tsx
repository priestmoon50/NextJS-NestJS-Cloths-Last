import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const CartManager: React.FC = () => {
  const { cart, addItem, removeItem, updateItem } = useCart();
  const [newItem, setNewItem] = useState({
    id: '',
    name: '',
    price: 0,
    quantity: 1,
    size: '',
    color: '',
  });

  const handleAddItem = () => {
    if (newItem.id && newItem.name && newItem.price > 0) {
      addItem(newItem);
      setNewItem({ id: '', name: '', price: 0, quantity: 1, size: '', color: '' });
    }
  };

  return (
    <div>
      <h2>Cart Manager</h2>
      <div>
        <input
          type="text"
          placeholder="Product ID"
          value={newItem.id}
          onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Product Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
        />
        <input
          type="text"
          placeholder="Size"
          value={newItem.size}
          onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
        />
        <input
          type="text"
          placeholder="Color"
          value={newItem.color}
          onChange={(e) => setNewItem({ ...newItem, color: e.target.value })}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      <h3>Cart Items</h3>
      <ul>
        {cart.items.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity} ({item.size}, {item.color})
            <button onClick={() => removeItem(item.id)}>Remove</button>
            <button
              onClick={() =>
                updateItem(item.id, item.quantity + 1)
              }
            >
              Increase Quantity
            </button>
            <button
              onClick={() =>
                updateItem(item.id, item.quantity > 1 ? item.quantity - 1 : 1)
              }
            >
              Decrease Quantity
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartManager;