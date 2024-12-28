'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Calendar, MapPin, Tag, Ticket, QrCode } from 'lucide-react';

export default function Campaigns() {
  const em = "example@gmail.com";
  const c = true;

  const [formData, setFormData] = useState({
    eventId: '',
    title: '',
    description: '',
    emailList: '',
    emailBody: '',
    attachments: null,
  });

  const [events, setEvents] = useState([]);
  const [purchasers, setPurchasers] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingPurchasers, setLoadingPurchasers] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [couponCount, setCouponCount] = useState(0);

  // QR Code SVG generator function
  const generateQRCodeSVG = (text) => {
    const size = 128;
    const cellSize = 4;
    const margin = 4;
    const cells = Math.floor((size - 2 * margin) / cellSize);
    
    // Simple hash function to determine which cells to fill
    const hashString = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
      }
      return Math.abs(hash);
    };

    // Generate QR code-like pattern based on text
    const generatePattern = (text) => {
      const pattern = [];
      const hash = hashString(text);
      
      // Create fixed patterns for corners (like real QR codes)
      for (let i = 0; i < cells; i++) {
        pattern[i] = [];
        for (let j = 0; j < cells; j++) {
          // Position detection patterns in corners
          if ((i < 7 && j < 7) || // Top-left
              (i < 7 && j > cells - 8) || // Top-right
              (i > cells - 8 && j < 7)) { // Bottom-left
            pattern[i][j] = (i === 0 || i === 6 || j === 0 || j === 6 || 
                           (i > 1 && i < 5 && j > 1 && j < 5)) ? 1 : 0;
          } else {
            // Use hash to generate other patterns
            pattern[i][j] = ((hash + i * j) % 100) < 40 ? 1 : 0;
          }
        }
      }
      return pattern;
    };

    const pattern = generatePattern(text);
    let paths = '';

    // Generate SVG paths for the pattern
    pattern.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell) {
          const x = margin + j * cellSize;
          const y = margin + i * cellSize;
          paths += `M${x},${y}h${cellSize}v${cellSize}h-${cellSize}z `;
        }
      });
    });

    return (
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-32 h-32 bg-white"
      >
        <path d={paths} fill="black" />
      </svg>
    );
  };

  // Rest of the existing useEffect hooks and functions remain the same...
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data);
        setLoadingEvents(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (formData.eventId) {
      const fetchPurchasers = async () => {
        setLoadingPurchasers(true);
        try {
          const response = await fetch(`/api/events/${formData.eventId}/purchasers`);
          const data = await response.json();
          setPurchasers(data);
          setLoadingPurchasers(false);
        } catch (error) {
          console.error('Error fetching purchasers:', error);
          setLoadingPurchasers(false);
        }
      };
      fetchPurchasers();
    } else {
      setPurchasers([]);
    }
  }, [formData.eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailArray = formData.emailList.split(',').map((email) => email.trim());

    const formDataToSend = new FormData();
    formDataToSend.append('eventId', formData.eventId);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('emailList', JSON.stringify(emailArray));
    formDataToSend.append('emailBody', formData.emailBody);

    if (formData.attachments) {
      Array.from(formData.attachments).forEach((file, index) => {
        formDataToSend.append(`attachments[${index}]`, file);
      });
    }

    try {
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();
      if (result.success) {
        alert('Campaign created and emails sent successfully!');
        setFormData({ eventId: '', title: '', description: '', emailList: '', emailBody: '', attachments: null });
      } else {
        alert('Failed to create campaign');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const generateCoupon = () => {
    if (couponCount < 50) {
      const coupon = `COUPON-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      setCoupons((prevCoupons) => [...prevCoupons, coupon]);
      setCouponCount(couponCount + 1);
    } else {
      alert('Coupon limit reached');
    }
  };

  const LoadingSkeleton = () => (
    <div className="h-10 w-full bg-neutral-800 animate-pulse rounded" />
  );

  const PreviewToggle = () => (
    <button
      type="button"
      onClick={() => setShowPreview(!showPreview)}
      className="md:hidden w-full bg-neutral-800 text-white py-2 px-4 rounded-md mb-4 flex items-center justify-center gap-2"
    >
      <Mail className="w-4 h-4" />
      {showPreview ? 'Hide Preview' : 'Show Preview'}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950">
      <div className="container mx-auto p-4 md:p-6">
        <PreviewToggle />

        <div className="bg-black grid md:grid-cols-2 gap-4 md:gap-6 shadow-2xl shadow-red-500 rounded-md">
          {/* Form Section */}
          <div
            className={`bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 ${showPreview ? 'hidden' : 'block'} md:block`}
          >
            {/* ... (rest of the form section remains the same) ... */}
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 md:w-6 md:h-6" /> Event Broadcast
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Select Event</label>
                {loadingEvents ? (
                  <LoadingSkeleton />
                ) : (
                  <select
                    value={formData.eventId}
                    onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>Select an event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Subject</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email subject..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Email Body</label>
                <textarea
                  value={formData.emailBody}
                  onChange={(e) => setFormData({ ...formData, emailBody: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the content of the email..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Attachments</label>
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, attachments: e.target.files })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  multiple
                  accept="image/*"
                />
                <p className="text-xs text-gray-400">
                  You can upload multiple images (JPEG, PNG).
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-white hover:bg-gray-700 hover:text-white text-black py-2 px-4 rounded-xl transition-colors duration-200"
              >
                Send Email
              </button>
            </form>

            <div className="mt-4">
              <button
                onClick={generateCoupon}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-xl"
              >
                Generate Coupon
              </button>
              <p className="mt-2 text-white">Coupons Generated: {couponCount}</p>
            </div>
          </div>

          {/* Preview Section */}
          <div
            className={`bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-6 ${showPreview ? 'block' : 'hidden'} md:block`}
          >
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Email Preview</h2>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">To: <strong>{em}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-white text-sm">
                  <span>Subject: <strong>{formData.title || 'No subject'}</strong></span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">Body</label>
                <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
                  <p className="text-white text-sm whitespace-pre-wrap">
                    {formData.emailBody || 'No content'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Tag className="w-4 h-4" />
                    <span>Coupon: <strong>{coupons.length ? coupons[coupons.length - 1] : 'None'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Event Date: <strong>TBD</strong></span>
                  </div>
                  {/* QR Code Display */}
                  {coupons.length > 0 && (
                    <div className="mt-4 p-2 bg-white rounded-lg inline-block">
                      {generateQRCodeSVG(coupons[coupons.length - 1])}
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>Location: <strong>{c ? 'Yes' : 'No'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Ticket className="w-4 h-4" />
                    <span>Event Type: <strong>{c ? 'Yes' : 'No'}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}