import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTranslation } from '../i18n/translations';

const UserContext = createContext();

// Default initial seeded account for demo phone '9876543210'
const DEFAULT_SEEDED_USERS_DB = {
  '9876543210': {
    name: 'Priya Sharma',
    phone: '9876543210',
    email: 'priya.sharma@example.com',
    address: 'Flat 302, Palm Heights, Block B, Lajpat Nagar, New Delhi - 110024',
    locality: 'Lajpat Nagar',
    city: 'New Delhi',
    district: 'South Delhi',
    state: 'Delhi (NCR)',
    pincode: '110024',
    landmark: 'Near Metro Gate No. 2',
    house: 'Flat 302, Palm Heights',
    addressTag: 'Home',
    cooperativeTier: 'Silver Member',
    isRegistered: true,
    createdAt: new Date().toISOString()
  }
};

const DEFAULT_LANGUAGE = {
  code: 'en',
  name: 'English',
  nativeName: 'English'
};

export const UserProvider = ({ children }) => {
  const [usersDb, setUsersDb] = useState(DEFAULT_SEEDED_USERS_DB);
  const [user, setUser] = useState(DEFAULT_SEEDED_USERS_DB['9876543210']);
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Translation helper reactive to active language code
  const t = (key, fallback) => {
    const val = getTranslation(language?.code || 'en', key, fallback);
    return (val !== undefined && val !== null && val !== '') ? val : (fallback !== undefined ? fallback : '');
  };

  // Load saved user state & database on launch
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        // 1. Load language preference
        const storedLang = await AsyncStorage.getItem('@uniserv_language');
        if (storedLang) {
          setLanguageState(JSON.parse(storedLang));
        }

        // 2. Load user registry database (indexed by phone)
        const storedDb = await AsyncStorage.getItem('@uniserv_users_db');
        let currentDb = DEFAULT_SEEDED_USERS_DB;
        if (storedDb) {
          try {
            currentDb = { ...DEFAULT_SEEDED_USERS_DB, ...JSON.parse(storedDb) };
          } catch (e) {}
        }
        setUsersDb(currentDb);

        // 3. Load active session & logged-in state
        const storedAuth = await AsyncStorage.getItem('@uniserv_is_logged_in');
        const activePhone = await AsyncStorage.getItem('@uniserv_active_phone');

        if (storedAuth === 'true' && activePhone) {
          const activeUser = currentDb[activePhone] || (await AsyncStorage.getItem('@uniserv_user') ? JSON.parse(await AsyncStorage.getItem('@uniserv_user')) : null);
          if (activeUser) {
            setUser(activeUser);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } else if (storedAuth === 'true') {
          const storedUser = await AsyncStorage.getItem('@uniserv_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (e) {
        console.error('Error loading stored user preferences:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoredData();
  }, []);

  const setLanguage = async (newLanguage) => {
    setLanguageState(newLanguage);
    try {
      await AsyncStorage.setItem('@uniserv_language', JSON.stringify(newLanguage));
    } catch (e) {
      console.error('Error saving language:', e);
    }
  };

  // Check if a mobile number is already registered in the system
  const checkUserExists = (phone) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    return Boolean(usersDb[cleanPhone] && usersDb[cleanPhone].isRegistered);
  };

  // Get existing user profile for a mobile number
  const getUserByPhone = (phone) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    return usersDb[cleanPhone] || null;
  };

  // Login via mobile number (loads existing profile if found)
  const login = async (phone) => {
    const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
    let targetUser = usersDb[cleanPhone];

    if (!targetUser) {
      // Create new profile record for this phone
      targetUser = {
        phone: cleanPhone,
        name: '',
        email: '',
        address: '',
        locality: '',
        city: '',
        district: '',
        state: '',
        pincode: '',
        landmark: '',
        house: '',
        addressTag: 'Home',
        cooperativeTier: 'Silver Member',
        isRegistered: false,
        createdAt: new Date().toISOString()
      };
    }

    setUser(targetUser);
    setIsLoggedIn(true);

    try {
      await AsyncStorage.setItem('@uniserv_active_phone', cleanPhone);
      await AsyncStorage.setItem('@uniserv_user', JSON.stringify(targetUser));
      await AsyncStorage.setItem('@uniserv_is_logged_in', 'true');
    } catch (e) {
      console.error('Error persisting login session:', e);
    }

    return targetUser;
  };

  // Complete Registration for a phone number
  const registerUser = async (profileData) => {
    const cleanPhone = (profileData.phone || user?.phone || '9876543210').replace(/[^0-9]/g, '');
    const updatedUser = {
      ...(usersDb[cleanPhone] || user || {}),
      ...profileData,
      phone: cleanPhone,
      isRegistered: true,
      updatedAt: new Date().toISOString()
    };

    const newDb = {
      ...usersDb,
      [cleanPhone]: updatedUser
    };

    setUsersDb(newDb);
    setUser(updatedUser);
    setIsLoggedIn(true);

    try {
      await AsyncStorage.setItem('@uniserv_users_db', JSON.stringify(newDb));
      await AsyncStorage.setItem('@uniserv_active_phone', cleanPhone);
      await AsyncStorage.setItem('@uniserv_user', JSON.stringify(updatedUser));
      await AsyncStorage.setItem('@uniserv_is_logged_in', 'true');
    } catch (e) {
      console.error('Error persisting registered user:', e);
    }
    return updatedUser;
  };

  // Explicit User Sign-Out
  const logout = async () => {
    setIsLoggedIn(false);
    setUser({
      phone: '',
      name: '',
      email: '',
      address: '',
      isRegistered: false
    });
    try {
      await AsyncStorage.removeItem('@uniserv_is_logged_in');
      await AsyncStorage.removeItem('@uniserv_active_phone');
    } catch (e) {
      console.error('Error clearing session:', e);
    }
  };

  // Update profile for current active user
  const updateUserProfile = async (updates) => {
    const cleanPhone = (user?.phone || '9876543210').replace(/[^0-9]/g, '');
    const updated = { ...user, ...updates };
    const newDb = {
      ...usersDb,
      [cleanPhone]: updated
    };

    setUsersDb(newDb);
    setUser(updated);

    try {
      await AsyncStorage.setItem('@uniserv_users_db', JSON.stringify(newDb));
      await AsyncStorage.setItem('@uniserv_user', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving profile updates:', e);
    }
  };

  // Register another citizen (E-Sevai / Neighbour Assisted Portal) WITHOUT disturbing active session
  const registerAnotherUser = async (citizenData) => {
    const cleanPhone = (citizenData.phone || '').replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return { success: false, error: 'Valid 10-digit mobile number required' };
    }

    const newCitizen = {
      phone: cleanPhone,
      name: citizenData.name || 'Citizen',
      email: citizenData.email || `${cleanPhone}@esevai.uniserv.gov.in`,
      language: citizenData.language || 'ta',
      languageName: citizenData.languageName || 'Tamil',
      address: citizenData.address || '',
      locality: citizenData.locality || '',
      city: citizenData.city || '',
      district: citizenData.district || citizenData.city || '',
      state: citizenData.state || 'Tamil Nadu',
      pincode: citizenData.pincode || '',
      landmark: citizenData.landmark || '',
      house: citizenData.house || '',
      addressTag: 'Home',
      cooperativeTier: 'Standard Member',
      registeredByHelper: user?.phone || 'E-Sevai Maiyam',
      registrationSource: 'E-Sevai / Neighbour Assisted Portal',
      isRegistered: true,
      createdAt: new Date().toISOString()
    };

    const newDb = {
      ...usersDb,
      [cleanPhone]: newCitizen
    };

    setUsersDb(newDb);

    try {
      await AsyncStorage.setItem('@uniserv_users_db', JSON.stringify(newDb));
    } catch (e) {
      console.error('Error saving assisted citizen registration:', e);
    }

    return { success: true, citizen: newCitizen };
  };

  // Device & Privacy Permissions (Location, Camera, Microphone, Media Access)
  const [permissions, setPermissions] = useState({
    location: false,
    camera: false,
    microphone: false,
    media: false,
    hasRequestedFirstTime: false
  });

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const storedPerms = await AsyncStorage.getItem('@uniserv_permissions');
        if (storedPerms) {
          setPermissions(JSON.parse(storedPerms));
        }
      } catch (e) {
        console.warn('Error loading permissions:', e);
      }
    };
    loadPermissions();
  }, []);

  const grantAllPermissions = async () => {
    const updated = {
      location: true,
      camera: true,
      microphone: true,
      media: true,
      hasRequestedFirstTime: true
    };
    setPermissions(updated);
    try {
      await AsyncStorage.setItem('@uniserv_permissions', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving permissions:', e);
    }
    return updated;
  };

  const updatePermission = async (key, val) => {
    const updated = {
      ...permissions,
      [key]: val,
      hasRequestedFirstTime: true
    };
    setPermissions(updated);
    try {
      await AsyncStorage.setItem('@uniserv_permissions', JSON.stringify(updated));
    } catch (e) {
      console.error('Error updating permission:', e);
    }
    return updated;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        usersDb,
        language,
        setLanguage,
        isLoggedIn,
        login,
        registerUser,
        registerAnotherUser,
        checkUserExists,
        getUserByPhone,
        logout,
        updateUserProfile,
        permissions,
        grantAllPermissions,
        updatePermission,
        isLoading,
        t
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserContext;
