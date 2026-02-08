// Test script for fallback recommendations
const { getFallbackRecommendations } = require('./src/services/gemini-fallback.js');

console.log('Testing fallback for different moods:');
console.log('Action 1:', getFallbackRecommendations('action'));
console.log('Bahagia:', getFallbackRecommendations('bahagia'));
console.log('Sedih:', getFallbackRecommendations('sedih'));
console.log('Action 2:', getFallbackRecommendations('action'));
console.log('Action 3:', getFallbackRecommendations('action'));
console.log('Romantis:', getFallbackRecommendations('romantis'));
console.log('Seru:', getFallbackRecommendations('seru'));
console.log('Tenang:', getFallbackRecommendations('tenang'));
console.log('Umum:', getFallbackRecommendations('umum'));
