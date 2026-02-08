// Debug file untuk testing Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai';

// Test API key dan koneksi
const testGeminiAPI = async () => {
  console.log('🔍 Testing Gemini API...');
  console.log('API Key:', process.env.REACT_APP_GEMINI_API_KEY ? '✅ Found' : '❌ Not found');
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    console.log('✅ Gemini client initialized');
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log('✅ Model loaded');
    
    const result = await model.generateContent("Hello, can you respond with just 'API working'?");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API Response:', text);
    return { success: true, data: text };
  } catch (error) {
    console.error('❌ API Error:', error);
    return { success: false, error: error.message };
  }
};

// Test dengan prompt yang lebih sederhana
const testSimplePrompt = async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = "Berikan 3 judul film populer dalam format JSON array: [\"judul1\", \"judul2\", \"judul3\"]";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Simple prompt response:', text);
    
    try {
      const parsed = JSON.parse(text);
      console.log('✅ Parsed JSON:', parsed);
      return { success: true, data: parsed };
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.log('Raw response:', text);
      return { success: false, error: 'JSON Parse failed' };
    }
  } catch (error) {
    console.error('❌ Simple Prompt Error:', error);
    return { success: false, error: error.message };
  }
};

export { testGeminiAPI, testSimplePrompt };
