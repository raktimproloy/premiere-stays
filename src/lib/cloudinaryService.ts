import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface CloudinaryDeleteResult {
  success: boolean;
  deletedCount: number;
  error?: string;
}

export const cloudinaryService = {
  // Add configuration check method
  checkConfiguration() {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(`Cloudinary configuration missing: cloudName=${!!cloudName}, apiKey=${!!apiKey}, apiSecret=${!!apiSecret}`);
    }
    
    return { cloudName, apiKey, apiSecret };
  },

  async uploadImage(
    file: File | Buffer | string,
    folder: string = 'properties',
    options: {
      transformation?: string | boolean;
      quality?: number;
      format?: string;
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      // Check configuration first
      this.checkConfiguration();
      
      let result: any;

      if (typeof file === 'string') {
        // If file is a URL or base64 string
        try {
          result = await cloudinary.uploader.upload(file, {
            folder,
            transformation: options.transformation ? [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }] : undefined,
            quality: options.quality || 'auto',
            // Don't specify format if it's 'auto' - let Cloudinary auto-detect
            ...(options.format && options.format !== 'auto' && { format: options.format }),
          });
        } catch (uploadError) {
          console.error('String upload failed:', uploadError);
          throw uploadError;
        }
      } else if (file instanceof Buffer) {
        // If file is a Buffer - convert to base64 and upload
        const base64String = file.toString('base64');
        const dataURI = `data:image/jpeg;base64,${base64String}`;
        
        try {
          result = await cloudinary.uploader.upload(dataURI, {
            folder,
            transformation: options.transformation ? [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }] : undefined,
            quality: options.quality || 'auto',
            // Don't specify format if it's 'auto' - let Cloudinary auto-detect
            ...(options.format && options.format !== 'auto' && { format: options.format }),
          });
        } catch (uploadError) {
          console.error('Buffer upload failed:', uploadError);
          throw uploadError;
        }
      } else if (file instanceof File || (file && typeof file === 'object' && 'arrayBuffer' in file)) {
        // If file is a File object (browser or Node.js) - convert to base64 and upload
        try {
          const fileWithArrayBuffer = file as { arrayBuffer(): Promise<ArrayBuffer>; type?: string };
          const arrayBuffer = await fileWithArrayBuffer.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64String = buffer.toString('base64');
          
          // Handle MIME type properly - ensure it's a valid image type
          let mimeType = fileWithArrayBuffer.type || 'image/jpeg';
          if (!mimeType || !mimeType.startsWith('image/')) {
            mimeType = 'image/jpeg'; // Default fallback
          }
          const dataURI = `data:${mimeType};base64,${base64String}`;
          
          result = await cloudinary.uploader.upload(dataURI, {
            folder,
            transformation: options.transformation ? [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }] : undefined,
            quality: options.quality || 'auto',
            // Don't specify format if it's 'auto' - let Cloudinary auto-detect
            ...(options.format && options.format !== 'auto' && { format: options.format }),
          });
        } catch (uploadError) {
          console.error('File upload failed:', uploadError);
          throw uploadError;
        }
      } else {
        throw new Error(`Unsupported file type: ${typeof file}`);
      }
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', {
        error,
        errorType: typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        errorKeys: error && typeof error === 'object' ? Object.keys(error) : [],
        errorStringified: JSON.stringify(error, null, 2)
      });
      
      // Throw the actual error instead of a generic message
      if (error instanceof Error) {
        throw error;
      } else if (error && typeof error === 'object') {
        // If it's an object, try to extract useful information
        const errorMessage = (error as any).message || (error as any).error || JSON.stringify(error);
        throw new Error(`Cloudinary upload failed: ${errorMessage}`);
      } else {
        throw new Error(`Cloudinary upload failed: ${String(error)}`);
      }
    }
  },

  async uploadMultipleImages(
    files: (File | Buffer | string)[],
    folder: string = 'properties',
    options: {
      transformation?: string | boolean;
      quality?: number;
      format?: string;
    } = {}
  ): Promise<CloudinaryUploadResult[]> {
    try {
      const uploadPromises = files.map(file => 
        this.uploadImage(file, folder, options)
      );
      
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Cloudinary multiple upload error:', error);
      throw new Error('Failed to upload multiple images to Cloudinary');
    }
  },

  async deleteImage(publicId: string): Promise<CloudinaryDeleteResult> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      
      if (result.result === 'ok') {
        return {
          success: true,
          deletedCount: 1,
        };
      } else {
        return {
          success: false,
          deletedCount: 0,
          error: 'Failed to delete image',
        };
      }
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return {
        success: false,
        deletedCount: 0,
        error: 'Failed to delete image from Cloudinary',
      };
    }
  },

  async deleteMultipleImages(publicIds: string[]): Promise<CloudinaryDeleteResult> {
    try {
      const deletePromises = publicIds.map(publicId => 
        this.deleteImage(publicId)
      );
      
      const results = await Promise.all(deletePromises);
      
      const totalDeleted = results.reduce((sum, result) => 
        sum + result.deletedCount, 0
      );
      
      const hasErrors = results.some(result => !result.success);
      
      return {
        success: !hasErrors,
        deletedCount: totalDeleted,
        error: hasErrors ? 'Some images failed to delete' : undefined,
      };
    } catch (error) {
      console.error('Cloudinary multiple delete error:', error);
      return {
        success: false,
        deletedCount: 0,
        error: 'Failed to delete multiple images from Cloudinary',
      };
    }
  },

  async generateImageUrl(
    publicId: string,
    options: {
      transformation?: string | boolean;
      quality?: number;
      format?: string;
      width?: number;
      height?: number;
    } = {}
  ): Promise<string> {
    try {
      const url = cloudinary.url(publicId, {
        transformation: options.transformation ? [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }] : undefined,
        quality: options.quality,
        format: options.format,
        width: options.width,
        height: options.height,
        secure: true,
      });
      
      return url;
    } catch (error) {
      console.error('Cloudinary URL generation error:', error);
      throw new Error('Failed to generate Cloudinary URL');
    }
  },

  async getImageInfo(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary get image info error:', error);
      throw new Error('Failed to get image information from Cloudinary');
    }
  },
};
