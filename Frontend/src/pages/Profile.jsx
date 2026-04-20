import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Lock, Save, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services';
import { toast } from '../utils/toast';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });
  const [addresses, setAddresses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
    });
    fetchAddresses();
  }, [user, navigate]);

  const fetchAddresses = async () => {
    try {
      const response = await authService.getProfile();
      setAddresses(response.user?.addresses || []);
    } catch (error) {
      toast.error('Failed to load addresses');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.addAddress(newAddress);
      toast.success('Address added successfully');
      setNewAddress({ street: '', city: '', state: '', zipCode: '', isDefault: false });
      setShowAddressForm(false);
      fetchAddresses();
    } catch (error) {
      toast.error(error.message || 'Failed to add address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await authService.deleteAddress(addressId);
      toast.success('Address deleted');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12">My Profile</h1>

        {/* Profile Section */}
        <div className="bg-gray-800/50 rounded-lg p-8 mb-8 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User size={24} className="text-yellow-400" />
              Personal Information
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded flex items-center gap-2 transition disabled:opacity-50"
                >
                  <Save size={18} /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2 transition"
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User size={18} className="text-yellow-400" />
                <span>{formData.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-yellow-400" />
                <span>{formData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={18} className="text-yellow-400" />
                <button className="text-yellow-400 hover:text-yellow-300 transition">
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Addresses Section */}
        <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MapPin size={24} className="text-yellow-400" />
              Saved Addresses
            </h2>
            {!showAddressForm && (
              <button
                onClick={() => setShowAddressForm(true)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition"
              >
                Add Address
              </button>
            )}
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="mb-8 p-4 bg-gray-700/50 rounded border border-gray-600">
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="px-4 py-2 bg-gray-600 rounded border border-gray-500 focus:border-yellow-400 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="px-4 py-2 bg-gray-600 rounded border border-gray-500 focus:border-yellow-400 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="px-4 py-2 bg-gray-600 rounded border border-gray-500 focus:border-yellow-400 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={newAddress.zipCode}
                  onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                  className="px-4 py-2 bg-gray-600 rounded border border-gray-500 focus:border-yellow-400 focus:outline-none"
                  required
                />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="default"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                />
                <label htmlFor="default">Set as default address</label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded transition disabled:opacity-50"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {addresses.length === 0 ? (
            <p className="text-gray-400">No saved addresses yet</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div key={address._id} className="p-4 bg-gray-700/30 rounded border border-gray-600">
                  <p className="font-semibold">{address.street}</p>
                  <p className="text-sm text-gray-300">{address.city}, {address.state} {address.zipCode}</p>
                  {address.isDefault && (
                    <span className="text-xs bg-yellow-600 text-black px-2 py-1 rounded mt-2 inline-block">
                      Default Address
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(address._id)}
                    className="mt-2 text-red-400 hover:text-red-300 transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
