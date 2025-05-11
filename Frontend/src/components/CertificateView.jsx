import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Download } from 'lucide-react'; // lucide-react icon used
import MDEditor from '@uiw/react-md-editor'; // Markdown editor to display certificate content
import jsPDF from 'jspdf'; // jspdf library to generate PDF
import html2canvas from 'html2canvas'; // html2canvas library to convert HTML to canvas
import CertificatePreview from './CertificatePreview';
const CertificateView = () => {
  const [certificateData, setCertificateData] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { serviceId, submissionData } = location.state || {};

  const BASE_URL = 'https://digital-dockets-sih-2.onrender.com' 
  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/service_config/certificate/${serviceId}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          let template = response.data.certificateData;
          Object.entries(submissionData.formData).forEach(([key, value]) => {
            template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
          });
          setCertificateData(template);
        }
      } catch (err) {
        setError('Failed to fetch certificate data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchCertificateData();
    }
  }, [serviceId, submissionData]);

  const handleDownload = () => {
    // Capture the certificate content and generate PDF
    const element = document.getElementById('certificate-content');
    if (!element) return;

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('certificate.pdf');
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading certificate...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    // <div className="container mx-auto p-6">
    //   <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg border shadow-lg text-black">
    //     <div className="flex justify-between items-center mb-6">
    //       <h1 className="text-2xl font-bold">Certificate Preview</h1>
    //       <button
    //         onClick={handleDownload}
    //         className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    //       >
    //         <Download size={20} />
    //         Download PDF
    //       </button>
    //     </div>

    //     <div id="certificate-content" className="bg-white p-8 rounded-lg border">
    //       <MDEditor.Markdown 
    //         source={certificateData} 
    //         className="prose max-w-none"
    //       />
    //     </div>
    //   </div>
    // </div>
    <CertificatePreview 
  template={certificateData}
  formData={submissionData.formData}
/>
  );
};

export default CertificateView;
