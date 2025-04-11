import { useState } from 'react';

export default function LogPlantForm() {
  const [form, setForm] = useState({ species: '', lat: '', lng: '', notes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logged plant:", form);
    // To-do: Save to backend or local state
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input placeholder="Plant Species" value={form.species} onChange={e => setForm({ ...form, species: e.target.value })} />
      <input placeholder="Latitude" value={form.lat} onChange={e => setForm({ ...form, lat: e.target.value })} />
      <input placeholder="Longitude" value={form.lng} onChange={e => setForm({ ...form, lng: e.target.value })} />
      <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      <button type="submit">Log Plant</button>
    </form>
  );
}
