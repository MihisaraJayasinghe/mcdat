"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Form = ({ onSuccess, editItem }) => {
  const [name, setName] = useState(editItem ? editItem.name : '');
  const [value, setValue] = useState(editItem ? editItem.value : '');
  const [isEditing, setIsEditing] = useState(!!editItem);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing item
        await axios.put(`/api/data/${editItem._id}`, { name, value });
      } else {
        // Add new item
        await axios.post('/api/data', { name, value });
      }
      setName('');
      setValue('');
      setIsEditing(false);
      onSuccess(); // Notify parent component of successful submission
    } catch (err) {
      console.error('Failed to submit data:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
      <div className="mb-2">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full text-black px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-gray-700">Value</label>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full text-black px-3 py-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
      >
        {isEditing ? 'Update' : 'Submit'}
      </button>
      {isEditing && (
        <button
          type="button"
          onClick={() => {
            setName('');
            setValue('');
            setIsEditing(false);
          }}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 ml-2"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default function Home() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSuccess = () => {
    fetchData(); // Refresh data after successful submission
  };

  const handleEdit = (item) => {
    setEditItem(item);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/data/${id}`);
      fetchData(); // Refresh data after deletion
    } catch (err) {
      console.error('Failed to delete data:', err);
    }
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-md mx-auto p-4">
        <Form onSuccess={handleSuccess} editItem={editItem} />

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Data Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Data Table</h2>
          {error && <p className="text-red-500">{error}</p>}
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition duration-300 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}