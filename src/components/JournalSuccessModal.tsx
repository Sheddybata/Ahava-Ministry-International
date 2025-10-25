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
  sharedToCommunity?: boolean;
}

const JournalSuccessModal: React.FC<JournalSuccessModalProps> = ({ isOpen, onClose, entry, sharedToCommunity = false }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'image' | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [exportedFile, setExportedFile] = useState<{type: 'pdf' | 'image', url: string, blob?: Blob} | null>(null);
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
      
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setExportedFile({ type: 'pdf', url: pdfUrl, blob: pdfBlob });
      setShowShareOptions(true);
      
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
      
      const imageUrl = canvas.toDataURL('image/png');
      const blob = await fetch(imageUrl).then(res => res.blob());
      setExportedFile({ type: 'image', url: imageUrl, blob });
      setShowShareOptions(true);
      
      const link = document.createElement('a');
      link.download = `faithflow-journal-${entry.day}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = imageUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const shareToWhatsApp = async () => {
    if (!exportedFile?.blob) return;
    
    try {
      if (exportedFile.type === 'image') {
        // For image sharing, use Web Share API first, then fallback to WhatsApp Web
        if (navigator.share && navigator.canShare) {
          const file = new File([exportedFile.blob], `faithflow-journal-${entry.day}.png`, { type: 'image/png' });
          
          try {
            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: entry.title,
                text: `*${entry.title}*\n\n${entry.content}\n\n- FaithFlow Journal Entry`,
                files: [file]
              });
              return;
            }
          } catch (shareError) {
            console.log('Native sharing failed, trying WhatsApp Web:', shareError);
          }
        }
        
        // Fallback: Try to open WhatsApp Web with the image
        const text = `*${entry.title}*\n\n${entry.content}\n\n- FaithFlow Journal Entry`;
        
        // Create a data URL for the image to include in WhatsApp
        const imageDataUrl = exportedFile.url;
        
        // For mobile devices, try to open WhatsApp directly
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          // On mobile, we can't directly share files via WhatsApp Web URL
          // So we'll open WhatsApp and let user manually attach the downloaded image
          const whatsappText = `${text}\n\n📸 Image has been downloaded to your device. Please attach it manually.`;
          const url = `whatsapp://send?text=${encodeURIComponent(whatsappText)}`;
          
          // Try WhatsApp app first
          window.location.href = url;
          
          // Fallback to WhatsApp Web after a delay
          setTimeout(() => {
            const webUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
            window.open(webUrl, '_blank');
          }, 1000);
        } else {
          // On desktop, open WhatsApp Web
          const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
          window.open(url, '_blank');
          
          // Show instruction to attach the downloaded image
          alert('WhatsApp Web opened! Please manually attach the downloaded image file.');
        }
        
      } else if (exportedFile.type === 'pdf') {
        // For PDF sharing
        const text = `*${entry.title}*\n\n${entry.content}\n\n- FaithFlow Journal Entry\n\n📄 PDF has been downloaded to your device!`;
        
        if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          // On mobile, open WhatsApp app
          const url = `whatsapp://send?text=${encodeURIComponent(text)}`;
          window.location.href = url;
          
          setTimeout(() => {
            const webUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(webUrl, '_blank');
          }, 1000);
        } else {
          // On desktop, open WhatsApp Web
          const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
          window.open(url, '_blank');
          
          alert('WhatsApp Web opened! Please manually attach the downloaded PDF file.');
        }
      }
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      // Ultimate fallback to text sharing
      const text = `*${entry.title}*\n\n${entry.content}\n\n- FaithFlow Journal Entry`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  const shareViaBluetooth = async () => {
    if ('bluetooth' in navigator) {
      try {
        const device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['battery_service']
        });
        
        if (exportedFile?.type === 'image') {
          alert('📸 Image downloaded! Bluetooth sharing requires additional setup. You can manually share the downloaded image file via Bluetooth.');
        } else if (exportedFile?.type === 'pdf') {
          alert('📄 PDF downloaded! Bluetooth sharing requires additional setup. You can manually share the downloaded PDF file via Bluetooth.');
        } else {
          const text = `*${entry.title}*\n\n${entry.content}\n\n- FaithFlow Journal Entry`;
          alert('Bluetooth sharing feature would require additional setup. For now, you can copy the text and share manually.');
        }
      } catch (error) {
        console.error('Bluetooth error:', error);
        alert('Bluetooth sharing is not available on this device.');
      }
    } else {
      alert('Bluetooth is not supported on this device.');
    }
  };

  const saveToDevice = async () => {
    try {
      if (exportedFile?.type === 'image') {
        // For images, copy the image to clipboard
        if (navigator.clipboard && navigator.clipboard.write) {
          const blob = exportedFile.blob!;
          const clipboardItem = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([clipboardItem]);
          alert('📸 Image copied to clipboard!');
        } else {
          // Fallback to text
          const text = `*${entry.title}*\n\n${entry.content}\n\n- FaithFlow Journal Entry`;
          navigator.clipboard.writeText(text).then(() => {
            alert('Journal entry copied to clipboard!');
          }).catch(() => {
            alert('Failed to copy to clipboard. Please try again.');
          });
        }
      } else if (exportedFile?.type === 'pdf') {
        // For PDF, copy text since we can't copy PDF to clipboard
        const text = `*${entry.title}*\n\n${entry.content}\n\n- FaithFlow Journal Entry\n\n📄 PDF has been downloaded to your device!`;
        navigator.clipboard.writeText(text).then(() => {
          alert('📄 PDF text copied to clipboard!');
        }).catch(() => {
          alert('Failed to copy to clipboard. Please try again.');
        });
      } else {
        // Default text copying
        const text = `*${entry.title}*\n\n${entry.content}\n\n- FaithFlow Journal Entry`;
        navigator.clipboard.writeText(text).then(() => {
          alert('Journal entry copied to clipboard!');
        }).catch(() => {
          alert('Failed to copy to clipboard. Please try again.');
        });
      }
    } catch (error) {
      console.error('Error copying to device:', error);
      alert('Failed to copy to clipboard. Please try again.');
    }
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

        {/* Community Sharing Status */}
        <div className="px-6 py-3 bg-blue-50 border-l-4 border-blue-400">
          <div className="flex items-center space-x-2">
            <span className="text-blue-600 text-lg">🌐</span>
            <p className="text-blue-800 font-medium">Shared with Community!</p>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            Your insights are now visible in the Community tab for others to benefit from.
          </p>
        </div>

        {/* Entry Preview */}
        <div className="p-6">
          <div 
            ref={entryRef}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-center"
          >
            {/* Logo and Ministry Name - Centered at Top */}
            <div className="text-center mb-6">
              <img src="/faithflow-logo.jpg" alt="FaithFlow" className="w-12 h-12 rounded-full mx-auto mb-2" />
              <p className="text-xs text-gray-400">Ahava Ministry International</p>
            </div>

            {/* Entry Title and Date - Below Logo */}
            <div className="text-center mb-4 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">{entry.title}</h3>
              <p className="text-sm text-gray-500">
                Day {entry.day || 1}
                {entry.date && !isNaN(new Date(entry.date).getTime()) && ` • ${new Date(entry.date).toLocaleDateString()}`}
              </p>
            </div>

            {/* Entry Content */}
            <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed text-left">
              {entry.content}
            </div>
          </div>
        </div>

        {/* Export Options */}
        {!showShareOptions && (
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Export & Share</h3>
            
            <div className="grid grid-cols-2 gap-3">
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
          </div>
        )}

        {/* Share Options */}
        {showShareOptions && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Share Your {exportedFile?.type === 'pdf' ? 'PDF' : 'Image'}
              </h3>
              <button
                onClick={() => setShowShareOptions(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back to Export
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
                <span className="text-sm font-medium">Copy Text</span>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
          >
            Continue Journaling
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalSuccessModal;