import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
const mockPlayer = { setVolume: jest.fn(), mute: jest.fn(), unMute: jest.fn(), playVideo: jest.fn(), pauseVideo: jest.fn(), loadVideoById: jest.fn(), cueVideoById: jest.fn() };
jest.mock('react-youtube', () => function MockYouTube({ onReady, onStateChange, onError, videoId }) {
  const React = require('react');
  React.useEffect(() => { onReady({ target: mockPlayer }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <div data-testid="youtube-player" data-video-id={videoId}><button onClick={() => onStateChange({ data: 1 })}>Simulate playback</button><button onClick={() => onError({data:100})}>Simulate missing video</button></div>;
});
jest.mock('./components/VideoCall/VideoCall', () => () => null);
jest.mock('./components/PromoVideo/PromoVideo', () => () => null);
beforeEach(() => { localStorage.clear(); jest.clearAllMocks(); });
afterEach(() => { jest.useRealTimers(); });
test('timer continues while closed, and Escape restores focus', () => {
  jest.useFakeTimers(); render(<App />);
  const trigger = screen.getByRole('button', { name: 'Pomodoro Timer' });
  trigger.focus(); fireEvent.click(trigger);
  let dialog = screen.getByRole('dialog', { name: 'Pomodoro Timer' });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Start' }));
  fireEvent.keyDown(within(dialog).getByRole('button', { name: 'Pause' }), { key: 'Escape' });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(trigger).toHaveFocus();
  act(() => jest.advanceTimersByTime(1000)); fireEvent.click(trigger);
  dialog = screen.getByRole('dialog', { name: 'Pomodoro Timer' });
  expect(within(dialog).getByText('24:59')).toBeInTheDocument();
});
test('dialog traps keyboard focus', () => {
  render(<App />); fireEvent.click(screen.getByRole('button', { name: 'Todo List' }));
  const dialog = screen.getByRole('dialog', { name: 'Todo List' });
  const close = within(dialog).getByRole('button', { name: 'Close Todo List' });
  const last = within(dialog).getByRole('button', { name: 'Completed' });
  expect(close).toHaveFocus(); fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
  expect(last).toHaveFocus(); fireEvent.keyDown(last, { key: 'Tab' }); expect(close).toHaveFocus();
});
test('corrupted tasks recover and new tasks persist', () => {
  localStorage.setItem('mindchill-todos', '{broken'); render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Todo List' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'New task' }), { target: { value: 'Read a chapter' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add task' }));
  expect(JSON.parse(localStorage.getItem('mindchill-todos'))[0].text).toBe('Read a chapter');
});
test('saved preferences restore and station changes persist', () => {
  localStorage.setItem('mindchill-volume', '72'); localStorage.setItem('mindchill-stream', '1');
  render(<MusicPlayer autoPlay={false} showSettingsInitially />);
  expect(screen.getByRole('slider', { name: 'Volume' })).toHaveValue('72');
  expect(screen.getByRole('button', { name: 'Resonance' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Jazz Vibes' })); expect(localStorage.getItem('mindchill-stream')).toBe('2');
});
test('invalid preferences use safe defaults', () => {
  localStorage.setItem('mindchill-stream', '100'); localStorage.setItem('mindchill-volume', '"loud"');
  render(<MusicPlayer autoPlay={false} showSettingsInitially />);
  expect(screen.getByRole('slider', { name: 'Volume' })).toHaveValue('50');
  expect(screen.getByRole('button', { name: 'I Have No Enemies' })).toHaveAttribute('aria-pressed', 'true');
});
test('player waits for start then pauses even with autoplay enabled', () => {
  const { rerender } = render(<MusicPlayer autoPlay={false} />); expect(mockPlayer.playVideo).not.toHaveBeenCalled();
  rerender(<MusicPlayer autoPlay />); expect(mockPlayer.playVideo).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByText('Simulate playback'));
  fireEvent.click(screen.getByTitle('Pause')); expect(mockPlayer.pauseVideo).toHaveBeenCalledTimes(1);
});

test('custom workspace presets restore scene, station and volume', () => {
  render(<MusicPlayer autoPlay={false} showSettingsInitially />);
  fireEvent.click(screen.getByRole('button', { name: 'Jazz Vibes', exact: true }));
  fireEvent.change(screen.getByRole('slider', { name: 'Volume' }), { target: {value: '73'} });
  fireEvent.click(screen.getByRole('button', { name: 'Cozy Room', exact: true }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Preset name' }), { target: {value:'My reading corner'} });
  fireEvent.click(screen.getByRole('button', {name:'Save', exact:true}));
  fireEvent.click(screen.getByRole('button', {name:/Rainy day reading/}));
  expect(screen.getByRole('slider', {name:'Volume'})).toHaveValue('35');
  fireEvent.click(screen.getByRole('button', {name:'My reading corner',exact:true}));
  expect(screen.getByRole('slider', {name:'Volume'})).toHaveValue('73');
  expect(screen.getByRole('button', {name:'Jazz Vibes',exact:true})).toHaveAttribute('aria-pressed','true');
  expect(screen.getByRole('button', {name:'Cozy Room',exact:true})).toHaveAttribute('aria-pressed','true');
  expect(JSON.parse(localStorage.getItem('mindchill-presets'))[0].name).toBe('My reading corner');
});

test('focus details stay in the panel and personalization persists', () => {
  render(<App />);
  expect(screen.queryByLabelText('ONE THING FOR TODAY')).not.toBeVisible();
  fireEvent.click(screen.getByRole('button', {name:'Pomodoro Timer'}));
  fireEvent.change(screen.getByLabelText('ONE THING FOR TODAY'), {target:{value:'Finish my sketch'}});
  fireEvent.click(screen.getByRole('button', {name:'Close Pomodoro Timer'}));
  fireEvent.click(screen.getByRole('button', {name:'Personalize workspace'}));
  fireEvent.change(screen.getByLabelText('What should we call you?'), {target:{value:'Sam'}});
  fireEvent.change(screen.getByRole('combobox', {name:/Daily focus goal/}), {target:{value:'30'}});
  fireEvent.click(screen.getByRole('button', {name:'rose',exact:true}));
  expect(screen.getByRole('heading', {name:'Sam’s quiet corner.'})).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {name:'Close Personalize workspace'}));
  expect(screen.queryByRole('progressbar', {name:'Daily focus goal'})).not.toBeInTheDocument();
  expect(localStorage.getItem('mindchill-theme')).toBe('"rose"');
  expect(localStorage.getItem('mindchill-intention')).toBe('"Finish my sketch"');
});

test('an explicit animated scene choice overrides reduced motion', () => {
  const original = window.matchMedia;
  window.matchMedia = () => ({matches:true, addEventListener:jest.fn(), removeEventListener:jest.fn()});
  try {
    render(<MusicPlayer autoPlay={false} showSettingsInitially />);
    expect(screen.queryByAltText('')).toBeNull();
    fireEvent.click(screen.getByRole('button', {name:'Rainy Window',exact:true}));
    expect(screen.queryByAltText('')).toHaveAttribute('src','https://media.giphy.com/media/13EgsbsNCLHXJm/giphy.gif');
    expect(screen.getByRole('checkbox', {name:'Still scene'})).not.toBeChecked();
  } finally { window.matchMedia = original; }
});

test('genre filters select the new music sources', () => {
  render(<MusicPlayer autoPlay={false} showSettingsInitially />);
  fireEvent.click(screen.getByRole('button',{name:'Piano genre'}));
  expect(screen.queryByRole('button',{name:'Resonance',exact:true})).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Peaceful Piano',exact:true}));
  expect(mockPlayer.loadVideoById).toHaveBeenLastCalledWith('HhEB7UpYbyw');
  fireEvent.click(screen.getByRole('button',{name:'Ambient genre'}));
  fireEvent.click(screen.getByRole('button',{name:'Ambient Drift',exact:true}));
  expect(mockPlayer.loadVideoById).toHaveBeenLastCalledWith('OlaTeXX3uH8');
});

test('Resonance uses its replacement source without recreating the player', () => {
  render(<MusicPlayer autoPlay={false} showSettingsInitially />);
  fireEvent.click(screen.getByRole('button',{name:'Resonance',exact:true}));
  expect(mockPlayer.loadVideoById).toHaveBeenLastCalledWith('8GW6sLrK40k');
  expect(screen.getByTestId('youtube-player')).toHaveAttribute('data-video-id','12ha6PMB1PE');
  expect(screen.getByRole('link',{name:/Current source/})).toHaveAttribute('href','https://www.youtube.com/watch?v=8GW6sLrK40k');
});

test('removed backdrop preferences and presets migrate without losing saved corners', () => {
  localStorage.setItem('mindchill-backdrop','6');
  localStorage.setItem('mindchill-presets',JSON.stringify([{id:'old',name:'My corner',stream:1,backdrop:6,volume:30,muted:false,still:false}]));
  render(<MusicPlayer autoPlay={false} showSettingsInitially />);
  expect(screen.queryByRole('button',{name:'ChineseCat'})).not.toBeInTheDocument();
  expect(localStorage.getItem('mindchill-backdrop')).toBe('0');
  fireEvent.click(screen.getByRole('button',{name:'My corner',exact:true}));
  expect(screen.getByRole('button',{name:'Rainy Window',exact:true})).toHaveAttribute('aria-pressed','true');
  expect(JSON.parse(localStorage.getItem('mindchill-presets'))).toHaveLength(1);
  expect(JSON.parse(localStorage.getItem('mindchill-presets'))[0].backdrop).toBe(0);
});

test('unavailable music can be retried and switching clears the error', () => {
  render(<MusicPlayer autoPlay showSettingsInitially />);
  fireEvent.click(screen.getByText('Simulate missing video'));
  expect(screen.getByRole('status')).toHaveTextContent('no longer available');
  fireEvent.click(screen.getByRole('button',{name:'Retry playback'}));
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('Simulate missing video'));
  fireEvent.click(screen.getByRole('button',{name:'Next station',exact:true}));
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(mockPlayer.loadVideoById).toHaveBeenLastCalledWith('8GW6sLrK40k');
});

test('scratchpad notes survive closing and reopening the app', () => {
  const {unmount} = render(<App />);
  fireEvent.click(screen.getByRole('button',{name:'Scratchpad',exact:true}));
  fireEvent.change(screen.getByRole('textbox',{name:'Scratchpad notes'}),{target:{value:'Return to chapter three after this session.'}});
  expect(localStorage.getItem('mindchill-scratchpad')).toBe('"Return to chapter three after this session."');
  unmount();
  render(<App />);
  fireEvent.click(screen.getByRole('button',{name:'Scratchpad',exact:true}));
  expect(screen.getByRole('textbox',{name:'Scratchpad notes'})).toHaveValue('Return to chapter three after this session.');
});

test('an active task becomes the focus intention without starting a session', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button',{name:'Todo List'}));
  fireEvent.change(screen.getByRole('textbox',{name:'New task'}),{target:{value:'Write the introduction'}});
  fireEvent.click(screen.getByRole('button',{name:'Add task'}));
  fireEvent.click(screen.getByRole('button',{name:'Focus on Write the introduction'}));
  const dialog = screen.getByRole('dialog',{name:'Pomodoro Timer'});
  expect(within(dialog).getByLabelText('ONE THING FOR TODAY')).toHaveValue('Write the introduction');
  expect(within(dialog).getByRole('button',{name:'Start',exact:true})).toBeInTheDocument();
  expect(screen.queryByRole('dialog',{name:'Todo List'})).not.toBeInTheDocument();
});

test('a third-party player exception shows recovery controls without crashing', () => {
  render(<MusicPlayer autoPlay={false} />);
  mockPlayer.playVideo.mockImplementationOnce(() => {throw new Error('Player disconnected');});
  fireEvent.click(screen.getByRole('button',{name:'Play',exact:true}));
  expect(screen.getByRole('status')).toHaveTextContent('music could not load');
  expect(screen.getByRole('button',{name:'Retry playback'})).toBeInTheDocument();
});
