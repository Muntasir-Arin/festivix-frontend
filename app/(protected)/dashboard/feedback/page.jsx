'use client';

import React, { useState } from 'react';

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    message: '',
  });

  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setFeedbackSent(true);
        setFormData({ name: '', email: '', rating: 5, message: '' });
      } else {
        alert('Failed to submit feedback.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b bg-gray-900 flex items-center justify-center">
<div className="bg-white bg-opacity-10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-6 w-full max-w-lg">

        {feedbackSent ? (
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Thank You!</h2>
            <p className="text-gray-300">Your feedback has been submitted successfully.</p>
            <button
              onClick={() => setFeedbackSent(false)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
            >
              Submit More Feedback
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
              We Value Your Feedback
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Select Event</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Feedback</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share your thoughts..."
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                 className="w-full bg-white hover:bg-gray-900 hover:text-white text-black py-2 px-4 rounded-xl transition-colors duration-200"
              >
                Submit Feedback
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
