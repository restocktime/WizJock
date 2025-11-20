import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  trackEvent,
  trackPageView,
  trackCTAClick,
  trackFormStart,
  trackFormSubmit,
  trackWhatsAppClick,
} from '../analytics';

describe('Analytics Utility Functions', () => {
  beforeEach(() => {
    // Reset window.gtag before each test
    delete (window as any).gtag;
    delete (window as any).dataLayer;
  });

  describe('trackEvent', () => {
    it('should call gtag with correct parameters when gtag is available', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackEvent('test_event', { param1: 'value1' });

      expect(mockGtag).toHaveBeenCalledWith('event', 'test_event', {
        param1: 'value1',
      });
    });

    it('should not throw error when gtag is not available', () => {
      expect(() => {
        trackEvent('test_event');
      }).not.toThrow();
    });

    it('should handle events without parameters', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackEvent('simple_event');

      expect(mockGtag).toHaveBeenCalledWith('event', 'simple_event', undefined);
    });
  });

  describe('trackPageView', () => {
    it('should track page view with correct parameters', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackPageView('/test-page');

      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/test-page',
        page_location: window.location.href,
        page_title: document.title,
      });
    });

    it('should not throw error when gtag is not available', () => {
      expect(() => {
        trackPageView('/test-page');
      }).not.toThrow();
    });
  });

  describe('trackCTAClick', () => {
    it('should track CTA click with location parameter', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackCTAClick('header');

      expect(mockGtag).toHaveBeenCalledWith('event', 'cta_click', {
        location: 'header',
        button_text: 'Request Access',
      });
    });

    it('should track CTA clicks from different locations', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackCTAClick('hero');
      trackCTAClick('pricing_card');
      trackCTAClick('footer');

      expect(mockGtag).toHaveBeenCalledTimes(3);
      expect(mockGtag).toHaveBeenNthCalledWith(1, 'event', 'cta_click', {
        location: 'hero',
        button_text: 'Request Access',
      });
      expect(mockGtag).toHaveBeenNthCalledWith(2, 'event', 'cta_click', {
        location: 'pricing_card',
        button_text: 'Request Access',
      });
      expect(mockGtag).toHaveBeenNthCalledWith(3, 'event', 'cta_click', {
        location: 'footer',
        button_text: 'Request Access',
      });
    });
  });

  describe('trackFormStart', () => {
    it('should track form start with default form name', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackFormStart();

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_start', {
        form_name: 'application',
      });
    });

    it('should track form start with custom form name', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackFormStart('contact');

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_start', {
        form_name: 'contact',
      });
    });
  });

  describe('trackFormSubmit', () => {
    it('should track successful form submission', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackFormSubmit(true);

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_submit', {
        form_name: 'application',
        success: true,
      });
    });

    it('should track failed form submission without error message', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackFormSubmit(false);

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_submit', {
        form_name: 'application',
        success: false,
      });
    });

    it('should track failed form submission with error message', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackFormSubmit(false, 'application', 'Invalid email format');

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_submit', {
        form_name: 'application',
        success: false,
        error_message: 'Invalid email format',
      });
    });

    it('should track form submission with custom form name', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackFormSubmit(true, 'contact');

      expect(mockGtag).toHaveBeenCalledWith('event', 'form_submit', {
        form_name: 'contact',
        success: true,
      });
    });
  });

  describe('trackWhatsAppClick', () => {
    it('should track WhatsApp click with location', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackWhatsAppClick('hero');

      expect(mockGtag).toHaveBeenCalledWith('event', 'whatsapp_click', {
        location: 'hero',
        link_type: 'external',
      });
    });

    it('should track WhatsApp clicks from different locations', () => {
      const mockGtag = vi.fn();
      (window as any).gtag = mockGtag;

      trackWhatsAppClick('header');
      trackWhatsAppClick('social_proof');

      expect(mockGtag).toHaveBeenCalledTimes(2);
      expect(mockGtag).toHaveBeenNthCalledWith(1, 'event', 'whatsapp_click', {
        location: 'header',
        link_type: 'external',
      });
      expect(mockGtag).toHaveBeenNthCalledWith(2, 'event', 'whatsapp_click', {
        location: 'social_proof',
        link_type: 'external',
      });
    });
  });
});
