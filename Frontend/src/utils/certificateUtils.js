import html2pdf from 'html2pdf.js';

export const replacePlaceholders = (template, formData) => {
    return template.replace(/{{(\w+)}}/g, (match, key) => {
        return formData[key] || match;
    });
};

export const generatePDF = async (htmlContent) => {
    // Create a container div to hold the PDF content
    const container = document.createElement('div');
    container.style.width = '210mm';  // A4 width
    container.style.minHeight = '297mm';  // A4 height
    container.style.margin = 'auto';
    container.style.padding = '20mm';
    container.style.backgroundColor = 'white';
    container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    container.style.position = 'fixed';  // Ensure it's visible
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '1000';
    container.style.overflow = 'auto';
    container.style.maxWidth = '90%';
    container.style.maxHeight = '90%';

    // Create a content div with the HTML
    const content = document.createElement('div');
    content.innerHTML = htmlContent;
    container.appendChild(content);

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close Preview';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    closeButton.style.padding = '10px';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';

    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '999';

    container.appendChild(closeButton);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Handle close functionality
    const handleClose = () => {
        document.body.removeChild(overlay);
    };
    
    closeButton.addEventListener('click', handleClose);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) handleClose();
    });

    // PDF Generation
    const pdfOptions = {
        margin: [10, 10, 10, 10],
        filename: 'certificate.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        const pdfBlob = await html2pdf().set(pdfOptions).from(content).outputPdf('blob');
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = 'certificate.pdf';
        
        // Add download button to the container
        const downloadButton = document.createElement('button');
        downloadButton.textContent = 'Download PDF';
        downloadButton.style.backgroundColor = 'green';
        downloadButton.style.color = 'white';
        downloadButton.style.padding = '10px';
        downloadButton.style.border = 'none';
        downloadButton.style.borderRadius = '5px';
        downloadButton.style.marginRight = '10px';
        downloadButton.addEventListener('click', () => link.click());
        
        container.insertBefore(downloadButton, closeButton);

        return pdfBlob;
    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw error;
    }
};