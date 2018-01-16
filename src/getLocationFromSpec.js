import { createObject } from './utils'

const getRouteFromSpec = (routes, spec) =>
  routes.find(route => route.key === spec.route)

const getParamValuesFromSpec = (route, spec) =>
  Object.values(route.params)
    .filter(({ key }) => key in spec.params)
    .map(({ key, name, stringify }) => [name, stringify(spec.params[key])])
    .reduce(createObject, {})

export default (routes, location, spec) => {
  const route = getRouteFromSpec(routes, spec)

  if (route !== undefined) {
    const paramValues = getParamValuesFromSpec(route, spec)
    const newLocation = route.getLocation(paramValues, location)

    return newLocation
  } else {
    return location
  }
}
