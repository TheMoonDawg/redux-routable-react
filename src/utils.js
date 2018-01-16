export const locationsEqual = (locationA, locationB) =>
  locationA.pathname === locationB.pathname &&
  locationA.search === locationB.search &&
  locationA.hash === locationB.hash

export const createObject = (object, [key, value]) => {
  object[key] = value
  return object
}
