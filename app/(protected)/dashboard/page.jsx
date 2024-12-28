'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const CampaignsPage = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        audience: '',
    });

    // Fetch campaigns from backend
    useEffect(() => {
        axios.get('http://localhost:8000/api/campaigns')
            .then(response => setCampaigns(response.data))
            .catch(error => console.error('Error fetching campaigns:', error));
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/campaigns', formData);
            setCampaigns([...campaigns, response.data]);
            setFormData({ name: '', description: '', audience: '' });
        } catch (error) {
            console.error('Error creating campaign:', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Campaigns</h1>

            <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4">
                    <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-2 font-medium">Description</label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="border p-2 w-full"
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="audience" className="block mb-2 font-medium">Audience</label>
                    <input
                        type="text"
                        id="audience"
                        value={formData.audience}
                        onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2">Create Campaign</button>
            </form>

            <h2 className="text-xl font-bold mb-4">Existing Campaigns</h2>
            <ul>
                {/* {campaigns.map(campaign => (
                    <li key={campaign.id} className="mb-2">
                        <strong>{campaign.name}</strong>: {campaign.description} (Audience: {campaign.audience})
                    </li>
                ))} */}
            </ul>
        </div>
    );
};

export default CampaignsPage;
