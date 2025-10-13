import React, { useState } from 'react';

const AnnouncementForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [sending, setSending] = useState(false);
  const [preview, setPreview] = useState(false);

  const canSend = title.trim().length > 0 && message.trim().length > 0 && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, link })
      });
      if (!res.ok) throw new Error('Failed to send');
      setTitle('');
      setMessage('');
      setLink('');
      alert('Announcement sent');
    } catch (e) {
      alert('Failed to send announcement');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="e.g., Bible Study Reminder"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/80</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={5}
          placeholder="What would you like to share?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500">{message.length}/500</p>
          <button
            className="text-xs text-red-600 hover:underline"
            onClick={() => setPreview(!preview)}
          >
            {preview ? 'Hide preview' : 'Preview'}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Optional Link</label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="https://zoom.us/... or /?tab=community"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </div>

      {preview && (
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
          <p className="text-sm text-gray-500 mb-2">Preview</p>
          <div className="flex items-start space-x-3">
            <img src="/FaithFlow logo.jpg" alt="logo" className="w-8 h-8 rounded" />
            <div>
              <h4 className="font-semibold text-gray-800">{title || 'Title'}</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{message || 'Message body...'}</p>
              {link && <a href={link} className="text-red-600 text-sm mt-1 inline-block">{link}</a>}
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`flex-1 py-3 rounded-xl font-medium ${
            canSend ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {sending ? 'Sending…' : 'Send Announcement'}
        </button>
      </div>
    </div>
  );
};

export default AnnouncementForm;







