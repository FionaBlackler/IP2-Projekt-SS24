import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter';
import { expect, vi } from 'vitest'
import Sitzung from '../Sitzung'
import SitzungenTable from '../SitzungenTable'
import { sitzungenLöschen } from '../SitzungUtils'
import UmfrageSitzungen from '../UmfrageSizungen'
import SitzungenResults from '../Results.jsx';
import axiosInstance from '../../../../axios/axiosConfig.js'


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
const setShowResults = vi.fn();
const setDisplayedIds = vi.fn();
const setLoading = vi.fn();
const handleCheckboxChange = vi.fn()

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

const mockResultData = {
    "umfrage": {
      id: 123,
      admin_id: 2,
      titel: "Example Survey",
      beschreibung: "This is an example survey.",
      erstellungsdatum: "2023-05-16 00:00:00.000000",
      archivierungsdatum: null,
      status: "active",
      json_text: "Testing Json"
    },
    "result": {
      1: {
        id: 1,
        local_id: 1,
        umfrage_id: 123,
        text: "What is the capital of France?",
        typ_id: "1",
        punktzahl: 1,
        bestaetigt: "Paris",
        verneint: "Not Paris",
        antworten: [
          {
            id: 1,
            text: "Paris",
            ist_richtig: true,
            antwortenTrue: 16,
            antwortenFalse: 4
          },
          {
            id: 2,
            text: "London",
            ist_richtig: false,
            antwortenTrue: 2,
            antwortenFalse: 18
          }
        ]
      }
    }
  };


