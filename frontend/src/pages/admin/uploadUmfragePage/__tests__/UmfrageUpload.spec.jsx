import React from 'react';
import {render, fireEvent, screen, cleanup} from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import UmfragePopup from "../UmfragePopup.jsx";

describe('DropzoneComponent', () => {
    let renderedComp;
    beforeAll(() => {
        cleanup();
        renderedComp = render(<UmfragePopup />);
    });
    it('Test if file is uploading', async () => {
        // Mock-Datei erstellen
        const file = new File([JSON.stringify({ ping: true })], 'ping.json', {
            type: 'application/json',
        });
        const data = mockData([file]);
        const dropzone = renderedComp.getByTestId('dropzone');
        fireEvent.dragEnter(dropzone, data);
        fireEvent.drop(dropzone, data);

        const element = await screen.findByText('ping.json');
        expect(element).toBeTruthy()
    });


    function mockData(files) {
        return {
            dataTransfer: {
                files,
                items: files.map((file) => ({
                    kind: 'file',
                    type: file.type,
                    getAsFile: () => file,
                })),
                types: ['Files'],
            },
        };
    }
});
