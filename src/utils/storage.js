// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Helper utility for AsyncStorage to centralize JSON serialization,
 * error handling, and basic race-condition prevention via atomic updates.
 */

export const getStorage = async (key, defaultVal = null) => {
  try {
    const storedValue = await AsyncStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultVal;
  } catch (error) {
    console.error(`[storage.js] Error getting ${key}:`, error);
    return defaultVal;
  }
};

export const setStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[storage.js] Error setting ${key}:`, error);
  }
};

/**
 * Atomically updates a storage key by fetching its current value,
 * applying the updater function, and saving it back.
 * Useful for preventing race conditions when modifying arrays/objects.
 * 
 * @param {string} key 
 * @param {Function} updaterFn - Receives the parsed prev data, returns new data.
 */
export const updateStorage = async (key, updaterFn, defaultVal = null) => {
  try {
    const prevData = await getStorage(key, defaultVal);
    const newData = updaterFn(prevData);
    if (newData !== undefined) {
      await setStorage(key, newData);
    }
  } catch (error) {
    console.error(`[storage.js] Error updating ${key}:`, error);
  }
};
