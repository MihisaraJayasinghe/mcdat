"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, onSubmit, editItem }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white backdrop-blur-sm bg-opacity-30 border border-white p-6 rounded shadow-lg w-full max-w-md glass">
        <h2 className="text-xl font-semibold mb-4">Edit Item</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const { name, studentId, studentClass } = e.target.elements;
            onSubmit({
              _id: editItem._id,
              name: name.value,
              studentId: studentId.value,
              studentClass: studentClass.value
            });
          }}
          className="space-y-4 text black"
        >
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={editItem.name}
              className="w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Student ID</label>
            <input
              type="text"
              name="studentId"
              defaultValue={editItem.studentId}
              className="w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Class</label>
            <input
              type="text"
              name="studentClass"
              defaultValue={editItem.studentClass}
              className="w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

const Home = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
  };

  const handleSubmitEdit = async (updatedItem) => {
    try {
      await axios.patch('/api/data', updatedItem);
      setIsModalOpen(false);
      setEditItem(null);
      fetchData(); // Refresh data after update
    } catch (err) {
      console.error('Failed to update data:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/api/data', { params: { id } });
      fetchData(); // Refresh data after deletion
    } catch (err) {
      console.error('Failed to delete data:', err.response?.data || err.message);
    }
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.studentId.toLowerCase().includes(search.toLowerCase()) ||
    item.studentClass.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
      <div className="w-full max-w-lg mx-auto p-4 bg-white backdrop-blur-sm bg-opacity-20 border border-white shadow-lg rounded glass">
        <div className='  text-white'>add data and edit and delete</div>
        {/* Form for Adding New Item */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const { name, studentId, studentClass } = e.target.elements;
            try {
              if (editItem) {
                // Update existing item
                await axios.patch('/api/data', { _id: editItem._id, name: name.value, studentId: studentId.value, studentClass: studentClass.value });
                setEditItem(null);
              } else {
                // Add new item
                await axios.post('/api/data', { name: name.value, studentId: studentId.value, studentClass: studentClass.value });
              }
              e.target.reset();
              fetchData(); // Refresh data after successful submission
            } catch (err) {
              console.error('Failed to submit data:', err);
            }
          }}
          className="mb-4 p-4 border rounded shadow-md glass"
        >
          <div className="mb-2">
            <label className="block text-white">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={editItem ? editItem.name : ''}
              className="w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-white">Student ID</label>
            <input
              type="text"
              name="studentId"
              defaultValue={editItem ? editItem.studentId : ''}
              className="w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-white">Class</label>
            <input
              type="text"
              name="studentClass"
              defaultValue={editItem ? editItem.studentClass : ''}
              className="w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            {editItem ? 'Update' : 'Submit'}
          </button>
          {editItem && (
            <button
              type="button"
              onClick={() => setEditItem(null)}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300 ml-2"
            >
              Cancel
            </button>
          )}
        </form>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-black px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Data Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Student Details</h2>
          {error && <p className="text-red-500">{error}</p>}
          <table className="min-w-full divide-y divide-gray-200 bg-gray-50 shadow-sm rounded-lg">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white text-black divide-y  divide-gray-200">
              {filteredData.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.studentClass}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600 transition duration-300 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300"
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitEdit}
        editItem={editItem}
      />
    </main>
  );
};

export default Home;