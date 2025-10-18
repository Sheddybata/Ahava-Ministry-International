import React, { useState } from 'react';
import JournalSuccessModal from './JournalSuccessModal';

interface JournalPageProps {
  currentDay: number;
  onSaveEntry: (entry: any) => void;
}

const JournalPage: React.FC<JournalPageProps> = ({ currentDay, onSaveEntry }) => {
  const [formData, setFormData] = useState({
    insight: '',
    attention: '',
    commitment: '',
    task: '',
    system: '',
    prayer: ''
  });
  const [shareToCommunity, setShareToCommunity] = useState(true); // Always share to community
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastEntry, setLastEntry] = useState<any>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const entry = {
        ...formData,
        day: currentDay,
        date: new Date().toISOString(),
        id: Date.now(),
        title: `Day ${currentDay} Reflection`,
        content: `INSIGHT: ${formData.insight}\n\nATTENTION: ${formData.attention}\n\nCOMMITMENT: ${formData.commitment}\n\nTASK: ${formData.task}\n\nSYSTEM: ${formData.system}\n\nPRAYER: ${formData.prayer}`,
        shareToCommunity: shareToCommunity
      };
      
      console.log('📝 Calling onSaveEntry with:', entry);
      await onSaveEntry(entry);
      
      setLastEntry(entry);
      setIsSaving(false);
      setSaved(true);
      setShowSuccessModal(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('💥 Error saving journal entry:', error);
      setIsSaving(false);
      // Could add error handling UI here
    }
  };

  const fields = [
    {
      key: 'insight',
      label: 'INSIGHT',
      placeholder: 'What lessons did you learn? What is this chapter about?',
      description: 'Lessons and what the chapter is all about'
    },
    {
      key: 'attention',
      label: 'ATTENTION',
      placeholder: 'What is God drawing your attention to that you might overlook?',
      description: 'What God is drawing your mind to as you read'
    },
    {
      key: 'commitment',
      label: 'COMMITMENT',
      placeholder: 'What will you commit to do differently?',
      description: 'What you commit to afterwards'
    },
    {
      key: 'task',
      label: 'TASK',
      placeholder: 'How will you achieve your commitment?',
      description: 'How will you go about achieving your commitment'
    },
    {
      key: 'system',
      label: 'SYSTEM',
      placeholder: 'How will you monitor your progress?',
      description: 'How you intend to monitor your commitment and tasks'
    },
    {
      key: 'prayer',
      label: 'PRAYER',
      placeholder: 'Turn your lessons into personal prayer...',
      description: 'Turn your lessons to personal prayer for yourself'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50">
      <div className="p-4 pb-20">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">My Reflection</h1>
                <p className="text-sm sm:text-base text-gray-600">Capture your spiritual insights and growth</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-r from-red-800 to-yellow-600 text-white px-3 py-2 rounded-xl font-bold text-base">
                  Day {currentDay}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-100 to-yellow-100 rounded-lg p-4">
              <p className="text-sm text-gray-700 font-medium">
                ✨ Use the INSIGHT ACTS framework to deepen your spiritual reflection and growth
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="mb-6">
            <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
                <div>
                  <h3 className="text-green-800 font-semibold">Entry Saved Successfully!</h3>
                  <p className="text-green-700 text-sm">Your reflection has been recorded in your journal.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Journal Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.key} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Field Header */}
              <div className="bg-gradient-to-r from-red-800 to-yellow-600 p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{field.label}</h3>
                    <p className="text-white/80 text-sm">{field.description}</p>
                  </div>
                </div>
              </div>
              
              {/* Textarea */}
              <div className="p-6">
                <textarea
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                  rows={field.key === 'prayer' ? 5 : 4}
                  required
                />
                <div className="mt-2 text-right">
                  <span className="text-xs text-gray-400">
                    {formData[field.key as keyof typeof formData].length} characters
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Save Button */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-red-800 to-yellow-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-900 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSaving ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Your Reflection...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">💾</span>
                  <span>Save & Share Reflection</span>
                </>
              )}
            </button>
            <p className="text-center text-gray-500 text-sm mt-3">
              Your reflection will be saved to your journal and shared with the community
            </p>
          </div>
        </form>
      </div>
      
      {/* Success Modal */}
      {lastEntry && (
        <JournalSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          entry={lastEntry}
          sharedToCommunity={lastEntry.shareToCommunity}
        />
      )}
    </div>
  );
};

export default JournalPage;