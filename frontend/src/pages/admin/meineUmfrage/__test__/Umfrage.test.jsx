import { describe, it, expect, beforeEach, afterEach,  } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axiosInstance from '../../../../axios/axiosConfig';
import Umfrage from '../Umfrage';

describe('Umfrage Component', () => {
    let originalAxiosGet;

    beforeEach(() => {
        originalAxiosGet = axiosInstance.get;
        axiosInstance.get = vi.fn();
    });

    afterEach(() => {
        axiosInstance.get = originalAxiosGet;
    });

    it('Archivierte Umfragen:Überprüfe ob alle button angezeigt werden und funktionieren', async () => {
        const mockData = {
            umfragen: [
                { id: 1, title: 'Umfrage 1' },
                { id: 2, title: 'Umfrage 2' }
            ]
        };
        axiosInstance.get.mockResolvedValue({ data: mockData });
    
        render(<BrowserRouter><Umfrage /></BrowserRouter>);
    
        const loadingText = screen.getByText('Loading...');
        expect(loadingText).toBeTruthy();
    
        await screen.findByText(/Meine Umfragen/i); 
    
        expect(screen.queryByText('Loading...')).not.toBeTruthy();
    
        const uploadButton = screen.getByText('+ Umfragen hochladen');
        expect(uploadButton).toBeTruthy();
    
        const archiveButton = screen.getByText('Archiviert anzeigen');
        expect(archiveButton).toBeTruthy();
    
        const umfragenTable = screen.getByTestId('umfrageTable'); 
        expect(umfragenTable).toBeTruthy();
    });

    it('Archivierte Umfragen:Überprüfe ob alle button angezeigt werden und funktionieren', async () => {
        const mockData = {
            umfragen: [
                { id: 1, title: 'Umfrage 1' },
                { id: 2, title: 'Umfrage 2' }
            ]
        };
        axiosInstance.get.mockResolvedValue({ data: mockData });
    
        render(<BrowserRouter><Umfrage /></BrowserRouter>);
    
        await screen.findByText('Meine Umfragen'); 
    
        const filterButton = screen.getByText('Archiviert anzeigen');
        fireEvent.click(filterButton);
    
        const archiveTable = screen.getByTestId('archiveTable'); 
        expect(archiveTable).toBeTruthy();
    
        const uploadButton = screen.getByText('+ Umfragen hochladen');
        fireEvent.click(uploadButton);
    });
});
