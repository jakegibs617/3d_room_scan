import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
});

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});

test('shows web fallback scan response', async () => {
  render(<App />);

  fireEvent.click(screen.getByText(/start bathroom scan/i));

  expect(
    await screen.findAllByText(/RoomPlan scanning is only available in the native iOS app/i)
  ).not.toHaveLength(0);
});

test('shows scanner availability status', async () => {
  render(<App />);

  expect(await screen.findByText(/scanner status/i)).toBeInTheDocument();
  expect(screen.getByText(/unavailable/i)).toBeInTheDocument();
  expect(screen.getByText(/RoomPlan scanning is only available in the native iOS app/i)).toBeInTheDocument();
});

test('persists recent scan responses', async () => {
  const storedScan = {
    success: true,
    message: 'Saved scan',
    jsonPath: '/Documents/RoomPlanScans/bathforge-scan.json',
    jsonUrl: 'capacitor://localhost/_capacitor_file_/RoomPlanScans/bathforge-scan.json',
    timestamp: '2026-05-25T21:00:00.000Z',
  };

  window.localStorage.setItem('bathforge:recent-scans', JSON.stringify([storedScan]));

  render(<App />);

  expect(await screen.findByRole('heading', { name: /recent scans/i })).toBeInTheDocument();
  expect(screen.getByText(/saved scan/i)).toBeInTheDocument();
  await waitFor(() => {
    expect(JSON.parse(window.localStorage.getItem('bathforge:recent-scans') ?? '[]')).toEqual([storedScan]);
  });

  fireEvent.click(screen.getByText(/clear recent scans/i));

  await waitFor(() => {
    expect(screen.queryByText(/saved scan/i)).toBeNull();
  });
  expect(window.localStorage.getItem('bathforge:recent-scans')).toBeNull();
});
