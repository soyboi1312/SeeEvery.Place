/**
 * Suggestion form validation schema
 * Shared validation logic for client and server-side validation
 */
import { z } from 'zod';

export const suggestionSchema = z.object({
  title: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be 100 characters or less'),
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .default(''),
  examplePlaces: z
    .string()
    .max(300, 'Example places must be 300 characters or less')
    .optional()
    .default(''),
  dataSource: z
    .string()
    .max(200, 'Data source must be 200 characters or less')
    .optional()
    .default(''),
  email: z
    .string()
    .max(100, 'Email must be 100 characters or less')
    .refine(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'Please enter a valid email address',
    })
    .optional()
    .default(''),
});

// Form input type (before validation)
export type SuggestionFormInput = z.input<typeof suggestionSchema>;

// Validated output type (after validation)
export type SuggestionFormData = z.output<typeof suggestionSchema>;

// Transform form data to database format
export function toDbFormat(data: SuggestionFormData) {
  return {
    title: data.title,
    description: data.description || null,
    example_places: data.examplePlaces || null,
    data_source: data.dataSource || null,
    submitter_email: data.email || null,
  };
}
