import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface JournalSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: {
    title: string;
    content: string;
    date: string;
    day: number;
  };
}

const JournalSuccessModal: React.FC<JournalSuccessModalProps> = ({ isOpen, onClose, entry }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'image' | null>(null);
  const entryRef = useRef<HTMLDivElement>(null);

  const exportAsPDF = async () => {
    if (!entryRef.current) return;
    
    setIsExporting(true);
    setExportType('pdf');
    
    try {
      const canvas = await html2canvas(entryRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`faithflow-journal-${entry.day}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const exportAsImage = async () => {
    if (!entryRef.current) return;
    
    setIsExporting(true);
    setExportType('image');
    
    try {
      const canvas = await html2canvas(entryRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `faithflow-journal-${entry.day}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const shareToWhatsApp = () => {
    const text = `*${entry.title}*\n\n${entry.content}\n\n- FaithFlow Journal Entry`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareViaBluetooth = async () => {
    if ('bluetooth' in navigator) {
      try {
        // @ts-ignore
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['battery_service']
        });
        
        const text = `*${entry.title}*\n\n${entry.content}\n\n- FaithFlow Journal Entry`;
        // Note: Actual Bluetooth sharing would require more complex implementation
        alert('Bluetooth sharing feature would require additional setup. For now, you can copy the text and share manually.');
      } catch (error) {
        console.error('Bluetooth error:', error);
        alert('Bluetooth sharing is not available on this device.');
      }
    } else {
      alert('Bluetooth is not supported on this device.');
    }
  };

  const saveToDevice = () => {
    const text = `*${entry.title}*\n\n${entry.content}\n\n- FaithFlow Journal Entry`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Journal entry copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard. Please try again.');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[1000]">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Journal Entry Saved!</h2>
              <p className="text-sm text-gray-600">Your reflection has been recorded</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Entry Preview */}
        <div className="p-6">
          <div 
            ref={entryRef}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            <div className="text-center mb-6">
              <img 
                src="/faithflow-logo.jpg" 
                alt="FaithFlow Logo" 
                className="w-16 h-16 mx-auto mb-3 rounded-full"
              />
              <h3 className="text-lg font-semibold text-gray-800">FaithFlow Journal</h3>
              <p className="text-sm text-gray-600">Day {entry.day} • {entry.date}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Reflection</h4>
                <h5 className="text-lg font-medium text-gray-900 mb-3">{entry.title}</h5>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">Created with FaithFlow</p>
              <p className="text-xs text-gray-400">Ahava Ministry International</p>
            </div>
          </div>
        </div>

        {/* Export and Share Options */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Export & Share</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={exportAsPDF}
              disabled={isExporting}
              className="flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <span className="text-xl">📄</span>
              <span className="font-medium">
                {isExporting && exportType === 'pdf' ? 'Generating...' : 'Export PDF'}
              </span>
            </button>
            
            <button
              onClick={exportAsImage}
              disabled={isExporting}
              className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <span className="text-xl">🖼️</span>
              <span className="font-medium">
                {isExporting && exportType === 'image' ? 'Generating...' : 'Export Image'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={shareToWhatsApp}
              className="flex flex-col items-center space-y-2 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl">💬</span>
              <span className="text-sm font-medium">WhatsApp</span>
            </button>
            
            <button
              onClick={shareViaBluetooth}
              className="flex flex-col items-center space-y-2 p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl">📶</span>
              <span className="text-sm font-medium">Bluetooth</span>
            </button>
            
            <button
              onClick={saveToDevice}
              className="flex flex-col items-center space-y-2 p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">💾</span>
              <span className="text-sm font-medium">Save</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            Continue Journaling
          </button>
          <button
            onClick={() => {
              // Navigate to community to share
              onClose();
            }}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Share to Community
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalSuccessModal;

