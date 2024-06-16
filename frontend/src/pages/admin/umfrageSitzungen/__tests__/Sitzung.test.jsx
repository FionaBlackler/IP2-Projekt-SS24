import { render, screen, waitFor, fireEvent, getByText } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { expect, vi } from 'vitest'
import Sitzung from '../Sitzung'
import SitzungenTable from '../SitzungenTable'
import { sitzungenLöschen } from '../SitzungUtils'
import SitzungenResults from '../Results'
import UmfrageSitzungen from '../UmfrageSizungen'
import { func } from 'prop-types'

// Mock for useParams, useNavigate
const navigate = vi.fn();
vi.mock('react-router-dom', () => ({
    ...require('react-router-dom'),
    useParams: () => ({
        umfrageId: '123',
        ids: '1'
    }),
    useNavigate: () => navigate, // Mock the navigate function
}));

const setData = vi.fn();
const setSelectedIds = vi.fn();

//response value des Requests 
const mockData = {
    sitzungen: [
        {
            id: 1,
            startzeit: '2023-06-01 09:00:00',
            endzeit: '2023-06-01 11:00:00',
            teilnehmerzahl: 15,
            aktiv: true,
        },
        {
            id: 2,
            startzeit: '2023-06-02 10:00:00',
            endzeit: '2023-06-02 12:00:00',
            teilnehmerzahl: 20,
            aktiv: false,
        },
    ],
};


