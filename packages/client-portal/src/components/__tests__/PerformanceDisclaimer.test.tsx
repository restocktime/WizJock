import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PerformanceDisclaimer from '../PerformanceDisclaimer';

describe('PerformanceDisclaimer Component', () => {
  const disclaimerText = 'Past performance does not guarantee future results';

  describe('Rendering', () => {
    it('should render with default inline variant', () => {
      render(<PerformanceDisclaimer />);
      
      const disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer).toBeInTheDocument();
    });

    it('should render with inline variant explicitly set', () => {
      render(<PerformanceDisclaimer variant="inline" />);
      
      const disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer).toBeInTheDocument();
      expect(disclaimer.tagName).toBe('SPAN');
    });

    it('should render with block variant', () => {
      render(<PerformanceDisclaimer variant="block" />);
      
      const disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer).toBeInTheDocument();
      expect(disclaimer.tagName).toBe('DIV');
    });

    it('should include asterisk prefix in text', () => {
      render(<PerformanceDisclaimer />);
      
      const disclaimer = screen.getByText(/^\*/);
      expect(disclaimer).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have minimum 11px font size for inline variant', () => {
      render(<PerformanceDisclaimer variant="inline" />);
      
      const disclaimer = screen.getByText(`*${disclaimerText}`);
      const styles = window.getComputedStyle(disclaimer);
      
      // Check inline style
      expect(disclaimer).toHaveStyle({ fontSize: '11px' });
    });

    it('should have minimum 11px font size for block variant', () => {
      render(<PerformanceDisclaimer variant="block" />);
      
      const disclaimer = screen.getByText(`*${disclaimerText}`);
      
      // Check inline style
      expect(disclaimer).toHaveStyle({ fontSize: '11px' });
    });

    it('should apply custom className', () => {
      render(<PerformanceDisclaimer className="custom-class" />);
      
      const disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer).toHaveClass('custom-class');
    });

    it('should have gray text color', () => {
      render(<PerformanceDisclaimer />);
      
      const disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer).toHaveClass('text-gray-400');
    });

    it('should have margin-top for block variant', () => {
      render(<PerformanceDisclaimer variant="block" />);
      
      const disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer).toHaveClass('mt-2');
    });

    it('should not have margin-top for inline variant', () => {
      render(<PerformanceDisclaimer variant="inline" />);
      
      const disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer).not.toHaveClass('mt-2');
    });
  });

  describe('Accessibility', () => {
    it('should render text content that is readable', () => {
      render(<PerformanceDisclaimer />);
      
      const disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer.textContent).toBe(`*${disclaimerText}`);
    });

    it('should be visible in the document', () => {
      render(<PerformanceDisclaimer />);
      
      const disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer).toBeVisible();
    });
  });

  describe('Props', () => {
    it('should accept and apply variant prop', () => {
      const { rerender } = render(<PerformanceDisclaimer variant="inline" />);
      let disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer.tagName).toBe('SPAN');

      rerender(<PerformanceDisclaimer variant="block" />);
      disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer.tagName).toBe('DIV');
    });

    it('should accept and apply className prop', () => {
      const { rerender } = render(<PerformanceDisclaimer className="class-1" />);
      let disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer).toHaveClass('class-1');

      rerender(<PerformanceDisclaimer className="class-2" />);
      disclaimer = screen.getByText(`*${disclaimerText}`);
      expect(disclaimer).toHaveClass('class-2');
    });

    it('should work without any props', () => {
      expect(() => {
        render(<PerformanceDisclaimer />);
      }).not.toThrow();
    });
  });
});
