export default function ErrorState({ msg, onRetry }: { msg?: string, onRetry: () => void }) {
  return (
    <div className="card p-6 text-center">
      <div className="text-red-600 font-semibold mb-2">Erreur de chargement</div>
      <div className="text-gray-600 mb-4">{msg ?? 'Une erreur est survenue.'}</div>
      <button className="btn" onClick={onRetry}>Réessayer</button>
    </div>
  )
}
