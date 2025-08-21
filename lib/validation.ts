import { z } from 'zod';

// Base schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long');

// User registration and login
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Memory validation
export const memorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  description: z.string().max(1000, 'Description is too long').optional(),
  image_url: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

// Activity validation
export const activitySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(500, 'Description is too long').optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional().or(z.literal('')),
  location: z.string().max(200, 'Location is too long').optional(),
  image_url: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

// Quest validation
export const questSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(500, 'Description is too long').optional(),
  type: z.enum(['challenge', 'routine']),
  status: z.enum(['in-progress', 'available', 'completed']),
  frequency: z.enum(['daily', 'weekly']).optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
  weekly_goal: z.number().min(1).max(7).optional(),
  restrictions: z.string().max(200, 'Restrictions are too long').optional(),
}).refine((data) => {
  if (data.type === 'challenge' && data.start_date && data.end_date) {
    return new Date(data.start_date) <= new Date(data.end_date);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['end_date'],
});

// Discovery validation
export const discoverySchema = z.object({
  category: z.enum(['Music', 'Movie', 'Book', 'Place', 'Link']),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long').optional(),
  name: z.string().min(1, 'Name is required').max(200, 'Name is too long').optional(),
  artist: z.string().max(200, 'Artist name is too long').optional(),
  director: z.string().max(200, 'Director name is too long').optional(),
  author: z.string().max(200, 'Author name is too long').optional(),
  address: z.string().max(500, 'Address is too long').optional(),
  year: z.number().min(1900).max(new Date().getFullYear() + 10).optional(),
  url: z.string().url('Invalid URL').optional(),
  note: z.string().min(1, 'Note is required').max(500, 'Note is too long'),
  image_url: z.string().url('Invalid image URL').optional().or(z.literal('')),
}).refine((data) => {
  // Ensure required fields based on category
  switch (data.category) {
    case 'Music':
      return data.title && data.artist;
    case 'Movie':
      return data.title && data.director;
    case 'Book':
      return data.title && data.author;
    case 'Place':
      return data.name && data.address;
    case 'Link':
      return data.title && data.url;
    default:
      return true;
  }
}, {
  message: 'Please fill in all required fields for this category',
});

// Daily connection validation
export const dailyConnectionSchema = z.object({
  question: z.string().min(1, 'Question is required').max(200, 'Question is too long'),
  answers: z.record(z.string().min(1, 'Answer cannot be empty')).optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB default
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
}).refine((data) => {
  return data.file.size <= data.maxSize;
}, {
  message: 'File size exceeds maximum allowed size',
  path: ['file'],
}).refine((data) => {
  return data.allowedTypes.includes(data.file.type);
}, {
  message: 'File type not allowed',
  path: ['file'],
});

// Validation helper functions
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { form: 'Validation failed' } };
  }
};

// Sanitize input strings
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' '); // Normalize whitespace
};

// Sanitize HTML content
export const sanitizeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// Type exports for use in components
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type MemoryFormData = z.infer<typeof memorySchema>;
export type ActivityFormData = z.infer<typeof activitySchema>;
export type QuestFormData = z.infer<typeof questSchema>;
export type DiscoveryFormData = z.infer<typeof discoverySchema>;
export type DailyConnectionFormData = z.infer<typeof dailyConnectionSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;

