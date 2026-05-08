/**
 * @file apiService.js
 * @description Central Axios instance for calling RapidAPI.
 *
 * SMART KEY ROTATION:
 * - Tracks which keys are exhausted (429) and skips them automatically.
 * - Once a key fails with 429, it's blacklisted for 1 hour before retrying.
 * - This prevents wasting precious API calls on dead keys.
 */

const axios = require('axios');

// Track exhausted keys: { keyHash: expiresAt timestamp }
const exhaustedKeys = new Map();
const EXHAUSTED_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour before retrying a dead key

/**
 * Creates an Axios instance pre-configured with RapidAPI headers.
 */
const createRailwayAPI = (host, key) => {
  return axios.create({
    baseURL: `https://${host}`,
    headers: {
      'X-RapidAPI-Host': host,
      'X-RapidAPI-Key': key,
    },
  });
};

/**
 * Check if a key is currently blacklisted (exhausted).
 */
const isKeyExhausted = (key) => {
  const keyId = key.substring(0, 8);
  const expiry = exhaustedKeys.get(keyId);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    exhaustedKeys.delete(keyId); // Cooldown expired, allow retry
    return false;
  }
  return true; // Still exhausted
};

/**
 * Mark a key as exhausted (429 received).
 */
const markKeyExhausted = (key) => {
  const keyId = key.substring(0, 8);
  exhaustedKeys.set(keyId, Date.now() + EXHAUSTED_COOLDOWN_MS);
  console.log(`🔒 Key ${keyId}... blacklisted for 1 hour (429 limit reached).`);
};

/**
 * Attempts an API call using a list of API keys in sequence.
 * SKIPS keys that are known to be exhausted to save API quota.
 */
const fetchWithKeyRotation = async (endpoint) => {
  const host = process.env.RAILWAY_API_HOST;
  const keysStr = process.env.RAILWAY_API_KEYS;

  if (!host || !keysStr) {
    throw new Error('RAILWAY_API_HOST or RAILWAY_API_KEYS missing in environment.');
  }

  const keys = keysStr.split(',').map((k) => k.trim()).filter(Boolean);
  
  // Filter out exhausted keys
  const activeKeys = keys.filter(k => !isKeyExhausted(k));
  
  if (activeKeys.length === 0) {
    console.log('⏸️ All API keys are cooling down. Using local database.');
    throw new Error('All API keys exhausted — cooldown active. Status: 429');
  }

  console.log(`🔑 ${activeKeys.length}/${keys.length} keys available for: ${endpoint.split('?')[0]}`);

  let lastError;

  for (let i = 0; i < activeKeys.length; i++) {
    const key = activeKeys[i];
    try {
      const railwayAPI = createRailwayAPI(host, key);
      const response = await railwayAPI.get(endpoint);
      
      // Success! Return the data
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      
      if (status === 429) {
        // Rate limited — blacklist this key
        markKeyExhausted(key);
      } else {
        console.warn(`⚠️ Key ${key.substring(0, 5)}... failed (${status || error.message})`);
      }
      
      lastError = error;
    }
  }

  console.log('❌ All active API keys failed.');
  throw lastError;
};

module.exports = { createRailwayAPI, fetchWithKeyRotation };
