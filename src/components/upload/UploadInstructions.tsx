import React from 'react';

interface UploadInstructionsProps {
  userId?: number;
}

export function UploadInstructions({ userId }: UploadInstructionsProps) {
  // Function to handle CSV template download
  const handleDownloadTemplate = () => {
    // Create sample CSV data
    const csvContent = `Stock #,Shape,Carat,Color,Clarity,Cut,Polish,Symmetry,Price,Status
D1001,Round,1.01,D,VS1,Excellent,Excellent,Excellent,10000,Available
D1002,Princess,1.52,E,VVS2,Very Good,Excellent,Very Good,15000,Available
D1003,Emerald,2.03,F,SI1,Excellent,Very Good,Excellent,18500,Available
D1004,Oval,1.25,G,VS2,Good,Good,Good,12500,Available
D1005,Cushion,1.75,H,SI2,Very Good,Very Good,Very Good,14000,Available`;

    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link and trigger the download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'diamond_inventory_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-200">Instructions</h3>
      <div className="space-y-2 text-sm text-gray-300">
        <p>Please ensure your CSV file follows the required format:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-400">
          <li>One diamond per row</li>
          <li>Required columns: Stock #, Shape, Carat (or Weight), Color, Clarity, Price</li>
          <li>Optional columns: Cut, Polish, Symmetry, Status</li>
          <li>First row should contain column headers</li>
        </ul>
        <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded-lg">
          <p className="text-sm text-green-300">
            <strong>Ready:</strong> Your CSV data will be uploaded directly to your database 
            and filtered by your user ID ({userId}).
          </p>
        </div>
        <p className="mt-4 text-gray-400 text-xs">
          Need a template? <button onClick={handleDownloadTemplate} className="text-diamond-400 hover:underline">Download sample CSV</button>
        </p>
      </div>
    </div>
  );
}