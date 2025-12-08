/**
 * Tests for suggestion validation schema
 */
import { describe, it, expect } from 'vitest';
import { suggestionSchema, toDbFormat } from './suggestion';

describe('suggestionSchema', () => {
  describe('title validation', () => {
    it('should require a title', () => {
      const result = suggestionSchema.safeParse({
        title: '',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Category name is required');
      }
    });

    it('should accept a valid title', () => {
      const result = suggestionSchema.safeParse({
        title: 'Lighthouses',
      });

      expect(result.success).toBe(true);
    });

    it('should reject title over 100 characters', () => {
      const result = suggestionSchema.safeParse({
        title: 'a'.repeat(101),
      });

      expect(result.success).toBe(false);
    });
  });

  describe('description validation', () => {
    it('should accept empty description', () => {
      const result = suggestionSchema.safeParse({
        title: 'Test',
        description: '',
      });

      expect(result.success).toBe(true);
    });

    it('should accept valid description', () => {
      const result = suggestionSchema.safeParse({
        title: 'Test',
        description: 'This is a great category for travel enthusiasts',
      });

      expect(result.success).toBe(true);
    });

    it('should reject description over 500 characters', () => {
      const result = suggestionSchema.safeParse({
        title: 'Test',
        description: 'a'.repeat(501),
      });

      expect(result.success).toBe(false);
    });
  });

  describe('email validation', () => {
    it('should accept empty email', () => {
      const result = suggestionSchema.safeParse({
        title: 'Test',
        email: '',
      });

      expect(result.success).toBe(true);
    });

    it('should accept valid email', () => {
      const result = suggestionSchema.safeParse({
        title: 'Test',
        email: 'test@example.com',
      });

      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = suggestionSchema.safeParse({
        title: 'Test',
        email: 'not-an-email',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('full form validation', () => {
    it('should validate a complete valid form', () => {
      const result = suggestionSchema.safeParse({
        title: 'Lighthouses',
        description: 'Historic lighthouses around the world',
        examplePlaces: 'Cape Hatteras, Portland Head',
        dataSource: 'Wikipedia',
        email: 'test@example.com',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Lighthouses');
        expect(result.data.description).toBe('Historic lighthouses around the world');
      }
    });

    it('should apply default values for optional fields', () => {
      const result = suggestionSchema.safeParse({
        title: 'Test Category',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe('');
        expect(result.data.examplePlaces).toBe('');
        expect(result.data.dataSource).toBe('');
        expect(result.data.email).toBe('');
      }
    });
  });
});

describe('toDbFormat', () => {
  it('should convert form data to database format', () => {
    const formData = {
      title: 'Lighthouses',
      description: 'Historic lighthouses',
      examplePlaces: 'Cape Hatteras',
      dataSource: 'Wikipedia',
      email: 'test@example.com',
    };

    const dbData = toDbFormat(formData);

    expect(dbData).toEqual({
      title: 'Lighthouses',
      description: 'Historic lighthouses',
      example_places: 'Cape Hatteras',
      data_source: 'Wikipedia',
      submitter_email: 'test@example.com',
    });
  });

  it('should convert empty strings to null', () => {
    const formData = {
      title: 'Test',
      description: '',
      examplePlaces: '',
      dataSource: '',
      email: '',
    };

    const dbData = toDbFormat(formData);

    expect(dbData.description).toBeNull();
    expect(dbData.example_places).toBeNull();
    expect(dbData.data_source).toBeNull();
    expect(dbData.submitter_email).toBeNull();
  });
});
