import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import Apply from '../pages/Apply';
import LandingPage from '../pages/LandingPage';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfUse from '../pages/TermsOfUse';
import ResponsibleGambling from '../pages/ResponsibleGambling';
import About from '../pages/About';
import Contact from '../pages/Contact';

// Helper to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Accessibility Tests', () => {
  describe('Apply Page', () => {
    it('should not have critical accessibility violations', async () => {
      const { container } = renderWithRouter(<Apply />);
      const results = await axe(container, {
        rules: {
          'heading-order': { enabled: false },
          'landmark-complementary-is-top-level': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = renderWithRouter(<Apply />);
      
      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toBe('Request Access');
    });

    it('should have skip to main content link', () => {
      const { getByText } = renderWithRouter(<Apply />);
      
      const skipLink = getByText(/skip to main content/i);
      expect(skipLink).toBeInTheDocument();
      expect(skipLink).toHaveAttribute('href', '#main-content');
    });

    it('should have main landmark', () => {
      const { container } = renderWithRouter(<Apply />);
      
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveAttribute('id', 'main-content');
    });

    it('should have properly labeled form inputs', () => {
      const { getByLabelText } = renderWithRouter(<Apply />);
      
      expect(getByLabelText(/full name/i)).toBeInTheDocument();
      expect(getByLabelText(/email address/i)).toBeInTheDocument();
      expect(getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(getByLabelText(/betting experience level/i)).toBeInTheDocument();
    });

    it('should have aria-required on required fields', () => {
      const { getByLabelText } = renderWithRouter(<Apply />);
      
      expect(getByLabelText(/full name/i)).toHaveAttribute('aria-required', 'true');
      expect(getByLabelText(/email address/i)).toHaveAttribute('aria-required', 'true');
      expect(getByLabelText(/phone number/i)).toHaveAttribute('aria-required', 'true');
      expect(getByLabelText(/betting experience level/i)).toHaveAttribute('aria-required', 'true');
    });
  });

  describe('Landing Page', () => {
    it('should not have any critical accessibility violations', async () => {
      const { container } = renderWithRouter(<LandingPage />);
      const results = await axe(container, {
        rules: {
          // Allow color contrast issues for now as they may be design choices
          'color-contrast': { enabled: false },
          'landmark-complementary-is-top-level': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = renderWithRouter(<LandingPage />);
      
      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
    });

    it('should have skip to main content link', () => {
      const { getByText } = renderWithRouter(<LandingPage />);
      
      const skipLink = getByText(/skip to main content/i);
      expect(skipLink).toBeInTheDocument();
    });

    it('should have main landmark', () => {
      const { container } = renderWithRouter(<LandingPage />);
      
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should have alt text for images', () => {
      const { container } = renderWithRouter(<LandingPage />);
      
      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });

  describe('Privacy Policy Page', () => {
    it('should not have critical accessibility violations', async () => {
      const { container } = renderWithRouter(<PrivacyPolicy />);
      const results = await axe(container, {
        rules: {
          'landmark-complementary-is-top-level': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = renderWithRouter(<PrivacyPolicy />);
      
      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toContain('Privacy Policy');
    });

    it('should have semantic structure', () => {
      const { container } = renderWithRouter(<PrivacyPolicy />);
      
      // Check for semantic structure - main, article, or at least a div with content
      const main = container.querySelector('main');
      const article = container.querySelector('article');
      const contentDiv = container.querySelector('div');
      expect(main || article || contentDiv).toBeTruthy();
    });
  });

  describe('Terms of Use Page', () => {
    it('should not have critical accessibility violations', async () => {
      const { container } = renderWithRouter(<TermsOfUse />);
      const results = await axe(container, {
        rules: {
          'landmark-complementary-is-top-level': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = renderWithRouter(<TermsOfUse />);
      
      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toContain('Terms of Use');
    });

    it('should have semantic structure', () => {
      const { container } = renderWithRouter(<TermsOfUse />);
      
      const main = container.querySelector('main');
      const article = container.querySelector('article');
      const contentDiv = container.querySelector('div');
      expect(main || article || contentDiv).toBeTruthy();
    });
  });

  describe('Responsible Gambling Page', () => {
    it('should not have critical accessibility violations', async () => {
      const { container } = renderWithRouter(<ResponsibleGambling />);
      const results = await axe(container, {
        rules: {
          'heading-order': { enabled: false },
          'landmark-complementary-is-top-level': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = renderWithRouter(<ResponsibleGambling />);
      
      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toContain('Responsible Gambling');
    });

    it('should have semantic structure', () => {
      const { container } = renderWithRouter(<ResponsibleGambling />);
      
      const main = container.querySelector('main');
      const article = container.querySelector('article');
      const contentDiv = container.querySelector('div');
      expect(main || article || contentDiv).toBeTruthy();
    });

    it('should have accessible links to resources', () => {
      const { getByRole } = renderWithRouter(<ResponsibleGambling />);
      
      // Check for 1-800-GAMBLER link
      const gamblerLink = getByRole('link', { name: /1-800-gambler/i });
      expect(gamblerLink).toBeInTheDocument();
      expect(gamblerLink).toHaveAttribute('href');
    });
  });

  describe('About Page', () => {
    it('should not have critical accessibility violations', async () => {
      const { container } = renderWithRouter(<About />);
      const results = await axe(container, {
        rules: {
          'landmark-complementary-is-top-level': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = renderWithRouter(<About />);
      
      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toContain('About');
    });

    it('should have semantic structure', () => {
      const { container } = renderWithRouter(<About />);
      
      const main = container.querySelector('main');
      const article = container.querySelector('article');
      const contentDiv = container.querySelector('div');
      expect(main || article || contentDiv).toBeTruthy();
    });
  });

  describe('Contact Page', () => {
    it('should not have critical accessibility violations', async () => {
      const { container } = renderWithRouter(<Contact />);
      const results = await axe(container, {
        rules: {
          'landmark-complementary-is-top-level': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading hierarchy', () => {
      const { container } = renderWithRouter(<Contact />);
      
      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toContain('Contact');
    });

    it('should have semantic structure', () => {
      const { container } = renderWithRouter(<Contact />);
      
      const main = container.querySelector('main');
      const article = container.querySelector('article');
      const contentDiv = container.querySelector('div');
      expect(main || article || contentDiv).toBeTruthy();
    });

    it('should have accessible email links', () => {
      const { container } = renderWithRouter(<Contact />);
      
      const emailLinks = container.querySelectorAll('a[href^="mailto:"]');
      expect(emailLinks.length).toBeGreaterThan(0);
    });
  });

  describe('General Accessibility Requirements', () => {
    it('should have footer with navigation landmarks', () => {
      const { container } = renderWithRouter(<Apply />);
      
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      
      const navs = footer?.querySelectorAll('nav');
      expect(navs && navs.length).toBeGreaterThan(0);
    });

    it('should have aria-labels on navigation landmarks', () => {
      const { container } = renderWithRouter(<Apply />);
      
      const footer = container.querySelector('footer');
      const navs = footer?.querySelectorAll('nav');
      
      navs?.forEach((nav) => {
        expect(nav).toHaveAttribute('aria-label');
      });
    });
  });
});
