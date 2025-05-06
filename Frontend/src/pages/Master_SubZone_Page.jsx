import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../store/adminStore'
import toast from 'react-hot-toast'

const Master_SubZone_Page = () => {
    const getMasterSubZone = useAdminStore((state) => state.getMasterSubZone)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getMasterSubZone()
                console.log('SubZone List Result:', result) // Debug log
                
                if (result && result.subzones) {
                    setData(result.subzones)
                    if (result.subzones.length === 0) {
                        toast.info('No subzones available. Please add some subzones.')
                    }
                } else {
                    setData([])
                    toast.error('No subzones data available')
                }
            } catch (error) {
                console.error('Error fetching subzones:', error)
                toast.error(error.message || "Failed to fetch subzone list")
                setData([])
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [getMasterSubZone])

    const handleAddNewSubZone = () => {
        navigate("/dashboard/master_subzone_add")
    }

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">Loading subzones...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Master SubZone List</h1>
                <button
                    onClick={handleAddNewSubZone}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
                >
                    Add New SubZone
                </button>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No subzones found.</p>
                    <p className="text-gray-500 mt-2">Click "Add New SubZone" to create one.</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-gray-600 rounded-lg shadow">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">#</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Zone ID</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">SubZone Name</th>
                                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr
                                    key={item._id}
                                    className="border-t hover:bg-gray-500 transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 text-center">{index + 1}</td>
                                    <td className="px-6 py-4">{item.zoneId}</td>
                                    <td className="px-6 py-4">{item.SubZoneName}</td>
                                    <td className="px-6 py-4">
    {new Date(Date.parse(item.createdAt)).toLocaleString()}
</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default Master_SubZone_Page