function FavoriteButton({ isFavorite, onToggle, teamName }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`${isFavorite ? "Remove favorite" : "Add favorite"}: ${teamName}`}
      aria-pressed={isFavorite}
      title={teamName}
      className={`rounded-lg px-3 py-2 text-lg transition ${
        isFavorite
          ? "bg-amber-100 text-amber-600"
          : "bg-slate-100 text-slate-500 hover:bg-amber-50"
      }`}
    >
      {isFavorite ? "★" : "☆"}
    </button>
  );
}

export default FavoriteButton;
