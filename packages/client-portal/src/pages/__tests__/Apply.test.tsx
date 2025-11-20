import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Apply from '../Apply';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    isAxiosError: vi.fn((error: any) => error && error.isAxiosError === true),
  },
}));

const mockedAxios = axios as any;

// Mock analytics
vi.mock('../../utils/analytics', () => ({
  trackFormStart: vi.fn(),
  trackFormSubmit: vi.fn(),
}));

// Helper to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Apply Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render the application form', () => {
      renderWithRouter(<Apply />);
      
      expect(screen.getByRole('heading', { name: /request access/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/betting experience level/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument();
    });

    it('should render SMS consent checkbox', () => {
      renderWithRouter(<Apply />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(screen.getByText(/I agree to receive automated text messages/i)).toBeInTheDocument();
    });

    it('should render back to home link', () => {
      renderWithRouter(<Apply />);
      
      const backLink = screen.getByRole('link', { name: /back to home/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute('href', '/');
    });

    it('should render links to terms and privacy policy', () => {
      renderWithRouter(<Apply />);
      
      const termsLinks = screen.getAllByRole('link', { name: /terms of use/i });
      const privacyLinks = screen.getAllByRole('link', { name: /privacy policy/i });
      
      expect(termsLinks.length).toBeGreaterThan(0);
      expect(privacyLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Form Validation - Full Name', () => {
    it('should show error when full name is empty on blur', async () => {
      renderWithRouter(<Apply />);
      
      const input = screen.getByLabelText(/full name/i);
      fireEvent.focus(input);
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when full name is too short', async () => {
      renderWithRouter(<Apply />);
      
      const input = screen.getByLabelText(/full name/i);
      fireEvent.change(input, { target: { value: 'A' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(screen.getByText(/full name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error when full name is too long', async () => {
      renderWithRouter(<Apply />);
      
      const input = screen.getByLabelText(/full name/i);
      const longName = 'A'.repeat(101);
      fireEvent.change(input, { target: { value: longName } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(screen.getByText(/full name must be less than 100 characters/i)).toBeInTheDocument();
      });
    });

    it('should clear error when user starts typing', async () => {
      renderWithRouter(<Apply />);
      
      const input = screen.getByLabelText(/full name/i);
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      });
      
      fireEvent.change(input, { target: { value: 'John' } });
      
      await waitFor(() => {
        expect(screen.queryByText(/full name is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation - Email', () => {
    it('should show error when email is empty on blur', async () => {
      renderWithRouter(<Apply />);
      
      const input = screen.getByLabelText(/email address/i);
      fireEvent.focus(input);
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      renderWithRouter(<Apply />);
      
      const input = screen.getByLabelText(/email address/i);
      fireEvent.change(input, { target: { value: 'invalid-email' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should accept valid email format', async () => {
      renderWithRouter(<Apply />);
      
      const input = screen.getByLabelText(/email address/i);
      fireEvent.change(input, { target: { value: 'test@example.com' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation - Phone', () => {
    it('should show error when phone is empty on blur', async () => {
      renderWithRouter(<Apply />);
      
      const input = screen.getByLabelText(/phone number/i);
      fireEvent.focus(input);
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid phone format', async () => {
      renderWithRouter(<Apply />);
      
      const input = screen.getByLabelText(/phone number/i);
      fireEvent.change(input, { target: { value: 'abc123' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
      });
    });

    it('should accept valid phone formats', async () => {
      renderWithRouter(<Apply />);
      
      const input = screen.getByLabelText(/phone number/i);
      
      // Test various valid formats
      const validPhones = ['+1234567890', '(555) 123-4567', '555-123-4567'];
      
      for (const phone of validPhones) {
        fireEvent.change(input, { target: { value: phone } });
        fireEvent.blur(input);
        
        await waitFor(() => {
          expect(screen.queryByText(/please enter a valid phone number/i)).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Form Validation - Betting Experience', () => {
    it('should show error when betting experience is not selected on blur', async () => {
      renderWithRouter(<Apply />);
      
      const select = screen.getByLabelText(/betting experience level/i);
      fireEvent.focus(select);
      fireEvent.blur(select);
      
      await waitFor(() => {
        expect(screen.getByText(/please select your betting experience level/i)).toBeInTheDocument();
      });
    });

    it('should accept valid betting experience selection', async () => {
      renderWithRouter(<Apply />);
      
      const select = screen.getByLabelText(/betting experience level/i);
      fireEvent.change(select, { target: { value: 'intermediate' } });
      fireEvent.blur(select);
      
      await waitFor(() => {
        expect(screen.queryByText(/please select your betting experience level/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission - Success', () => {
    it('should submit form with valid data', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true, message: 'Application received', applicationId: '123' },
      });

      renderWithRouter(<Apply />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });
      fireEvent.change(screen.getByLabelText(/betting experience level/i), { target: { value: 'intermediate' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
      
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/applications', {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          bettingExperience: 'intermediate',
          smsConsent: false,
        });
      });
    });

    it('should display success message after successful submission', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true, message: 'Application received', applicationId: '123' },
      });

      renderWithRouter(<Apply />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });
      fireEvent.change(screen.getByLabelText(/betting experience level/i), { target: { value: 'intermediate' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/application received!/i)).toBeInTheDocument();
        expect(screen.getByText(/we'll review your request and contact you within 24-48 hours/i)).toBeInTheDocument();
      });
    });

    it('should include SMS consent when checkbox is checked', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true, message: 'Application received', applicationId: '123' },
      });

      renderWithRouter(<Apply />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });
      fireEvent.change(screen.getByLabelText(/betting experience level/i), { target: { value: 'intermediate' } });
      fireEvent.click(screen.getByRole('checkbox'));
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
      
      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/applications', expect.objectContaining({
          smsConsent: true,
        }));
      });
    });
  });

  describe('Form Submission - Errors', () => {
    it('should not submit form with invalid data', async () => {
      renderWithRouter(<Apply />);
      
      // Try to submit empty form
      fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
      
      await waitFor(() => {
        expect(mockedAxios.post).not.toHaveBeenCalled();
        expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
        expect(screen.getByText(/please select your betting experience level/i)).toBeInTheDocument();
      });
    });

    it('should display error for duplicate email (409)', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 409,
          data: { success: false, error: 'Duplicate email' },
        },
      });

      renderWithRouter(<Apply />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });
      fireEvent.change(screen.getByLabelText(/betting experience level/i), { target: { value: 'intermediate' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/application with this email already exists/i)).toBeInTheDocument();
      });
    });

    it('should display error for rate limiting (429)', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 429,
          data: { success: false, error: 'Too many requests' },
        },
      });

      renderWithRouter(<Apply />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });
      fireEvent.change(screen.getByLabelText(/betting experience level/i), { target: { value: 'intermediate' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/too many applications/i)).toBeInTheDocument();
      });
    });

    it('should display error for validation errors (400)', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 400,
          data: { 
            success: false, 
            error: 'Validation error',
            details: ['Invalid email format', 'Phone number too short']
          },
        },
      });

      renderWithRouter(<Apply />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });
      fireEvent.change(screen.getByLabelText(/betting experience level/i), { target: { value: 'intermediate' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('should display error for server errors (500)', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 500,
          data: { success: false, error: 'Internal server error' },
        },
      });

      renderWithRouter(<Apply />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });
      fireEvent.change(screen.getByLabelText(/betting experience level/i), { target: { value: 'intermediate' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/server error/i);
      });
    });

    it('should display error for network errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

      renderWithRouter(<Apply />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });
      fireEvent.change(screen.getByLabelText(/betting experience level/i), { target: { value: 'intermediate' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/unable to connect\. please check your internet connection/i)).toBeInTheDocument();
      });
    });

    it('should preserve form data on error', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 500,
          data: { success: false, error: 'Server error' },
        },
      });

      renderWithRouter(<Apply />);
      
      // Fill out form
      const fullNameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
      
      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });
      fireEvent.change(screen.getByLabelText(/betting experience level/i), { target: { value: 'intermediate' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/server error/i);
      });
      
      // Check that form data is preserved
      expect(fullNameInput.value).toBe('John Doe');
      expect(emailInput.value).toBe('john@example.com');
    });
  });

  describe('Loading State', () => {
    it('should show loading state during submission', async () => {
      mockedAxios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      renderWithRouter(<Apply />);
      
      // Fill out form
      fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
      fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '+1234567890' } });
      fireEvent.change(screen.getByLabelText(/betting experience level/i), { target: { value: 'intermediate' } });
      
      // Submit form
      fireEvent.click(screen.getByRole('button', { name: /submit application/i }));
      
      // Check loading state
      expect(screen.getByText(/submitting\.\.\./i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submitting\.\.\./i })).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for required fields', () => {
      renderWithRouter(<Apply />);
      
      expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/email address/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/phone number/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/betting experience level/i)).toHaveAttribute('aria-required', 'true');
    });

    it('should link error messages with aria-describedby', async () => {
      renderWithRouter(<Apply />);
      
      const input = screen.getByLabelText(/full name/i);
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-describedby', 'fullName-error');
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should have skip to main content link', () => {
      renderWithRouter(<Apply />);
      
      const skipLink = screen.getByText(/skip to main content/i);
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });
  });
});
