import HistoryItem from './HistoryItem';

export default function HistoryList({ history }) {
  if (!history.length) return null;
  return (
    <section className="history-section">
      <h2>Recent Uploads</h2>
      <ul className="history-list">
        {history.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
