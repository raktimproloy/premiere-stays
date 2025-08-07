import fs from 'fs';
import path from 'path';

interface CachedProperties {
  properties: any[];
  timestamp: number;
  expiresAt: number;
}

const CACHE_FILE_PATH = path.join(process.cwd(), 'public', 'images', 'data', 'propertiesCache.json');
const CACHE_EXPIRY_MINUTES = 5;

// In-memory cache for production
let memoryCache: CachedProperties | null = null;

// Check if we're in production (Vercel)
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';

// Function to safely read file cache
const safelyReadFileCache = (): CachedProperties | null => {
  try {
    if (!fs.existsSync(CACHE_FILE_PATH)) {
      return null;
    }

    const cacheData = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
    const cached: CachedProperties = JSON.parse(cacheData);
    
    const now = Date.now();
    if (now > cached.expiresAt) {
      // Cache expired, remove the file
      try {
        fs.unlinkSync(CACHE_FILE_PATH);
      } catch (error) {
        console.error('Error removing expired cache file:', error);
      }
      return null;
    }

    return cached;
  } catch (error) {
    console.error('Error reading file cache:', error);
    return null;
  }
};

// Function to safely write file cache
const safelyWriteFileCache = (cacheData: CachedProperties): boolean => {
  try {
    // Ensure the directory exists
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing file cache:', error);
    return false;
  }
};

export const getCachedProperties = (): any[] | null => {
  try {
    if (isProduction) {
      // Use in-memory cache for production
      if (!memoryCache) {
        return null;
      }
      
      const now = Date.now();
      if (now > memoryCache.expiresAt) {
        // Cache expired, clear it
        memoryCache = null;
        return null;
      }

      return memoryCache.properties;
    } else {
      // Use file-based cache for development
      const cached = safelyReadFileCache();
      return cached ? cached.properties : null;
    }
  } catch (error) {
    console.error('Error reading cached properties:', error);
    return null;
  }
};

export const setCachedProperties = (properties: any[]): boolean => {
  try {
    const now = Date.now();
    const expiresAt = now + (CACHE_EXPIRY_MINUTES * 60 * 1000);
    
    const cacheData: CachedProperties = {
      properties,
      timestamp: now,
      expiresAt
    };

    if (isProduction) {
      // Use in-memory cache for production
      memoryCache = cacheData;
      console.log(`Properties cached in memory. Expires at: ${new Date(expiresAt).toISOString()}`);
      return true;
    } else {
      // Use file-based cache for development
      const success = safelyWriteFileCache(cacheData);
      if (success) {
        console.log(`Properties cached to file. Expires at: ${new Date(expiresAt).toISOString()}`);
      }
      return success;
    }
  } catch (error) {
    console.error('Error caching properties:', error);
    return false;
  }
};

export const getPropertiesByIds = (propertyIds: number[]): any[] => {
  const cachedProperties = getCachedProperties();
  if (!cachedProperties) {
    return [];
  }

  return cachedProperties.filter(property => 
    propertyIds.includes(property.id)
  );
};

export const isCacheValid = (): boolean => {
  return getCachedProperties() !== null;
};

// Function to clear cache (useful for testing or manual cache invalidation)
export const clearCache = (): void => {
  if (isProduction) {
    memoryCache = null;
    console.log('Memory cache cleared');
  } else {
    try {
      if (fs.existsSync(CACHE_FILE_PATH)) {
        fs.unlinkSync(CACHE_FILE_PATH);
        console.log('File cache cleared');
      }
    } catch (error) {
      console.error('Error clearing file cache:', error);
    }
  }
};

// Function to get cache info for debugging
export const getCacheInfo = () => {
  const cachedProperties = getCachedProperties();
  const isValid = isCacheValid();
  
  return {
    isProduction,
    hasCache: cachedProperties !== null,
    propertiesCount: cachedProperties?.length || 0,
    isValid,
    environment: process.env.NODE_ENV,
    isVercel: process.env.VERCEL === '1'
  };
}; 