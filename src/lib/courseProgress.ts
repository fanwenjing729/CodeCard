export interface ProgressCount {
  total: number;
  done: number;
  pct: number;
}

/** Count completed cards from a card list. `cards` only needs `id`. */
export function countCards(
  cards: { id: string }[],
  completedCards: Record<string, true>,
): ProgressCount {
  const total = cards.length;
  const done = cards.filter((c) => c.id in completedCards).length;
  return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

/** Count completed cards across all cards in a list of nodes. */
export function countNodeCards(
  nodes: { cards: { id: string }[] }[],
  completedCards: Record<string, true>,
): ProgressCount {
  return countCards(
    nodes.flatMap((n) => n.cards),
    completedCards,
  );
}
