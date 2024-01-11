/**
 * Toggles the presence of an item in a set.
 * Returns and modifies the original set.
 */
export function toggleSet<T>(set: Set<T>, item: T) {
  if (set.has(item)) {
    set.delete(item);
  } else {
    set.add(item);
  }

  return set;
}

/**
 * Toggles the presence of an item in a set.
 * Returns a new set.
 */
export function toggleSetImmutable<T>(set: Set<T>, item: T) {
  return toggleSet(structuredClone(set), item);
}
