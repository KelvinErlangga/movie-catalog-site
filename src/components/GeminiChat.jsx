import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovieRecommendation, naturalLanguageSearch, generateMovieReview } from '../services/gemini';
import { getFallbackSearch } from '../services/gemini-fallback';
import { parseNaturalQuery, getMovieByTitle } from '../services/smart-parser';
import { generateAIResponse } from '../services/ai-responses';
import { searchMovie } from '../services/api';
import { FaRobot, FaSearch, FaStar, FaLightbulb, FaFire, FaClock, FaTrophy, FaFilm, FaArrowLeft } from 'react-icons/fa';

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const navigate = useNavigate();

  const addMessage = (message, isUser = false) => {
    setMessages(prev => [...prev, { text: message, isUser, timestamp: new Date() }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    addMessage(userMessage, true);
    setIsLoading(true);

    console.log('🔍 Processing message:', userMessage);

    try {
      // Smart parsing untuk semua intents
      const parsedQuery = parseNaturalQuery(userMessage);
      console.log('🧠 Smart parsed query:', parsedQuery);
      
      // Generate AI response berdasarkan intent
      const aiResponse = await generateAIResponse(parsedQuery);
      addMessage(aiResponse);
      
    } catch (error) {
      console.error('💥 Error in handleSendMessage:', error);
      addMessage("Oops! Terjadi kesalahan. Coba lagi ya!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleQuickAction = (action) => {
    setInput(action);
    // Auto-send setelah delay singkat
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div className="gemini-chat-container bg-white rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBackToHome}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Kembali ke Beranda"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <FaRobot className="text-blue-500 text-2xl" />
          <h2 className="text-xl font-bold text-gray-800">CinemaVin AI Assistant</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 rounded ${activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-3 py-1 rounded ${activeTab === 'features' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Features
          </button>
        </div>
      </div>

      {activeTab === 'chat' && (
        <>
          {/* Messages */}
          <div className="h-96 overflow-y-auto mb-4 p-3 bg-gray-50 rounded-lg">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <FaRobot className="text-4xl mx-auto mb-2" />
                <p>Halo! Saya CinemaVin AI Assistant</p>
                <p className="text-sm">Tanya saya tentang film, rekomendasi, atau cari film favorit kamu!</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${message.isUser ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-xs ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  {message.isUser ? (
                    <p>{message.text}</p>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="text-left">
                <div className="inline-block bg-gray-800 text-white p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tanya tentang film atau minta rekomendasi..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <FaSearch />
            </button>
          </div>

          {/* Quick Action Bubbles */}
          <div className="mt-4">
            <p className="text-xs text-gray-600 mb-2">💡 **Quick Actions:**</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleQuickAction("film terpopuler 2025")}
                className="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs rounded-full hover:opacity-90 transition-opacity"
              >
                <FaFire className="inline mr-1" /> Film Terpopuler 2025
              </button>
              <button
                onClick={() => handleQuickAction("film trending saat ini")}
                className="px-3 py-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs rounded-full hover:opacity-90 transition-opacity"
              >
                <FaTrophy className="inline mr-1" /> Trending Saat Ini
              </button>
              <button
                onClick={() => handleQuickAction("film terbaru 2024")}
                className="px-3 py-1 bg-gradient-to-r from-green-400 to-blue-500 text-white text-xs rounded-full hover:opacity-90 transition-opacity"
              >
                <FaClock className="inline mr-1" /> Film Terbaru
              </button>
              <button
                onClick={() => handleQuickAction("rekomendasi film komedi")}
                className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full hover:opacity-90 transition-opacity"
              >
                <FaFilm className="inline mr-1" /> Rekomendasi Komedi
              </button>
              <button
                onClick={() => handleQuickAction("film dengan rating tertinggi")}
                className="px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white text-xs rounded-full hover:opacity-90 transition-opacity"
              >
                <FaStar className="inline mr-1" /> Rating Tertinggi
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'features' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center">
              <FaStar className="mr-2" /> AI Recommendation Engine
            </h3>
            <p className="text-sm text-gray-700">
              Dapatkan rekomendasi film yang dipersonalisasi berdasarkan preferensi dan mood kamu.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold text-green-800 mb-2 flex items-center">
              <FaSearch className="mr-2" /> Natural Language Search
            </h3>
            <p className="text-sm text-gray-700">
              Cari film dengan bahasa alami seperti "cari film action lucu tahun 2020".
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-bold text-purple-800 mb-2 flex items-center">
              <FaLightbulb className="mr-2" /> Smart Content Analysis
            </h3>
            <p className="text-sm text-gray-700">
              Generate review otomatis, analisis karakter, dan fakta menarik tentang film.
            </p>
          </div>

          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Contoh query:</strong><br/>
              • "Film terpopuler 2025"<br/>
              • "Sinopsis film agak laen 2"<br/>
              • "Film trending saat ini"<br/>
              • "Rekomendasi film action"<br/>
              • "Film dengan rating tertinggi"<br/>
              • "Film terbaru 2024"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiChat;
