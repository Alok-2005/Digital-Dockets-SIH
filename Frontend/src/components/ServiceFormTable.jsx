import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ServiceFormTable = ({ serviceId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [subzones, setSubzones] = useState({});
  const [isServiceEnabled, setIsServiceEnabled] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Check if service is enabled
  useEffect(() => {
    const checkServiceStatus = async () => {
      try {
        const response = await api.get(`/api/admin/generate-form/status/${serviceId}`);
        console.log('Service status response:', response.data);
        if (response.data.success) {
          setIsServiceEnabled(response.data.status === 'ENABLED');
        } else {
          setIsServiceEnabled(false);
          toast.error(response.data.message || 'Service is not enabled');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking service status:', error);
        setIsServiceEnabled(false);
        toast.error('Unable to verify service status');
        navigate('/dashboard');
      }
    };

    checkServiceStatus();
  }, [serviceId, navigate]);

  // Fetch subzones
  useEffect(() => {
    if (!isServiceEnabled) return;

    const fetchSubzones = async () => {
      try {
        const response = await api.get('/api/admin/master_subzone');
        console.log('Subzones response:', response.data);
        if (response.data.success) {
          const subzoneMapping = {};
          response.data.subzones.forEach((subzone) => {
            subzoneMapping[subzone._id] = subzone.SubZoneName;
          });
          setSubzones(subzoneMapping);
        }
      } catch (error) {
        console.error('Error fetching subzones:', error);
      }
    };

    fetchSubzones();
  }, [isServiceEnabled]);

  // Fetch user role
  useEffect(() => {
    if (!isServiceEnabled) return;

    const fetchUserRole = async () => {
      try {
        const response = await api.get('/api/auth/check-auth');
        console.log('User role response:', response.data);
        if (response.data.success) {
          setUserRole(response.data.user.role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, [isServiceEnabled]);

  // Fetch submissions
  useEffect(() => {
    if (!isServiceEnabled) return;

    const fetchSubmissions = async () => {
      try {
        const userResponse = await api.get('/api/auth/check-auth');
        console.log('User auth response:', userResponse.data);
        const userId = userResponse.data.user._id;
        const userRole = userResponse.data.user.role;

        const response = await api.get(`/api/admin/service/formdata/${serviceId}`);
        console.log('Submissions response:', response.data);

        if (response.data.success) {
          let formData = response.data.submissions;

          if (userRole === 'citizen') {
            formData = formData.filter(submission => submission.submittedBy === userId);
          }

          setSubmissions(formData);

          const allHeaders = new Set();
          formData.forEach((submission) => {
            Object.keys(submission.formData).forEach((key) => {
              allHeaders.add(key);
            });
          });

          const headers = [...allHeaders].filter((header) => header.toLowerCase() !== 'subzone');
          setTableHeaders(headers);
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Failed to fetch submissions');
      }
    };

    fetchSubmissions();
  }, [serviceId, isServiceEnabled]);

  if (!isServiceEnabled) {
    return (
      <div className="container mx-auto p-4 bg-white text-black">
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Service Not Available</h2>
          <p className="text-gray-600">This service is currently disabled or not configured.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Handle process button
  const handleProcess = (submission, index) => {
    const formattedServiceId = `${serviceId}-${submission.formData.category || 'general'}`;
    navigate('/dashboard/add', {
      state: {
        serviceId: formattedServiceId,
        RecId: (index + 1).toString(),
        submissionId: submission._id,
        submissionData: submission,
      },
    });
  };

  // Render table cell
  const renderCell = (submission, header) => {
    const value = submission.formData[header];

    if (header.toLowerCase().includes('subzoneName')) {
      return subzones[value] || 'N/A';
    }

    if (isFileField(header)) {
      if (typeof value === 'object' && value !== null) {
        return (
          <div>
            <div className="text-sm text-gray-700 font-semibold">{value.label || 'Document'}</div>
            {value.url && isValidUrl(value.url) ? (
              <a
                href={value.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block mt-1"
              >
                View Document
              </a>
            ) : (
              <div className="text-sm text-red-500 mt-1">No file uploaded</div>
            )}
          </div>
        );
      }
      if (!value) return 'No file uploaded';
      if (isValidUrl(value)) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block"
          >
            View Document
          </a>
        );
      }
      return value || 'No document selected';
    }

    return value || 'N/A';
  };

  // Render status
  const renderStatus = (submission, index) => {
    const currentStatus = submission.status || 'auth_1';

    if (currentStatus === 'done') {
      return (
        <div className="flex flex-col items-center gap-2">
          <div className="text-center font-semibold text-green-600">COMPLETED</div>
          <button
            onClick={() => navigate('/dashboard/certificate', {
              state: {
                serviceId: submission.service,
                submissionData: submission
              }
            })}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Certificate
          </button>
        </div>
      );
    }

    if (submission.paymentStatus === 'pending' && userRole === 'citizen') {
      return (
        <PaymentForm submissionId={submission._id} serviceId={serviceId} setSubmissions={setSubmissions} />
      );
    }

    if (submission.paymentStatus === 'success' && ['auth_1', 'auth_2'].includes(userRole)) {
      if (userRole === 'auth_1' && currentStatus === 'auth_1') {
        return (
          <div className="flex flex-col items-center">
            <div className="mb-2 font-semibold text-blue-600">Pending AUTH_1</div>
            <button
              onClick={() => handleProcess(submission, index)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Process
            </button>
          </div>
        );
      }

      if (userRole === 'auth_2' && currentStatus === 'auth_2') {
        return (
          <div className="flex flex-col items-center">
            <div className="mb-2 font-semibold text-purple-600">Pending AUTH_2</div>
            <button
              onClick={() => handleProcess(submission, index)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Process
            </button>
          </div>
        );
      }
    }

    if (currentStatus === 'rejected') {
      return <div className="text-center font-semibold text-red-600">REJECTED</div>;
    }

    return <div className="text-center font-semibold text-blue-600">PENDING AUTH_1</div>;
  };

  // Helper functions
  const isFileField = (header) => {
    const fileIndicators = ['document', 'file', 'upload', 'identity', 'certificate'];
    const headerLower = header.toLowerCase();
    return fileIndicators.some((indicator) => headerLower.includes(indicator));
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Payment Form Component with Razorpay
  const PaymentForm = ({ submissionId, serviceId, setSubmissions }) => {
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [amount, setAmount] = useState(null);

    // Fetch payment amount from ServiceConfig
    useEffect(() => {
      const fetchAmount = async () => {
        try {
          const response = await api.get(`/api/admin/service-config/amount/${serviceId}`);
          console.log('Fetch amount response:', response.data);
          if (response.data.success) {
            const fetchedAmount = Number(response.data.amount);
            if (isNaN(fetchedAmount) || fetchedAmount <= 0) {
              throw new Error('Invalid amount received');
            }
            if (fetchedAmount < 1) {
              throw new Error('Amount must be at least ₹1');
            }
            setAmount(fetchedAmount);
          } else {
            toast.error(response.data.message || 'Failed to fetch payment amount');
          }
        } catch (error) {
          console.error('Error fetching payment amount:', error);
          toast.error(error.response?.data?.message || error.message || 'Error fetching payment amount');
        }
      };

      fetchAmount();
    }, [serviceId]);

    const handlePayment = async () => {
      if (!amount) {
        toast.error('Payment amount not available');
        return;
      }

      try {
        // Load Razorpay script dynamically
        const loadRazorpayScript = () => {
          return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
          });
        };

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          console.error('Failed to load Razorpay SDK');
          toast.error('Failed to load Razorpay SDK');
          return;
        }

        // Create order in backend
        const orderResponse = await api.post(`/api/admin/service/create-order`, {
          amount: Math.round(amount), // Ensure integer in rupees
          currency: 'INR',
          submissionId,
        });
        console.log('Create order response:', orderResponse.data);

        if (!orderResponse.data.success) {
          console.error('Order creation failed:', orderResponse.data);
          const errorMessage = orderResponse.data.error?.details?.description ||
                              orderResponse.data.error?.message ||
                              orderResponse.data.message ||
                              'Failed to create order';
          toast.error(errorMessage);
          return;
        }

        const { order } = orderResponse.data;

        // Fetch Razorpay key from backend
        let razorpayKey;
        try {
          const keyResponse = await api.get('/api/admin/razorpay-key');
          console.log('Razorpay key response:', keyResponse.data);
          if (keyResponse.data.success) {
            razorpayKey = keyResponse.data.key;
          } else {
            throw new Error('Failed to fetch Razorpay key');
          }
        } catch (error) {
          console.error('Error fetching Razorpay key:', error);
          // Fallback to environment variable (for testing)
          razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
          if (!razorpayKey) {
            console.error('Razorpay key not configured');
            toast.error('Payment configuration error');
            return;
          }
        }

        // Initialize Razorpay
        const options = {
          key: razorpayKey,
          amount: order.amount,
          currency: order.currency,
          name: 'Service Payment',
          description: `Payment for Service ${serviceId}`,
          order_id: order.id,
          handler: async function (response) {
            try {
              // Verify payment and update status
              const verifyResponse = await api.post(`/api/admin/service/verify-payment`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                submissionId,
              });
              console.log('Verify payment response:', verifyResponse.data);

              if (verifyResponse.data.success) {
                setPaymentStatus('success');
                toast.success('Payment successful');
                // Refresh submissions to reflect updated payment status
                const response = await api.get(`/api/admin/service/formdata/${serviceId}`);
                console.log('Refresh submissions response:', response.data);
                if (response.data.success) {
                  setSubmissions(response.data.submissions);
                }
              } else {
                setPaymentStatus('failed');
                toast.error(verifyResponse.data.message || 'Payment verification failed');
              }
            } catch (error) {
              console.error('Error verifying payment:', error);
              setPaymentStatus('failed');
              toast.error(error.response?.data?.message || 'Error verifying payment');
            }
          },
          prefill: {
            name: 'User Name', // Replace with actual user data
            email: 'user@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#3399cc',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          console.error('Payment failed:', response.error);
          setPaymentStatus('failed');
          toast.error(response.error.description || 'Payment failed');
        });
        rzp.open();
      } catch (error) {
        console.error('Error initiating payment:', error);
        const errorMessage = error.response?.data?.error?.details?.description ||
                            error.response?.data?.error?.message ||
                            error.response?.data?.message ||
                            'Error initiating payment';
        toast.error(errorMessage);
      }
    };

    return (
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-2">Payment Required</h2>
        {amount ? (
          <p className="mb-2">Amount: ₹{amount}</p>
        ) : (
          <p className="mb-2 text-red-500">Loading amount...</p>
        )}
        <button
          onClick={handlePayment}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={!amount}
        >
          Pay Now
        </button>
        {paymentStatus === 'success' && <p className="mt-2 text-green-600">Payment successful!</p>}
        {paymentStatus === 'failed' && <p className="mt-2 text-red-600">Payment failed. Please try again.</p>}
      </div>
    );
  };

  // Render component
  return (
    <div className="container mx-auto p-4 bg-white text-black">
      <h1 className="text-2xl font-semibold mb-6">Submitted Form Data for Service {serviceId}</h1>

      {submissions.length === 0 ? (
        <p>No form submissions available for this service.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border-b bg-gray-50">ID</th>
                {tableHeaders.map((header, index) => (
                  <th key={index} className="px-4 py-2 text-left border-b bg-gray-50">
                    {header}
                  </th>
                ))}
                <th className="px-4 py-2 text-left border-b bg-gray-50">Last Updated</th>
                <th className="px-4 py-2 text-center border-b bg-gray-50">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => {
                const latestProcess = submission.processedBy?.[submission.processedBy.length - 1];
                const lastUpdated = latestProcess?.processedAt || submission.submittedAt;

                return (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b">{index + 1}</td>
                    {tableHeaders.map((header, idx) => (
                      <td key={idx} className="px-4 py-2 border-b">
                        {renderCell(submission, header)}
                      </td>
                    ))}
                    <td className="px-4 py-2 border-b text-sm text-gray-600">
                      {formatDate(lastUpdated)}
                    </td>
                    <td className="px-4 py-2 border-b">{renderStatus(submission, index)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServiceFormTable;