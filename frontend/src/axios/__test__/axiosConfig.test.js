import { assert } from 'chai';
import axiosInstance from '../axiosConfig';
import MockAdapter from 'axios-mock-adapter';

describe('Axios Interceptors', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
    localStorage.setItem('accessToken', 'test-token');
    global.window = { location: { href: '' } };
  });

  afterEach(() => {
    mock.restore();
    localStorage.clear();
  });

  it('sollte den Autorisierungs-Header korrekt setzen', async () => {
    mock.onGet('/test').reply(200);

    await axiosInstance.get('/test');

    assert.equal(mock.history.get[0].headers.Authorization, 'Bearer test-token');
  });

  it('sollte accessToken entfernen und bei 404-Fehlern nach login umleiten', async () => {
    mock.onGet('/false-address').reply(404);

    try {
      await axiosInstance.get('/false-address');
    } catch (error) {
      assert.isNull(localStorage.getItem('accessToken'));
      assert.equal(window.location.href, '/login');
    }
  });
  it('sollte accessToken entfernen und bei 401-Fehlern nach login umleiten', async () => {
    mock.onGet('/false-address').reply(401);

    try {
      await axiosInstance.get('/false-address');
    } catch (error) {
      assert.isNull(localStorage.getItem('accessToken'));
      assert.equal(window.location.href, '/login');
    }
  });
});
