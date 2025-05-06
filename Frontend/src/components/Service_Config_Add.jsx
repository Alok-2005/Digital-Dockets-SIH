import React, { useState, useEffect } from "react"
import { useAdminStore } from "../store/adminStore"
import MDEditor from "@uiw/react-md-editor"
import { toast } from "react-hot-toast"
import axios from "axios"

const Service_Config_Add = () => {
  const [formData, setFormData] = useState({
    service: "",
    isPaidService: "false",
    rateOfService: "",
    customRate: "",
    certificateData: "",
  })

  const [services, setServices] = useState([])
  const [subzones, setSubzones] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedServicePlaceholders, setSelectedServicePlaceholders] = useState([])

  const Service_Config_Add = useAdminStore((state) => state.Service_Config_Add)
  const getServiceList = useAdminStore((state) => state.getServiceList)
  const isLoading = useAdminStore((state) => state.isLoading)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch Services
        const serviceResponse = await getServiceList()
        if (serviceResponse && serviceResponse.serviceList && Array.isArray(serviceResponse.serviceList)) {
          setServices(serviceResponse.serviceList)
          if (serviceResponse.serviceList.length === 0) {
            toast.info("No services available. Please add services first.")
          }
        } else {
          console.error("Unexpected services response format:", serviceResponse)
          toast.error("No services available")
          setServices([])
        }

        // Fetch Subzones
        const subzoneResponse = await axios.get('http://localhost:3000/api/admin/master_subzone')
        if (subzoneResponse.data && subzoneResponse.data.success) {
          setSubzones(subzoneResponse.data.subzones)
        } else {
          console.error("Unexpected subzones response format:", subzoneResponse.data)
          toast.error("Failed to fetch subzones")
          setSubzones([])
        }
      } catch (error) {
        console.error("Error fetching initial data:", error)
        toast.error(error.message || "Failed to fetch initial data")
      }
    }

    fetchInitialData()
  }, [getServiceList])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isPaidService" ? value === "true" : value,
    }))
  }

  const handleEditorChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      certificateData: value || "",
    }))
  }

  const handleServiceChange = async (e) => {
    const serviceId = e.target.value
    handleInputChange(e)

    if (serviceId) {
      try {
        const response = await axios.get(`http://localhost:3000/api/admin/form_config/service/${serviceId}`)
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          const placeholders = response.data.data.map((field) => `{{${field.fieldName}}}`)
          
          // Add subzone placeholders
          const subzonePlaceholders = [
          
            '{{subzoneName}}' // Full subzone name (Zone ID - Subzone Name)
          ]

          setSelectedServicePlaceholders([...placeholders, ...subzonePlaceholders])
        } else {
          console.error("Unexpected response format:", response.data)
          toast.error("Failed to fetch service placeholders: Unexpected response format")
          setSelectedServicePlaceholders([])
        }
      } catch (error) {
        console.error("Error fetching service placeholders:", error)
        toast.error("Failed to fetch service placeholders")
        setSelectedServicePlaceholders([])
      }
    } else {
      setSelectedServicePlaceholders([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.service) {
        throw new Error("Please select a service")
      }
      if (formData.rateOfService === "") {
        throw new Error("Rate of Service is required")
      }
      if (formData.certificateData === "") {
        throw new Error("Certificate Data is required")
      }

      const submissionData = {
        ...formData,
        rateOfService: Number(formData.rateOfService),
        customRate: formData.customRate ? Number(formData.customRate) : undefined,
      }

      await Service_Config_Add(submissionData)
      toast.success("Service configuration added successfully")

      // Reset form
      setFormData({
        service: "",
        isPaidService: "false",
        rateOfService: "",
        customRate: "",
        certificateData: "",
      })
      setSelectedServicePlaceholders([])
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error(error.message || "Failed to add service configuration")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow text-black">
      <h2 className="text-2xl font-bold mb-6">Add Service Configuration</h2>

      {services.length === 0 ? (
        <div className="text-center py-4 bg-yellow-50 rounded-lg mb-4">
          <p className="text-yellow-700">No services available.</p>
          <p className="text-sm text-yellow-600 mt-1">
            Please add services first before creating a service configuration.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Service *</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleServiceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a service...</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Is Paid Service *</label>
            <select
              name="isPaidService"
              value={formData.isPaidService}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select...</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rate of Service *</label>
            <input
              type="number"
              name="rateOfService"
              value={formData.rateOfService}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Custom Rate</label>
            <input
              type="number"
              name="customRate"
              value={formData.customRate}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
          </div>

          {selectedServicePlaceholders.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Available Placeholders:</h3>
              <ul className="mt-2 list-disc list-inside">
                {selectedServicePlaceholders.map((placeholder, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {placeholder}
                  </li>
                ))}
              </ul>
            </div>
          )}

<div data-color-mode="light">
            <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Data *</label>
            <MDEditor value={formData.certificateData} onChange={handleEditorChange} height={300} preview="live" />
          </div>


          <div className="pt-5">
            <button
              type="submit"
              disabled={loading || isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {loading || isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Service_Config_Add

