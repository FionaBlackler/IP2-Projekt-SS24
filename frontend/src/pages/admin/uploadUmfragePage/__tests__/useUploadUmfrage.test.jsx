// src/pages/admin/uploadUmfragePage/__tests__/useUploadUmfrage.test.jsx

import { useUploadPoll } from '../hooks/useUploadUmfrage.jsx';
import axios from 'axios';
import { vi } from 'vitest';

// Mock localStorage
const mockLocalStorage = {
    getItem: vi.fn(),
};

global.localStorage = mockLocalStorage;

// Mock axios
vi.mock('axios');

describe('useUploadPoll', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should handle successful upload', async () => {
        const mockJson = '{"umfrage": {"title": "Test Umfrage"}}';
        const mockResponseData = {
            umfrage_id: '123456',
        };
        const mockAccessToken = 'mockAccessToken';

        mockLocalStorage.getItem.mockReturnValue(mockAccessToken);
        axios.post.mockResolvedValueOnce({ status: 201, data: mockResponseData });

        const { pollStatus } = useUploadPoll(mockJson);

        expect(pollStatus.state).toBe('initial'); // Initialer Status

        await pollStatus.fetchUmfrage();

        expect(pollStatus.state).toBe('finished');
        expect(pollStatus.info).toBe('Umfrage erfolgreich hinzugefügt! ID: 123456');
    });

    test('should handle JSON parse error', async () => {
        const mockJson = '{"invalid": "json"}';

        const { pollStatus } = useUploadPoll(mockJson);

        expect(pollStatus.state).toBe('initial');

        await pollStatus.fetchUmfrage();

        expect(pollStatus.state).toBe('error');
        expect(pollStatus.info).toBe('Datei enthält kein JSON');
    });

    test('should handle server error 404', async () => {
        const mockJson = '{"umfrage": {"title": "Test Umfrage"}}';

        mockLocalStorage.getItem.mockReturnValue('mockAccessToken');
        axios.post.mockRejectedValueOnce({ response: { status: 404 } });

        const { pollStatus } = useUploadPoll(mockJson);

        expect(pollStatus.state).toBe('initial');

        await pollStatus.fetchUmfrage();

        expect(pollStatus.state).toBe('error');
        expect(pollStatus.info).toBe('Administrator nicht gefunden');
    });

    // Weitere Tests für andere Fehlerfälle können hinzugefügt werden
});
