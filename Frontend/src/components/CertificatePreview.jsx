import React, { useEffect, useState, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { QRCodeCanvas } from 'qrcode.react';
import sha256 from 'crypto-js/sha256'; // Crypto hash for digital signature

const CertificatePreview = ({ template, formData }) => {
  const [processedTemplate, setProcessedTemplate] = useState('');
  const [digitalSignature, setDigitalSignature] = useState('');
  const [signatureQRValue, setSignatureQRValue] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (template && formData) {
      let processed = template;

      // Format date fields
      const formatDate = (dateString) => {
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        } catch (e) {
          return dateString;
        }
      };

      // Replace placeholders with form data
      Object.entries(formData).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        let processedValue = value;

        // Format specific dates
        if (key === 'submittedAt' || key === 'Date of Birth') {
          processedValue = formatDate(value);
        }

        processed = processed.replace(regex, processedValue || 'N/A');
      });

      // Add current date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      processed = processed.replace(/{{current_date}}/g, currentDate);

      // Replace any remaining placeholders with "N/A"
      processed = processed.replace(/{{[^}]+}}/g, 'N/A');

      setProcessedTemplate(processed);

      // Generate Digital Signature
      const hashData = sha256(JSON.stringify(formData) + template + currentDate).toString();
      setDigitalSignature(hashData);

      // Prepare QR code with the digital signature data
      const qrData = {
        id: formData._id,
        name: formData.Name,
        serviceId: formData.serviceId,
        issuedAt: new Date().toISOString(),
        signature: hashData, // Include the digital signature hash in the QR code
      };
      setSignatureQRValue(JSON.stringify(qrData)); // Set QR code data
    }
  }, [template, formData]);

  const handleDownload = async () => {
    try {
      const element = document.getElementById('certificate-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      pdf.save(`certificate-${formData._id || 'download'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="w-full bg-white shadow rounded-lg border">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-gray-50 flex flex-row items-center justify-between text-black">
        <h2 className="text-lg font-semibold">Certificate Preview</h2>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div
          id="certificate-content"
          className="bg-white p-8 rounded-lg border max-w-[800px] mx-auto"
          data-color-mode="light"
        >
          <MDEditor.Markdown
            source={processedTemplate}
            className="certificate-preview"
            style={{
              background: 'white',
              fontSize: '16px',
              lineHeight: '1.6',
            }}
          />

          {/* QR Code with Digital Signature */}
          <div className="mt-6 text-center">
            <QRCodeCanvas
              value={signatureQRValue} // QR code containing the digital signature data
              size={128}
            />
            <p className="text-sm text-gray-600 mt-2">Scan the QR code to verify the certificate.</p>
          </div>

          {/* Digital Signature */}
          <div className="mt-6">
            <p className="text-right text-gray-800 text-lg font-semibold italic">
              Authorized Signature
            </p>
            <p className="text-right text-gray-600 font-medium">
              {formData.authorizerName || '[Name of Authorizer]'}
            </p>
            <p className="text-right text-gray-500 text-sm mt-2">
              Digital Signature (Hash): <span className="text-blue-600">{digitalSignature.slice(0, 12)}...</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
