export function toggleSet<T>(set: Set<T>, item: T) {
  if (set.has(item)) {
    set.delete(item);
  } else {
    set.add(item);
  }

  return set;
}

export function toggleSetImmutable<T>(set: Set<T>, item: T) {
  return toggleSet(new Set(set), item);
}