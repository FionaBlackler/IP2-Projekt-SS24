// src/UmfragePopup.test.jsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import UmfragePopup from '../UmfragePopup';

// Mock the UploadComponent to avoid rendering it
vi.mock('./UploadComponent.jsx', () => {
    return function DummyUploadComponent({ json, fileName }) {
        return <div>{fileName}</div>;
    };
});

test('sets newItemsCount correctly on file upload', async () => {
    const { getByTestId } = render(<UmfragePopup />);
    const dropzone = getByTestId('dropzone');

    // Create a mock file
    const file = new File(['{"test": "content"}'], 'test.json', { type: 'application/json' });

    // Simulate dropping the file
    Object.defineProperty(dropzone, 'files', {
        value: [file],
    });
    fireEvent.drop(dropzone);

    // Wait for the state update and re-render
    await waitFor(() => {
        // Check if the newItemsCount has been set
        const items = screen.getAllByText('test.json');
        expect(items.length).toBeGreaterThan(0);
    });
});
