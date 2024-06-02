import {it, expect, describe, beforeAll} from "vitest";
import {render, RenderResult, cleanup, within} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from '@testing-library/user-event';
import UploadUmfrage from '../UploadUmfrage.jsx'
import '@testing-library/jest-dom';
import React from "react";


describe("Check dropbox basics", () => {
    let renderedComp;
    beforeAll( () => {
        cleanup();
        renderedComp = render(<UploadUmfrage/>);
    });
    it("Is dropbox visible", () => {
        const dropzone = renderedComp.getByText("Ziehen Sie Ihre konfigurierte Umfrage herein oder klicken Sie in den Bereich.")
        expect(dropzone).toBeInTheDocument()
    });
    it("Upload not working simple JSON", async () => {
        const mockJsonContent = '{"umfrage": {"titel": "Test Umfrage", "beschreibung": "Test Beschreibung"}}';

        // Render the component
        render(<UploadUmfrage />);

        // Find the dropzone element
        const dropzone = screen.getByText('Ziehen Sie Ihre konfigurierte Umfrage herein oder klicken Sie in den Bereich.');

        // Trigger file upload
        await userEvent.upload(dropzone, new File([mockJsonContent], 'test.json', {type: 'application/json'}));

        // Wait for validation result
        await waitFor(() => {
            expect(screen.getByText('JSON enthält fehler')).toBeInTheDocument();
        });
    })

});