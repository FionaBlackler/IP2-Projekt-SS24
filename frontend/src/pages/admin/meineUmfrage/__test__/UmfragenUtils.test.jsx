import axiosInstance from '../../../../axios/axiosConfig.js'
import MockAdapter from 'axios-mock-adapter';
import { umfragenArchivieren, umfragenLöschen, checkData, handleCheckboxChange } from '../UmfragenUtils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('UmfragenUtils', () => {
  let mock;
  let getData;
  let setData;
  let setSelectedIds;
  let selectedIds;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
    getData = { umfragen: [{ id: 1 }, { id: 2 }, { id: 3 }] };
    setData = vi.fn();
    setSelectedIds = vi.fn();
    selectedIds = [1, 2];
    localStorage.setItem('accessToken', 'test-token');
  });

  afterEach(() => {
    mock.reset();
  });

  it('sollte Umfragen archivieren', async () => {
    mock.onGet(`/umfrage/archive/1`).reply(200);
    mock.onGet(`/umfrage/archive/2`).reply(200);

    await umfragenArchivieren(selectedIds, setSelectedIds, getData, setData);

    await new Promise(process.nextTick);

    expect(setData).toHaveBeenCalledWith({ umfragen: [{ id: 3 }] });
    expect(mock.history.get.length).toBe(2);
    expect(mock.history.get[0].url).toBe(`/umfrage/archive/1`);
    expect(mock.history.get[1].url).toBe(`/umfrage/archive/2`);

    expect(setSelectedIds).toHaveBeenCalledWith([]);
  });

  it('sollte Umfragen löschen', async () => {
    mock.onDelete(`/umfrage/delete/1`).reply(200);
    mock.onDelete(`/umfrage/delete/2`).reply(200);

    await umfragenLöschen(selectedIds, setSelectedIds, getData, setData);

    await new Promise(process.nextTick);

    expect(setData).toHaveBeenCalledWith({ umfragen: [{ id: 3 }] });

    expect(mock.history.delete.length).toBe(2);
    expect(mock.history.delete[0].url).toBe(`/umfrage/delete/1`);
    expect(mock.history.delete[1].url).toBe(`/umfrage/delete/2`);

    expect(setSelectedIds).toHaveBeenCalledWith([]);
  });

  it('Überprüfe checkData', () => {

    const data = { umfragen: [{ id: 1, archivierungsdatum: null }, { id: 2, archivierungsdatum: null  }, { id: 3, archivierungsdatum: "2024-06-22 00:00:00.000000"  }] };
    
    const result = checkData('umfragen', data);
    expect(result).toBe(true);

    const result2 = checkData('archive', data);
    expect(result2).toBe(true);

    
    const data2 = { umfragen: [{ id: 1, archivierungsdatum: null }, { id: 2, archivierungsdatum: null  }, { id: 3, archivierungsdatum: null  }] };
    
    const result3 = checkData('umfragen', data2);
    expect(result3).toBe(true);

    const result4 = checkData('archive', data2);
    expect(result4).toBe(false);

    const data3 = { umfragen: [{ id: 1, archivierungsdatum: "2024-06-22 00:00:00.000000" }, { id: 2, archivierungsdatum: "2024-06-22 00:00:00.000000"  }, { id: 3, archivierungsdatum: "2024-06-22 00:00:00.000000"  }] };
    
    const result5 = checkData('umfragen', data3);
    expect(result5).toBe(false);

    const result6 = checkData('archive', data3);
    expect(result6).toBe(true);

  });

  it('Füge ID in die selectedIds hinzu ', () => {
    const id = 1;
    const selectedIds = [];
    const setSelectedIds = vi.fn(); 

    const event = { target: { checked: true } };
    handleCheckboxChange(event, id, selectedIds, setSelectedIds);

    expect(setSelectedIds).toHaveBeenCalledWith([id]);
});

it('Entferne ID von der selectedIds', () => {
    const id = 1;
    const selectedIds = [1, 2, 3];
    const setSelectedIds = vi.fn(); 

    const event = { target: { checked: false } };
    handleCheckboxChange(event, id, selectedIds, setSelectedIds);

    expect(setSelectedIds).toHaveBeenCalledWith([2, 3]); 
});
});
