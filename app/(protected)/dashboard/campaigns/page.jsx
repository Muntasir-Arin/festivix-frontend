'use client';

import React, { useState } from 'react';

export default function Campaigns() {
  const [formData, setFormData] = useState({
    eventId: '',
    title: '',
    description: '',
    emailList: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailArray = formData.emailList.split(',').map((email) => email.trim());

    try {
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, emailList: emailArray }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Campaign created and emails sent successfully!');
        setFormData({ eventId: '', title: '', description: '', emailList: '' });
      } else {
        alert('Failed to create campaign');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Create Event Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Event ID</label>
          <input
            type="text"
            value={formData.eventId}
            onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-medium">Email List (comma-separated)</label>
          <textarea
            value={formData.emailList}
            onChange={(e) => setFormData({ ...formData, emailList: e.target.value })}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
          Create Campaign
        </button>
      </form>
    </div>
  );
}
