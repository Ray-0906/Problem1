export default function SuggestionPanel() {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Tree Suggestions for {suggestionData.location}</h2>
        {suggestionData.suggestions.map((item, i) => (
          <div key={i} className="border p-3 rounded shadow">
            <h3 className="font-bold">{item.tree}</h3>
            <p><strong>Reason:</strong> {item.reasons}</p>
            <p><strong>Growth:</strong> {item.growthTime}</p>
            <p><strong>Benefits:</strong> {item.benefits}</p>
          </div>
        ))}
      </div>
    );
  }
  