describe('Sitzung Component', () => {
    const axiosMock = new AxiosMockAdapter(axios)

    beforeEach(() => {
        axiosMock.reset()
    })

    test('renders loading state initially', () => {
        render(
            <BrowserRouter>
                <Sitzung />
            </BrowserRouter>
        )

        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('fetches and displays data', async () => {
        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        axiosMock.onGet(`${import.meta.env.VITE_BACKEND_URL}umfrage/123/sitzungen`).reply(200, mockData)

        render(
            <BrowserRouter>
                <Sitzung />
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(screen.getByText('Sitzungstabelle für Umfrage ID 123')).toBeInTheDocument()
        })

        expect(consoleLogSpy).toHaveBeenCalledWith('Data received from server:', mockData)
        consoleLogSpy.mockRestore()
    })

    test('handles no data response', async () => {
        const consoleNoDataLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        axiosMock.onGet(`${import.meta.env.VITE_BACKEND_URL}umfrage/123/sitzungen`).reply(204)

        render(
            <BrowserRouter>
                <Sitzung />
            </BrowserRouter>
        )

        await waitFor(() => expect(screen.getByText('Keine Sitzungen vorhanden')).toBeInTheDocument())
        expect(consoleNoDataLogSpy).toHaveBeenCalledWith('Keine Einträge vorhanden')

        consoleNoDataLogSpy.mockRestore()
    })

    test('handles authentication error', async () => {
        const consoleAuthErrorSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        axiosMock.onGet(`${import.meta.env.VITE_BACKEND_URL}umfrage/123/sitzungen`).reply(401, {
            message: "Authentication failed"
        })

        render(
            <BrowserRouter>
                <Sitzung />
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(consoleAuthErrorSpy).toHaveBeenCalledWith('Authentifizierungsfehler', expect.objectContaining({
                message: "Authentication failed"
            }))
        })

        // Cleanup the mock to not interfere with other tests
        consoleAuthErrorSpy.mockRestore()
    })

    test('handles page not found error', async () => {
        const consoleNotFoundErrorSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        axiosMock.onGet(`${import.meta.env.VITE_BACKEND_URL}umfrage/123/sitzungen`).reply(404, {
            message: "Umfrage not found"
        })

        render(
            <BrowserRouter>
                <Sitzung />
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(consoleNotFoundErrorSpy).toHaveBeenCalledWith('Umfrage nicht gefunden (falsche ID)', expect.objectContaining({
                message: "Umfrage not found"
            }))
        })

        // Cleanup the mock to not interfere with other tests
        consoleNotFoundErrorSpy.mockRestore()
    })

    test('handles server error', async () => {
        const consoleServerErrorSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        axiosMock.onGet(`${import.meta.env.VITE_BACKEND_URL}umfrage/123/sitzungen`).reply(500, {
            message: "Internal Server Error, contact Backend-Team for more Info"
        })

        render(
            <BrowserRouter>
                <Sitzung />
            </BrowserRouter>
        )

        await waitFor(() => {
            expect(consoleServerErrorSpy).toHaveBeenCalledWith('server error', expect.objectContaining({
                message: "Internal Server Error, contact Backend-Team for more Info"
            }))
        })

        // Cleanup the mock to not interfere with other tests
        consoleServerErrorSpy.mockRestore()
    })

    test('renders table with correct data', () => {

        render(
            <BrowserRouter>
                <SitzungenTable data={mockData} />
            </BrowserRouter>
        )

        // Verify table headers
        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('Startzeit')).toBeInTheDocument();
        expect(screen.getByText('Endzeit')).toBeInTheDocument();
        expect(screen.getByText('Teilnehmerzahl')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();

        // Verify table rows and data
        mockData.sitzungen.forEach((sitzung) => {
            expect(screen.getByText(String(sitzung.id))).toBeInTheDocument();
            expect(screen.getByText(sitzung.startzeit)).toBeInTheDocument();
            expect(screen.getByText(sitzung.endzeit)).toBeInTheDocument();
            expect(screen.getByText(String(sitzung.teilnehmerzahl))).toBeInTheDocument();
            expect(screen.getByText(sitzung.aktiv ? 'Aktiv' : 'Geschlossen')).toBeInTheDocument();
        });
    })

    test('handles checkbox selection', () => {
        render(
            <BrowserRouter>
                <SitzungenTable data={mockData} />
            </BrowserRouter>
        );

        const checkbox1 = screen.getByLabelText('1');
        const checkbox2 = screen.getByLabelText('2'); 

        // Verify checkboxes are initially unchecked
        expect(checkbox1.checked).toBe(false);
        expect(checkbox2.checked).toBe(false);

        // Simulate clicking checkboxes
        fireEvent.click(checkbox1);
        fireEvent.click(checkbox2);

        // Assert checkboxes are now checked
        expect(checkbox1.checked).toBe(true);
        expect(checkbox2.checked).toBe(true);
    });

    test('navigates to results page when button is clicked', () => {

        render(
            <BrowserRouter>
              <SitzungenTable data={mockData} />
            </BrowserRouter>
        );

        const checkbox1 = screen.getByLabelText('1'); 
        const checkbox2 = screen.getByLabelText('2'); 
        fireEvent.click(checkbox1);
        fireEvent.click(checkbox2);

        const button = screen.getByTestId('results-button');
        expect(button).toBeInTheDocument();

        // Click the Results button
        fireEvent.click(button);
        // Expect navigate to have been called with the correct path
        expect(navigate).toHaveBeenCalledWith('/sitzung/1,2/results');
    });

    test('clicking checkbox will display delete button', () => {

        render(
            <BrowserRouter>
              <SitzungenTable data={mockData} />
            </BrowserRouter>
        );

        const checkbox1 = screen.getByLabelText('1'); 
        const checkbox2 = screen.getByLabelText('2'); 
        fireEvent.click(checkbox1);
        fireEvent.click(checkbox2);

        const deleteButton = screen.getByTestId('delete-button'); // Select the delete button using its data-testid
        expect(deleteButton).toBeInTheDocument();
    });

    test('deletes selected Sitzungen and updates data', async () => {
        const consoleDeleteLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        axiosMock.onDelete(`${import.meta.env.VITE_BACKEND_URL}sitzung/delete/1`).reply(200, {
            message: "Sitzung deleted successfully"
        })
        axiosMock.onDelete(`${import.meta.env.VITE_BACKEND_URL}sitzung/delete/2`).reply(200, {
            message: "Sitzung deleted successfully"
        })

        sitzungenLöschen([1, 2], setSelectedIds, mockData, setData);
        // Wait for Axios requests to complete
        await waitFor(() => {
            expect(axiosMock.history.delete.length).toBe(2); // Expect two DELETE requests
        });

        // Expect setData to be called with updated data (post deletion)
        expect(setData).toHaveBeenCalledTimes(1);
        expect(setData).toHaveBeenCalledWith({
            sitzungen: [], // After deletion, assuming it clears the data
        });
        expect(setSelectedIds).toHaveBeenCalledWith([]); // After deletion, assuming it clears the selectedIDs

        expect(consoleDeleteLogSpy).toHaveBeenCalledWith('Sitzung mit ID 1 erfolgreich gelöscht')
        expect(consoleDeleteLogSpy).toHaveBeenCalledWith('Sitzung mit ID 2 erfolgreich gelöscht')
        consoleDeleteLogSpy.mockRestore()
    })
    
    test('renders UmfrageSitzungen without crashing', () => {
        render(
            <BrowserRouter>
              <UmfrageSitzungen />
            </BrowserRouter>
        );
    });
})
