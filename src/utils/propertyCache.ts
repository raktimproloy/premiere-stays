import fs from 'fs';
import path from 'path';

interface CachedProperties {
  properties: any[];
  timestamp: number;
  expiresAt: number;
}

const CACHE_FILE_PATH = path.join(process.cwd(), 'public', 'images', 'data', 'propertiesCache.json');
const CACHE_EXPIRY_MINUTES = 5;

export const getCachedProperties = (): any[] | null => {
  try {
    if (!fs.existsSync(CACHE_FILE_PATH)) {
      return null;
    }

    const cacheData = fs.readFileSync(CACHE_FILE_PATH, 'utf8');
    const cached: CachedProperties = JSON.parse(cacheData);
    
    const now = Date.now();
    if (now > cached.expiresAt) {
      // Cache expired, remove the file
      fs.unlinkSync(CACHE_FILE_PATH);
      return null;
    }

    return cached.properties;
  } catch (error) {
    console.error('Error reading cached properties:', error);
    return null;
  }
};

export const setCachedProperties = (properties: any[]): void => {
  try {
    // Ensure the directory exists
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const now = Date.now();
    const expiresAt = now + (CACHE_EXPIRY_MINUTES * 60 * 1000);
    
    const cacheData: CachedProperties = {
      properties,
      timestamp: now,
      expiresAt
    };

    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2));
    console.log(`Properties cached successfully. Expires at: ${new Date(expiresAt).toISOString()}`);
  } catch (error) {
    console.error('Error caching properties:', error);
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