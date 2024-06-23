import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import UmfragenTable  from '../UmfragenTable'
import { describe, it, expect } from 'vitest'

describe('UmfragenTable', () => {
    it('Überprüfe ob die Checkbox ausgewählt wurde', () => {
        const testData = {
            umfragen: [
                { id: 1, titel: 'Umfrage 1', archivierungsdatum: null },
                { id: 2, titel: 'Umfrage 2', archivierungsdatum: null },
            ],
        }

        const { getByTestId } = render(
            <BrowserRouter>
                <UmfragenTable data={testData} />
            </BrowserRouter>
        )

        const checkbox1 = getByTestId('checkbox-1')
        const checkbox2 = getByTestId('checkbox-2')

        fireEvent.click(checkbox1)
        fireEvent.click(checkbox2)

        expect(checkbox1.checked).toBeTruthy()
        expect(checkbox2.checked).toBeTruthy()
    })

    it("Überprüfe die Navigierung", () => {
        const testData = {
            umfragen: [
                { id: 1, titel: 'Umfrage 1', archivierungsdatum: null },
                { id: 2, titel: 'Umfrage 2', archivierungsdatum: null },
            ],
        }
    
        const { getByTestId } = render(
            <BrowserRouter history={history}>
                <UmfragenTable data={testData} />
            </BrowserRouter>
        )
    
        const historyButton1 = getByTestId('button-1')
        fireEvent.click(historyButton1)
        expect(window.location.pathname).toBe('/dashboard/1')
    
        const historyButton2 = getByTestId('button-2')
        fireEvent.click(historyButton2)
        expect(window.location.pathname).toBe('/dashboard/2')
    });
})
