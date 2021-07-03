export function checkSimpleType(a: unknown): boolean {
  return [ 'number', 'string', 'boolean' ].includes(typeof a) || a === null || a === undefined;
}

export function compareObjects<T>(a: T, b: T): boolean {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (const key in b) {
    if (!(key in a)) {
      return false;
    }

    if (typeof a[key as keyof T] !== typeof b[key as keyof T]) {
      return false;
    }

    if (checkSimpleType(a[key as keyof T]) || checkSimpleType(b[key as keyof T])) {
      if (a[key as keyof T] !== b[key as keyof T]) {
        return false;
      } else {
        continue;
      }
    }

    if (typeof a[key as keyof T] === 'function' && typeof b[key as keyof T] === 'function') {
      // @ts-ignore
      if (a[key as keyof T].toString() !== b[key as keyof T].toString()) {
        return false;
      } else {
        continue;
      }
    }

    if (!compareObjects(a[key as keyof T], b[key as keyof T])) {
      return false;
    }
  }

  return true;
}
