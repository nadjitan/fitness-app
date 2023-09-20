/**
 * Compares 2 objects wether they are the same or not.
 *
 * @param obj1
 * @param obj2
 * @returns boolean
 */
export function deepCompare<T, U, V extends T & U>(obj1: V, obj2: V): boolean {
  if (obj1 === obj2) return true

  if (!obj1 || !obj2) return false

  if (typeof obj1 !== typeof obj2) return false

  // If the objects are not both objects, compare their values directly
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return obj1 === obj2

  // If the objects have different numbers of properties, return false
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false

  // Recursively compare the values of each property
  for (const prop in obj1) {
    if (!deepCompare(obj1[prop], obj2[prop])) return false
  }

  return true
}
