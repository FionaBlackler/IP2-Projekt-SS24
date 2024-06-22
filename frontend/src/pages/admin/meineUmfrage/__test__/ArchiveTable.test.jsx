import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ArchiveTable from '../ArchiveTable'
import { describe, it, expect } from 'vitest'

describe('ArchiveTable', () => {
    it('Überprüfe ob die Checkbox ausgewählt wurde', () => {
        const testData = {
            umfragen: [
                {
                    id: 1,
                    titel: 'Umfrage 1',
                    archivierungsdatum: '2024-06-22 00:00:00.000000',
                },
                {
                    id: 2,
                    titel: 'Umfrage 2',
                    archivierungsdatum: '2024-06-22 00:00:00.000000',
                },
            ],
        }

        const { getByTestId } = render(
            <BrowserRouter>
                <ArchiveTable data={testData} />
            </BrowserRouter>
        )

        const checkbox1 = getByTestId('checkbox-1')
        const checkbox2 = getByTestId('checkbox-2')

        fireEvent.click(checkbox1)
        fireEvent.click(checkbox2)

        expect(checkbox1.checked).toBeTruthy()
        expect(checkbox2.checked).toBeTruthy()
    })

    it('Überprüfe die Navigierung', () => {
        const data = {
            umfragen: [
                {
                    id: '1',
                    titel: 'Test Umfrage',
                    beschreibung: 'Dies ist eine Testumfrage',
                    erstellungsdatum: '2024-06-22',
                    archivierungsdatum: null,
                    status: 'aktiv',
                },
            ],
        }

        const { getByTestId } = render(
            <BrowserRouter>
                <ArchiveTable data={data} />
            </BrowserRouter>
        )

        expect(getByTestId('archiveTable')).toBeTruthy()
    });
    it('Überprüfe die Navigierung', () => {
        const data = {
            umfragen: [
                {
                    id: '1',
                    titel: 'Test Umfrage',
                    beschreibung: 'Dies ist eine Testumfrage',
                    erstellungsdatum: '2024-06-22',
                    archivierungsdatum: '2024-06-22',
                    status: 'aktiv',
                },
            ],
        }

        const { getByTestId } = render(
            <BrowserRouter>
                <ArchiveTable data={data} />
            </BrowserRouter>
        )

        expect(getByTestId('archivetabelle')).toBeTruthy()
    });

});
