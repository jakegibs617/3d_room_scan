import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

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
