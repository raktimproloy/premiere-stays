import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2 } from 'lucide-react'

export default function About() {
    const [title, setTitle] = useState('');
    const [aboutText, setAboutText] = useState('');
    const [items, setItems] = useState<string[]>([]);
    const [newItem, setNewItem] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Load data on component mount
    useEffect(() => {
        loadAboutSettings();
    }, []);

    const loadAboutSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/page-settings/about');
            const result = await response.json();
            
            if (result.success) {
                setTitle(result.data.title || '');
                setAboutText(result.data.aboutText || '');
                setItems(result.data.items || []);
            }
        } catch (error) {
            console.error('Error loading about settings:', error);
            setMessage('Error loading settings');
        } finally {
            setLoading(false);
        }
    };

    const saveAboutSettings = async () => {
        try {
            setSaving(true);
            setMessage('');
            
            const response = await fetch('/api/page-settings/about', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    aboutText,
                    items
                })
            });

            const result = await response.json();
            
            if (result.success) {
                setMessage('Settings saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setMessage(result.message || 'Error saving settings');
            }
        } catch (error) {
            console.error('Error saving about settings:', error);
            setMessage('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    const addItem = () => {
        if (newItem.trim()) {
            setItems([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addItem();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Loading settings...</span>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-800">About Page Content</h2>
                <button 
                    onClick={saveAboutSettings}
                    disabled={saving}
                    className="px-4 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-md ${
                    message.includes('successfully') 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                    {message}
                </div>
            )}
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        placeholder="Enter page title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        About Text
                    </label>
                    <textarea
                        rows={8}
                        placeholder="Enter your about page content here..."
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 resize-vertical"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Press Enter to add line breaks. These will be preserved in the backend.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        About Items
                    </label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            placeholder="Add new item..."
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                        />
                        <button
                            onClick={addItem}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                                <span className="text-gray-700">{item}</span>
                                <button
                                    onClick={() => removeItem(index)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
