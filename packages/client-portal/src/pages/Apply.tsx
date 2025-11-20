import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import type { CreateApplicationRequest, CreateApplicationResponse } from '@sportsbook/shared-types';
import Footer from '../components/Footer';
import { trackFormStart, trackFormSubmit } from '../utils/analytics';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  bettingExperience: '' | 'beginner' | 'intermediate' | 'advanced' | 'professional';
  smsConsent: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  bettingExperience?: string;
}

export default function Apply() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    bettingExperience: '',
    smsConsent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const formStartTracked = useRef(false);

  const validateField = (name: keyof FormData, value: string | boolean): string | undefined => {
    switch (name) {
      case 'fullName':
        if (typeof value === 'string') {
          if (!value.trim()) return 'Full name is required';
          if (value.trim().length < 2) return 'Full name must be at least 2 characters';
          if (value.trim().length > 100) return 'Full name must be less than 100 characters';
        }
        break;
      case 'email':
        if (typeof value === 'string') {
          if (!value.trim()) return 'Email is required';
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (typeof value === 'string') {
          if (!value.trim()) return 'Phone number is required';
          const phoneRegex = /^[\d\s\-\+\(\)]+$/;
          if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        }
        break;
      case 'bettingExperience':
        if (typeof value === 'string' && !value) return 'Please select your betting experience level';
        break;
    }
    return undefined;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFocus = () => {
    // Track form start only once
    if (!formStartTracked.current) {
      trackFormStart('application');
      formStartTracked.current = true;
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof FormData, value);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    const fullNameError = validateField('fullName', formData.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;
    
    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;
    
    const phoneError = validateField('phone', formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    const experienceError = validateField('bettingExperience', formData.bettingExperience);
    if (experienceError) newErrors.bettingExperience = experienceError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData: CreateApplicationRequest = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        bettingExperience: formData.bettingExperience as 'beginner' | 'intermediate' | 'advanced' | 'professional',
        smsConsent: formData.smsConsent,
      };

      const response = await axios.post<CreateApplicationResponse>(
        '/api/applications',
        requestData
      );

      if (response.data.success) {
        setSubmitSuccess(true);
        trackFormSubmit(true, 'application');
        // Clear form data
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          bettingExperience: '',
          smsConsent: false,
        });
      } else {
        const errorMsg = response.data.error || 'Something went wrong. Please try again or contact support.';
        setSubmitError(errorMsg);
        trackFormSubmit(false, 'application', errorMsg);
      }
    } catch (error) {
      let errorMsg = '';
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
          // Duplicate email
          errorMsg = 'An application with this email already exists. Please contact us if you need assistance.';
        } else if (error.response.status === 429) {
          // Rate limit exceeded
          errorMsg = 'Too many applications from this IP. Please try again later.';
        } else if (error.response.status === 400) {
          // Validation error
          const errorData = error.response.data as CreateApplicationResponse;
          if (errorData.details && errorData.details.length > 0) {
            errorMsg = errorData.details.join('. ');
          } else {
            errorMsg = errorData.error || 'Please check your input and try again.';
          }
        } else if (error.response.status >= 500) {
          // Server error
          errorMsg = 'Server error. Please try again later or contact support.';
        } else {
          errorMsg = 'Something went wrong. Please try again or contact support.';
        }
      } else {
        // Network error or other error
        errorMsg = 'Unable to connect. Please check your internet connection and try again.';
      }
      setSubmitError(errorMsg);
      trackFormSubmit(false, 'application', errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Skip to main content link for keyboard navigation */}
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>

        <main id="main-content">
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="bg-gray-800 rounded-lg p-6 sm:p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-green-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Application Received!</h1>
            <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8">
              We'll review your request and contact you within 24-48 hours.
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors min-h-[44px] flex items-center justify-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      <main id="main-content">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="mb-6 sm:mb-8">
          <Link to="/" className="text-blue-400 hover:text-blue-300 inline-flex items-center mb-4 min-h-[44px]">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Request Access</h1>
          <p className="text-sm sm:text-base text-gray-400">
            Join WizJock and start receiving expert sports betting analysis and picks.
          </p>
        </div>

        {submitError && (
          <div 
            className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6" 
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <p>{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 sm:p-8" noValidate>
          {/* Full Name */}
          <div className="mb-5 sm:mb-6">
            <label htmlFor="fullName" className="block text-sm sm:text-base font-medium mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={`w-full px-4 py-3 sm:py-4 bg-gray-700 border ${
                errors.fullName ? 'border-red-500' : 'border-gray-600'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base min-h-[44px]`}
              aria-required="true"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            />
            {errors.fullName && (
              <p id="fullName-error" className="mt-2 text-sm text-red-400">
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-5 sm:mb-6">
            <label htmlFor="email" className="block text-sm sm:text-base font-medium mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 sm:py-4 bg-gray-700 border ${
                errors.email ? 'border-red-500' : 'border-gray-600'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base min-h-[44px]`}
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-2 text-sm text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-5 sm:mb-6">
            <label htmlFor="phone" className="block text-sm sm:text-base font-medium mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="+1 (555) 123-4567"
              className={`w-full px-4 py-3 sm:py-4 bg-gray-700 border ${
                errors.phone ? 'border-red-500' : 'border-gray-600'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base min-h-[44px]`}
              aria-required="true"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-2 text-sm text-red-400">
                {errors.phone}
              </p>
            )}
          </div>

          {/* Betting Experience */}
          <div className="mb-5 sm:mb-6">
            <label htmlFor="bettingExperience" className="block text-sm sm:text-base font-medium mb-2">
              Betting Experience Level <span className="text-red-500">*</span>
            </label>
            <select
              id="bettingExperience"
              name="bettingExperience"
              value={formData.bettingExperience}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 sm:py-4 bg-gray-700 border ${
                errors.bettingExperience ? 'border-red-500' : 'border-gray-600'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-base min-h-[44px]`}
              aria-required="true"
              aria-invalid={!!errors.bettingExperience}
              aria-describedby={errors.bettingExperience ? 'bettingExperience-error' : undefined}
            >
              <option value="">Select your experience level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="professional">Professional</option>
            </select>
            {errors.bettingExperience && (
              <p id="bettingExperience-error" className="mt-2 text-sm text-red-400">
                {errors.bettingExperience}
              </p>
            )}
          </div>

          {/* SMS Consent */}
          <div className="mb-6 sm:mb-8">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                name="smsConsent"
                checked={formData.smsConsent}
                onChange={handleChange}
                className="mt-1 w-5 h-5 sm:w-6 sm:h-6 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-3 text-xs sm:text-sm text-gray-300">
                I agree to receive automated text messages from WizJock. Message and data rates may apply. 
                Reply STOP to opt out.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-base sm:text-lg transition-colors min-h-[44px] ${
              isSubmitting
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>

          <p className="mt-4 text-xs sm:text-sm text-gray-400 text-center">
            By submitting this form, you agree to our{' '}
            <Link to="/terms" className="text-blue-400 hover:text-blue-300 underline">
              Terms of Use
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-400 hover:text-blue-300 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>
      </main>
      <Footer />
    </div>
  );
}
