export function ResearchLog() {
    const logs = [
      { date: "2025-03-15", entry: "Confirmed new growth pattern of Sal tree." },
      { date: "2025-03-01", entry: "Documented spread of fungal infection in valley sector." },
    ];
  
    return (
      <ul className="list-disc pl-5 space-y-2">
        {logs.map((log, i) => (
          <li key={i}>
            <strong>{log.date}</strong>: {log.entry}
          </li>
        ))}
      </ul>
    );
  }
  