import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../store/adminStore';

const Authorization_Sequence_Add = () => {
    const { AuthorizationSequenceAdd, getServiceList, getUsers, isLoading, error,getMasterSubZone } = useAdminStore();
    const [services, setServices] = useState([]);
    const [users, setUsers] = useState([]);
    const [subzones, setsubzones] = useState([]);

    
    const [formData, setFormData] = useState({
      service: '',
      userId: '',
      partOfService: '',
      stage: '',
      subzones: [],
      supervisorOf: '',
      canTakePayment: false,
      canReject: false
    });
  
    // const subzonesList = [
    //   'Alipur', 'Civil Lines', 'Defence Colony', 'Chanakyapuri',
    //   'Delhi Cantonment', 'Dwarka', 'Hauz Khas', 'Karawal Nagar',
    //   'Karol Bagh', 'Kotwali'
    // ];
  
    useEffect(() => {
      fetchInitialData();
    }, []);
  
    const fetchInitialData = async () => {
      try {
        const [serviceData, userData, subzoneData] = await Promise.all([
          getServiceList(),
          getUsers(),
          getMasterSubZone() // Fetch subzones from backend
        ]);
    
        setServices(serviceData.serviceList || []);
        setUsers(userData.users || []); // Adjust according to your API response structure
        setsubzones(subzoneData.subzones || []); // Ensure subzones are fetched and set
      } catch (error) {
        console.error('Error fetching initial data:', error);

      }
    };
    
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
  
   
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await AuthorizationSequenceAdd(formData);
        // Reset form after successful submission
        setFormData({
          service: '',
          userId: '',
          partOfService: '',
          stage: '',
          subzones: [],
          supervisorOf: '',
          canTakePayment: false,
          canReject: false
        });
      } catch (error) {
        console.error('Form submission error:', error);
      }
    };
  
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow text-black">
        <h2 className="text-2xl font-bold mb-6">Add Authorization Sequence</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service *
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User *
            </label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {/* {user.name} ({user.email}) */}
                  {user.role}
                </option>
              ))}
            </select>
          </div>
  
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Part Of Service *
  </label>
  <select
    name="partOfService"
    value={formData.partOfService ? 'Yes' : 'No'}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        partOfService: e.target.value === 'Yes',
      }))
    }
    required
    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
  >
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stage *
            </label>
            <input
              type="text"
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    SubZones *
  </label>
  <select
    name="subzones"
    value={formData.subzones}
    onChange={(e) => {
      setFormData((prev) => ({
        ...prev,
        subzones: Array.from(e.target.selectedOptions, (option) => option.value)
      }));
    }}
    multiple // Add this to enable multiple selection
    required
    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 min-h-[120px]" // Added min-height for better UX
  >
    {subzones && subzones.length > 0 ? (
      subzones.map((subzone) => (
        <option key={subzone._id} value={subzone._id}>
          {subzone.SubZoneName}
        </option>
      ))
    ) : (
      <option value="" disabled>No subzones available</option>
    )}
  </select>
  <small className="text-gray-500 mt-1 block">
    Hold Ctrl (Windows) or Command (Mac) to select multiple zones
  </small>
</div>

  
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supervisor Of *
            </label>
            <input
              type="text"
              name="supervisorOf"
              value={formData.supervisorOf}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Can Take Payment *
  </label>
  <select
    name="canTakePayment"
    value={formData.canTakePayment ? 'Yes' : 'No'}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        canTakePayment: e.target.value === 'Yes',
      }))
    }
    required
    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
  >
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Can Reject *
  </label>
  <select
    name="canReject"
    value={formData.canReject ? 'Yes' : 'No'}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        canReject: e.target.value === 'Yes',
      }))
    }
    required
    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
  >
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>
  
          {error && (
            <div className="text-red-500 text-sm py-2">
              {error}
            </div>
          )}
  
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium 
              ${isLoading 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500'
              }`}
          >
            {isLoading ? 'Adding...' : 'Add Authorization Sequence'}
          </button>
        </form>
      </div>
    );
  };
  
  export default Authorization_Sequence_Add;