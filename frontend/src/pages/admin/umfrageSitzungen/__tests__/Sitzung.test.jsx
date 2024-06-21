import { render, screen, waitFor, fireEvent, getByText } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter, useNavigate, MemoryRouter, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { expect, vi } from 'vitest'
import Sitzung from '../Sitzung'
import SitzungenTable from '../SitzungenTable'
import { sitzungenLöschen } from '../SitzungUtils'
import SitzungenResults from '../Results'
import UmfrageSitzungen from '../UmfrageSizungen'
import { func } from 'prop-types'
import { MdOutlinePanoramaPhotosphereSelect } from 'react-icons/md'

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

const handleNavigation = vi.fn();
const setData = vi.fn();
const setSelectedIds = vi.fn();
const handleCheckboxChange = vi.fn();

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
        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        axiosMock.onGet(`${import.meta.env.VITE_BACKEND_URL}umfrage/123/sitzungen`).reply(200, mockData);
    
        render(
            <MemoryRouter initialEntries={['/umfrage/123/sitzungen']}>
                <Routes>
                    <Route path="umfrage/:umfrageId/sitzungen" element={<Sitzung />} />
                </Routes>
            </MemoryRouter>
        );
    
        await waitFor(() => {
            expect(consoleLogSpy).toHaveBeenCalledWith('Data received from server:', mockData);
        });
        consoleLogSpy.mockRestore();
    });

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
        consoleServerErrorSpy.mockRestore()
    })

    test('renders table with correct data', () => {

        render(
            <BrowserRouter>
                <SitzungenTable data={mockData} setData={setData}/>
            </BrowserRouter>
        )

        // Verify table headers
        expect(screen.getByText('Startzeit')).toBeInTheDocument();
        expect(screen.getByText('Endzeit')).toBeInTheDocument();
        expect(screen.getByText('Teilnehmer')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();

        // Verify table rows and data
        mockData.sitzungen.forEach((sitzung) => {
            expect(screen.getByText(sitzung.startzeit.toString().slice(0, 16))).toBeInTheDocument();
            expect(screen.getByText(sitzung.endzeit.toString().slice(0, 16))).toBeInTheDocument();
            expect(screen.getByText(String(sitzung.teilnehmerzahl))).toBeInTheDocument();
            if (sitzung.aktiv) {
                expect(screen.getByTestId(`status-${sitzung.id}`)).toHaveClass('bg-green-500');
            } else {
                expect(screen.getByTestId(`status-${sitzung.id}`)).toHaveClass('bg-red-500');
            }
            const navigateButton = screen.getByTestId(`navigate-button-${sitzung.id}`);
            expect(navigateButton).toBeInTheDocument();
        });
    })

    test('handles checkbox selection', () => {
        render(
            <BrowserRouter>
                <SitzungenTable data={mockData} setData={setData}/>
            </BrowserRouter>
        );

        mockData.sitzungen.forEach((sitzung) => {
            const checkbox = screen.getByTestId(`checkbox-${sitzung.id}`);
            expect(checkbox.checked).toBe(false);
            fireEvent.click(checkbox);
            expect(checkbox.checked).toBe(true);

            setSelectedIds([], sitzung.id) 
        }); 
    });

    test('navigates to session dashboard page when navigate button is clicked', () => {

        render(
            <BrowserRouter>
              <SitzungenTable data={mockData} setData={setData}/>
            </BrowserRouter>
        );

        mockData.sitzungen.forEach((sitzung) => {
            const navigateButton = screen.getByTestId(`navigate-button-${sitzung.id}`);
            fireEvent.click(navigateButton);
           
           // expect(handleNavigation).toHaveBeenCalledWith(sitzung.id);
            expect(navigate).toHaveBeenCalledWith(``);   //TODO add pfad
        });
    });

    //TODO: an derselbe seite -->  render Results
    /* test('navigates to results page when button is clicked', () => {

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
    }); */

    test('clicking checkbox will display delete and dotChart button', () => {

        render(
            <BrowserRouter>
              <SitzungenTable data={mockData} />
            </BrowserRouter>
        );

        mockData.sitzungen.forEach((sitzung) => {
            const checkbox = screen.getByTestId(`checkbox-${sitzung.id}`);
            fireEvent.click(checkbox);
        });

        const deleteButton = screen.getByTestId('delete-button'); // Select the delete button using its data-testid
        const dotChartButton = screen.getByTestId('results-button');
        expect(deleteButton).toBeInTheDocument();
        expect(dotChartButton).toBeInTheDocument();
    });

    test('deletes selected Sitzungen and updates data id delete button clicked', async () => {
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
