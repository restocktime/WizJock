import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { SportNavigation } from '../components/SportNavigation';

describe('SportNavigation', () => {
    it('renders all sports', () => {
        render(
            <MemoryRouter>
                <SportNavigation />
            </MemoryRouter>
        );

        expect(screen.getByText('NFL')).toBeInTheDocument();
        expect(screen.getByText('NBA')).toBeInTheDocument();
        expect(screen.getByText('NCAA')).toBeInTheDocument();
        expect(screen.getByText('UFC')).toBeInTheDocument();
    });

    it('displays pick counts', () => {
        render(
            <MemoryRouter>
                <SportNavigation />
            </MemoryRouter>
        );

        expect(screen.getByText('12')).toBeInTheDocument(); // NFL count
        expect(screen.getByText('8')).toBeInTheDocument();  // NBA count
    });
});
