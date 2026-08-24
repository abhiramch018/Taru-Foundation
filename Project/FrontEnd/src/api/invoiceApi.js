import axiosClient from './axiosClient';

export const invoiceApi = {
  // GET /api/invoices/:orderId (returns PDF blob)
  downloadInvoice: async (orderId) => {
    const response = await axiosClient.get(`/api/invoices/${orderId}`, {
      responseType: 'blob',
    });
    
    // Create a Blob URL and trigger browser download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `invoice-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    
    return true;
  },

  // View PDF in a new browser tab
  viewInvoice: async (orderId) => {
    const response = await axiosClient.get(`/api/invoices/${orderId}`, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = window.URL.createObjectURL(blob);
    window.open(fileURL, '_blank');
  },
};