describe('Sitzung Component', () => {
    let originalAxiosGet;

    beforeEach(() => {
        originalAxiosGet = axiosInstance.get;
        axiosInstance.get = vi.fn();
    });

    afterEach(() => {
        axiosInstance.get = originalAxiosGet;
    });

    test('fetches and displays data', async () => {
        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        axiosInstance.get.mockResolvedValue({ status: 200, data: mockData });
    
        render(
            <MemoryRouter initialEntries={['/umfrage/123/sitzungen']}>
                <Routes>
                    <Route path="umfrage/:umfrageId/sitzungen" element={<Sitzung />} />
                </Routes>
            </MemoryRouter>
        );

        const loadingText = screen.getByText('Loading...');
        expect(loadingText).toBeTruthy();

        await screen.findByText(`Umfrage 123`); 
        expect(screen.queryByText('Loading...')).not.toBeTruthy();

        const dotChartButton = screen.getByTestId('results-button');
        expect(dotChartButton).toBeTruthy();

        const deleteButton = screen.getByTestId('delete-button');
        expect(deleteButton).toBeTruthy();

        const sitzungResult = screen.getByTestId('sitzungen-results'); 
        expect(sitzungResult).toBeTruthy();

        const sitzungTable = screen.getByTestId('sitzungen-table'); 
        expect(sitzungTable).toBeTruthy();
    
        await waitFor(() => {
            expect(consoleLogSpy).toHaveBeenCalledWith('Data received from server:', mockData);
        });
        consoleLogSpy.mockRestore();
    });

    test('handles no data response', async () => {
        const consoleNoDataLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        axiosInstance.get.mockResolvedValue({ status: 204, data: mockData });

        render(
            <MemoryRouter initialEntries={['/umfrage/123/sitzungen']}>
                <Routes>
                    <Route path="umfrage/:umfrageId/sitzungen" element={<Sitzung />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Keine Sitzungen vorhanden')).toBeInTheDocument())
        expect(consoleNoDataLogSpy).toHaveBeenCalledWith('Keine Einträge vorhanden')
        expect(screen.queryByText('Loading...')).not.toBeTruthy();
        consoleNoDataLogSpy.mockRestore()
    })

    test('handles authentication error', async () => {
        const consoleAuthErrorSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        axiosInstance.get.mockRejectedValue( {response: { status: 401, data: { message: 'Authentication failed' }}});

        render(
            <MemoryRouter initialEntries={['/umfrage/123/sitzungen']}>
                <Routes>
                    <Route path="umfrage/:umfrageId/sitzungen" element={<Sitzung />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(consoleAuthErrorSpy).toHaveBeenCalledWith(
                'Authentifizierungsfehler',
                expect.objectContaining({ message: 'Authentication failed' })
            );
        });

        expect(screen.queryByText('Loading...')).not.toBeTruthy();
        consoleAuthErrorSpy.mockRestore()
    })

    test('handles page not found error', async () => {
        const consoleNotFoundErrorSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        axiosInstance.get.mockRejectedValue( { response: { status: 404, data: 'Umfrage not found' } });

        render(
            <MemoryRouter initialEntries={['/umfrage/123/sitzungen']}>
                <Routes>
                    <Route path="umfrage/:umfrageId/sitzungen" element={<Sitzung />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(console.log).toHaveBeenCalledWith('Umfrage nicht gefunden (falsche ID)', 'Umfrage not found');
        })

        expect(screen.queryByText('Loading...')).not.toBeTruthy();
        consoleNotFoundErrorSpy.mockRestore()
    })

    test('handles server error', async () => {
        const consoleServerErrorSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        axiosInstance.get.mockRejectedValue( { response: { status: 500, data: "Internal Server Error, contact Backend-Team for more Info" } });

        render(
            <MemoryRouter initialEntries={['/umfrage/123/sitzungen']}>
                <Routes>
                    <Route path="umfrage/:umfrageId/sitzungen" element={<Sitzung />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(consoleServerErrorSpy).toHaveBeenCalledWith('server error', "Internal Server Error, contact Backend-Team for more Info");
        })

        expect(screen.queryByText('Loading...')).not.toBeTruthy();
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

    test('handles checkbox selection', async () => {
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

    test('handleShowResults after clicking DotChart button', async () => {
        render(
            <BrowserRouter>
                <SitzungenTable data={mockData} setData={setData} />
            </BrowserRouter>
        );

        mockData.sitzungen.forEach((sitzung) => async () => {
            const checkbox = screen.getByTestId(`checkbox-${sitzung.id}`);
            fireEvent.click(checkbox);
            expect(checkbox.checked).toBe(true);
            expect(setSelectedIds).toHaveBeenCalledWith([sitzung.id]);

            const dotChartButton = screen.getByTestId('results-button');
            fireEvent.click(dotChartButton);

            // Wait for state updates to propagate and component to re-render
            await waitFor(() => {
                expect(setDisplayedIds).toHaveBeenCalledWith([sitzung.id]);
                expect(setShowResults).toHaveBeenCalledWith(true);
                expect(checkbox.checked).toBe(true);
            });
        }); 
    });

    test('load SitzungResults after DotChart clicked', async () => {

        const consoleResultLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        axiosInstance.get.mockResolvedValue(200, mockResultData );
    
        render(<SitzungenResults displayedIds={[1]} />);

        //expect(consoleResultLogSpy).toHaveBeenCalledWith('Ergebnisse zur Sitzung mit ID 1');
        //consoleResultLogSpy.mockRestore();
    });  

    test('clicking checkbox will display delete and dotChart button', () => {

        render(
            <BrowserRouter>
              <SitzungenTable data={mockData} setData={setData} />
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
        let mock = new MockAdapter(axiosInstance);
        let getData = { sitzungen: [{ id: 1 }, { id: 2 }] };
        localStorage.setItem('accessToken', 'test-token');

        const consoleDeleteLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        mock.onDelete(`sitzung/delete/1`).reply( 200, "Sitzung deleted successfully" );
        mock.onDelete(`sitzung/delete/2`).reply( 200, "Sitzung deleted successfully" );

        await sitzungenLöschen([1, 2], setSelectedIds, getData, setData);
        await new Promise(process.nextTick);
        
        // Wait for Axios requests to complete
        await waitFor(() => {
            expect(mock.history.delete.length).toBe(2); // Expect two DELETE requests
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
    });
})
