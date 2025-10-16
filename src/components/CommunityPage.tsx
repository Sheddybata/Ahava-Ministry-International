import React, { useState } from 'react';
import JournalSuccessModal from './JournalSuccessModal';

interface CommunityEntry {
  id: string;
  username: string;
  avatar: string;
  day: number;
  date: string;
  content: string;
  type: 'insight' | 'prayer' | 'testimony';
  likes: number;
  likedBy: string[]; // Array of user IDs who liked this post
  comments: Comment[];
  isTemporary?: boolean; // Indicates if this is a temporary fallback post
  // Journal entry fields
  insight?: string;
  attention?: string;
  commitment?: string;
  task?: string;
  system?: string;
  prayer?: string;
}

interface Comment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  date: string;
}

interface CommunityPageProps {
  entries: CommunityEntry[];
  onAddComment: (entryId: string, comment: string) => void;
  onLikeEntry: (entryId: string) => void;
  onAddPrayerRequest: (prayerRequest: { title: string; content: string; isAnonymous: boolean }) => void;
  onAddTestimony: (testimony: { title: string; content: string; isAnonymous: boolean }) => void;
  currentUserId?: string; // Current user ID to check if they've liked a post
  currentUserProfilePicture?: string; // Current user's profile picture for comment box
}

const CommunityPage: React.FC<CommunityPageProps> = ({ 
  entries, 
  onAddComment, 
  onLikeEntry, 
  onAddPrayerRequest, 
  onAddTestimony,
  currentUserId = 'current-user', // Default user ID for demo
  currentUserProfilePicture
}) => {
  const [activeTab, setActiveTab] = useState<'insight' | 'prayer' | 'testimony'>('insight');
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});
  const [showPrayerForm, setShowPrayerForm] = useState(false);
  const [showTestimonyForm, setShowTestimonyForm] = useState(false);
  const [prayerForm, setPrayerForm] = useState({ title: '', content: '', isAnonymous: false });
  const [testimonyForm, setTestimonyForm] = useState({ title: '', content: '', isAnonymous: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exportEntry, setExportEntry] = useState<any | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  console.log('🔍 Community page - all entries:', entries);
  console.log('🔍 Community page - entries length:', entries?.length || 0);
  console.log('🔍 Community page - active tab:', activeTab);
  console.log('🔍 Community page - entry types:', entries?.map(e => e.type) || []);
  const filteredEntries = entries.filter(entry => entry.type === activeTab);
  console.log('🔍 Community page - filtered entries:', filteredEntries);
  console.log('🔍 Community page - filtered entries length:', filteredEntries?.length || 0);

  const tabs = [
    { id: 'insight', label: 'INSIGHT ACTS', icon: '💡' },
    { id: 'prayer', label: 'Prayer Wall', icon: '🙏' },
    { id: 'testimony', label: 'Testimonies', icon: '✨' }
  ];

  const handleAddComment = (entryId: string) => {
    const comment = commentText[entryId]?.trim();
    if (comment) {
      onAddComment(entryId, comment);
      setCommentText(prev => ({ ...prev, [entryId]: '' }));
    }
  };

  const toggleComments = (entryId: string) => {
    setShowComments(prev => ({ ...prev, [entryId]: !prev[entryId] }));
  };

  const handlePrayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerForm.title.trim() || !prayerForm.content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddPrayerRequest(prayerForm);
      setPrayerForm({ title: '', content: '', isAnonymous: false });
      setShowPrayerForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestimonySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonyForm.title.trim() || !testimonyForm.content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddTestimony(testimonyForm);
      setTestimonyForm({ title: '', content: '', isAnonymous: false });
      setShowTestimonyForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-20">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-red-100 text-red-800'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submission Buttons */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex space-x-3">
          {activeTab === 'prayer' && (
            <button
              onClick={() => setShowPrayerForm(true)}
              className="flex items-center space-x-2 bg-red-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-900 transition-colors"
            >
              <span>🙏</span>
              <span>Submit Prayer Request</span>
            </button>
          )}
          {activeTab === 'testimony' && (
            <button
              onClick={() => setShowTestimonyForm(true)}
              className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
            >
              <span>✨</span>
              <span>Share Testimony</span>
            </button>
          )}
        </div>
      </div>

      {/* Entries Feed */}
      <div className="p-4 space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No entries yet</h3>
            <p className="text-gray-600">Be the first to share your {activeTab} with the community!</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              {/* Entry Header */}
              <div className="flex items-center space-x-3 mb-3">
                {entry.avatar ? (
                  <img 
                    src={entry.avatar} 
                    alt={entry.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-lg text-gray-400">👤</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-800">{entry.username}</h4>
                    {entry.isTemporary && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        📱 Local Only
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Day {entry.day}</span>
                    <span>•</span>
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Entry Content */}
              <div className="mb-4">
                {entry.type === 'insight' && entry.insight ? (
                  <div className="space-y-4">
                    {/* INSIGHT */}
                    {entry.insight && (
                      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border-l-4 border-red-500">
                        <h5 className="font-semibold text-red-800 mb-2 flex items-center">
                          <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
                          INSIGHT
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed">{entry.insight}</p>
                      </div>
                    )}

                    {/* ATTENTION */}
                    {entry.attention && (
                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border-l-4 border-yellow-500">
                        <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                          <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
                          ATTENTION
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed">{entry.attention}</p>
                      </div>
                    )}

                    {/* COMMITMENT */}
                    {entry.commitment && (
                      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border-l-4 border-red-500">
                        <h5 className="font-semibold text-red-800 mb-2 flex items-center">
                          <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</span>
                          COMMITMENT
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed">{entry.commitment}</p>
                      </div>
                    )}

                    {/* TASK */}
                    {entry.task && (
                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border-l-4 border-yellow-500">
                        <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                          <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">4</span>
                          TASK
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed">{entry.task}</p>
                      </div>
                    )}

                    {/* SYSTEM */}
                    {entry.system && (
                      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border-l-4 border-red-500">
                        <h5 className="font-semibold text-red-800 mb-2 flex items-center">
                          <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">5</span>
                          SYSTEM
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed">{entry.system}</p>
                      </div>
                    )}

                    {/* PRAYER */}
                    {entry.prayer && (
                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border-l-4 border-yellow-500">
                        <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                          <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">6</span>
                          PRAYER
                        </h5>
                        <p className="text-gray-700 text-sm leading-relaxed">{entry.prayer}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-800 leading-relaxed">{entry.content}</p>
                )}
              </div>

              {/* Entry Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onLikeEntry(entry.id)}
                    className={`flex items-center space-x-1 transition-colors ${
                      entry.likedBy?.includes(currentUserId) 
                        ? 'text-red-600' 
                        : 'text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <span>{entry.likedBy?.includes(currentUserId) ? '❤️' : '🤍'}</span>
                    <span className="text-sm">{entry.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => toggleComments(entry.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <span>💬</span>
                    <span className="text-sm">{entry.comments?.length || 0}</span>
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    const constructed = {
                      title: `${entry.type.toUpperCase()} - Day ${entry.day}`,
                      content: entry.type === 'insight'
                        ? [
                            entry.insight ? `INSIGHT: ${entry.insight}` : undefined,
                            entry.attention ? `ATTENTION: ${entry.attention}` : undefined,
                            entry.commitment ? `COMMITMENT: ${entry.commitment}` : undefined,
                            entry.task ? `TASK: ${entry.task}` : undefined,
                            entry.system ? `SYSTEM: ${entry.system}` : undefined,
                            entry.prayer ? `PRAYER: ${entry.prayer}` : undefined,
                          ].filter(Boolean).join('\n\n')
                        : entry.content,
                      date: new Date(entry.date).toLocaleDateString(),
                      day: entry.day,
                    };
                    setExportEntry(constructed);
                    setShowExportModal(true);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span>📤</span>
                </button>
              </div>

              {/* Comments Section */}
              {showComments[entry.id] && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* Existing Comments */}
                  {(entry.comments || []).map((comment) => (
                    <div key={comment.id} className="flex space-x-3 mb-3">
                      {comment.avatar ? (
                        <img 
                          src={comment.avatar} 
                          alt={comment.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm text-gray-400">👤</span>
                        </div>
                      )}
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <h5 className="font-medium text-sm text-gray-800">{comment.username}</h5>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(comment.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="flex space-x-3">
                    {currentUserProfilePicture ? (
                      <img 
                        src={currentUserProfilePicture} 
                        alt="You"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm text-gray-400">👤</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <textarea
                        value={commentText[entry.id] || ''}
                        onChange={(e) => setCommentText(prev => ({ ...prev, [entry.id]: e.target.value }))}
                        placeholder="Add a comment..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        rows={2}
                      />
                      <button
                        onClick={() => handleAddComment(entry.id)}
                        disabled={!commentText[entry.id]?.trim()}
                        className="mt-2 px-4 py-1 bg-red-800 text-white rounded-lg text-sm font-medium hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Prayer Request Form Modal */}
      {showPrayerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Submit Prayer Request</h2>
                <button
                  onClick={() => setShowPrayerForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handlePrayerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={prayerForm.title}
                    onChange={(e) => setPrayerForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief title for your prayer request"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prayer Request</label>
                  <textarea
                    value={prayerForm.content}
                    onChange={(e) => setPrayerForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your prayer request with the community..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="prayer-anonymous"
                    checked={prayerForm.isAnonymous}
                    onChange={(e) => setPrayerForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="prayer-anonymous" className="text-sm text-gray-700">
                    Submit anonymously
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPrayerForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !prayerForm.title.trim() || !prayerForm.content.trim()}
                    className="flex-1 bg-red-800 text-white py-2 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Prayer Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Testimony Form Modal */}
      {showTestimonyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Share Testimony</h2>
                <button
                  onClick={() => setShowTestimonyForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleTestimonySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={testimonyForm.title}
                    onChange={(e) => setTestimonyForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief title for your testimony"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Testimony</label>
                  <textarea
                    value={testimonyForm.content}
                    onChange={(e) => setTestimonyForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share how God has worked in your life..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="testimony-anonymous"
                    checked={testimonyForm.isAnonymous}
                    onChange={(e) => setTestimonyForm(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <label htmlFor="testimony-anonymous" className="text-sm text-gray-700">
                    Share anonymously
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTestimonyForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !testimonyForm.title.trim() || !testimonyForm.content.trim()}
                    className="flex-1 bg-yellow-600 text-white py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sharing...' : 'Share Testimony'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Export / Share Modal (reuse Journal success modal) */}
      {exportEntry && (
        <JournalSuccessModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          entry={exportEntry}
        />
      )}
    </div>
  );
};

export default CommunityPage;