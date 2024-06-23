import { render, screen } from '@testing-library/react';
import MeineUmfragen from '../MeineUmfragen';
import { BrowserRouter } from 'react-router-dom';
import {describe , it , expect} from 'vitest'

describe('MeineUmfragen Component', () => {
    it('Render AdminLayout mit Umfrage', () => {
        try {
            render(<BrowserRouter><MeineUmfragen /></BrowserRouter>);
      

        const adminLayout = screen.getByTestId('admin');
        expect(adminLayout).toBeTruthy();

        const umfrageComponent = screen.getByTestId('umfrage');
        expect(umfrageComponent).toBeTruthy();
    } catch (error) {
        console.log(error)
    }
    });
});
