import { useState } from 'react';
import { Download, NotebookPen } from 'lucide-react';
import useStoredState from '../useStoredState';
import './Scratchpad.css';

export default function Scratchpad() {
  const [notes, setNotes] = useStoredState('mindchill-scratchpad', '', value => typeof value === 'string' && value.length <= 20000);
  const [message, setMessage] = useState('');
  const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const download = () => {
    const url = URL.createObjectURL(new Blob([notes], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-focus-notes.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Your notes are ready to download.');
  };
  return <section className="scratchpad-panel glass-card">
    <div className="panel-heading"><span className="eyebrow">LET THE THOUGHT OUT</span><h2>A place for loose ends.</h2><p>Capture an idea. Park a distraction. Get back to your flow.</p></div>
    <label className="scratchpad-label" htmlFor="scratchpad-notes"><NotebookPen size={15} /> Your scratchpad</label>
    <textarea id="scratchpad-notes" aria-label="Scratchpad notes" value={notes} maxLength={20000} onChange={event => { setNotes(event.target.value); setMessage(''); }} placeholder="Ideas, reminders, things to come back to…" spellCheck />
    <div className="scratchpad-footer"><span>{words} {words === 1 ? 'word' : 'words'} · saved on this device</span><button className="secondary-action" disabled={!notes.trim()} onClick={download}><Download size={14} />Export notes</button></div>
    {message && <p className="panel-footnote" role="status">{message}</p>}
  </section>;
}
