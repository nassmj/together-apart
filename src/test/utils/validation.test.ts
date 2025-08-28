import { describe, it, expect } from 'vitest';
import { validateForm, sanitizeString, sanitizeHtml } from '../../lib/validation';
import { loginSchema, signupSchema, memorySchema } from '../../lib/validation';

describe('Validation Utils', () => {
  describe('validateForm', () => {
    it('validates login form successfully', () => {
      const validLoginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = validateForm(loginSchema, validLoginData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validLoginData);
      }
    });

    it('fails validation for invalid email', () => {
      const invalidLoginData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = validateForm(loginSchema, invalidLoginData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.email).toBe('Please enter a valid email address');
      }
    });

    it('fails validation for empty password', () => {
      const invalidLoginData = {
        email: 'test@example.com',
        password: '',
      };

      const result = validateForm(loginSchema, invalidLoginData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.password).toBe('Password is required');
      }
    });

    it('validates signup form successfully', () => {
      const validSignupData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const result = validateForm(signupSchema, validSignupData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validSignupData);
      }
    });

    it('fails signup validation for mismatched passwords', () => {
      const invalidSignupData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword',
      };

      const result = validateForm(signupSchema, invalidSignupData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.confirmPassword).toBe("Passwords don't match");
      }
    });

    it('fails signup validation for short password', () => {
      const invalidSignupData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: '123',
        confirmPassword: '123',
      };

      const result = validateForm(signupSchema, invalidSignupData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.password).toBe('Password must be at least 8 characters');
      }
    });

    it('validates memory form successfully', () => {
      const validMemoryData = {
        title: 'Amazing Memory',
        date: '2024-01-15',
        description: 'This was an amazing day',
      };

      const result = validateForm(memorySchema, validMemoryData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validMemoryData);
      }
    });

    it('fails memory validation for missing title', () => {
      const invalidMemoryData = {
        title: '',
        date: '2024-01-15',
        description: 'This was an amazing day',
      };

      const result = validateForm(memorySchema, invalidMemoryData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.title).toBe('Title is required');
      }
    });

    it('fails memory validation for invalid date format', () => {
      const invalidMemoryData = {
        title: 'Amazing Memory',
        date: '2024/01/15',
        description: 'This was an amazing day',
      };

      const result = validateForm(memorySchema, invalidMemoryData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.date).toBe('Invalid date format');
      }
    });

    it('fails memory validation for too long title', () => {
      const invalidMemoryData = {
        title: 'A'.repeat(101), // 101 characters
        date: '2024-01-15',
        description: 'This was an amazing day',
      };

      const result = validateForm(memorySchema, invalidMemoryData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.title).toBe('Title is too long');
      }
    });

    it('fails memory validation for too long description', () => {
      const invalidMemoryData = {
        title: 'Amazing Memory',
        date: '2024-01-15',
        description: 'A'.repeat(1001), // 1001 characters
      };

      const result = validateForm(memorySchema, invalidMemoryData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.description).toBe('Description is too long');
      }
    });
  });

  describe('sanitizeString', () => {
    it('trims whitespace', () => {
      expect(sanitizeString('  hello world  ')).toBe('hello world');
    });

    it('removes HTML tags', () => {
      expect(sanitizeString('<script>alert("xss")</script>hello')).toBe('scriptalert("xss")/scripthello');
    });

    it('normalizes multiple spaces', () => {
      expect(sanitizeString('hello    world')).toBe('hello world');
    });

    it('handles empty string', () => {
      expect(sanitizeString('')).toBe('');
    });

    it('handles string with only whitespace', () => {
      expect(sanitizeString('   \n\t   ')).toBe('');
    });

    it('preserves valid characters', () => {
      expect(sanitizeString('Hello, World! 123')).toBe('Hello, World! 123');
    });
  });

  describe('sanitizeHtml', () => {
    it('escapes HTML content', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
    });

    it('handles plain text', () => {
      expect(sanitizeHtml('Hello, World!')).toBe('Hello, World!');
    });

    it('handles empty string', () => {
      expect(sanitizeHtml('')).toBe('');
    });

    it('escapes special characters', () => {
      expect(sanitizeHtml('<>&"')).toBe('&lt;&gt;&amp;&quot;');
    });

    it('handles mixed content', () => {
      expect(sanitizeHtml('Hello <b>World</b>!')).toBe('Hello &lt;b&gt;World&lt;/b&gt;!');
    });
  });
});






