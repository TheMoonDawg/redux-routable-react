const getRouteFromSpec = (routes, spec) =>
  routes.find(route => route.key === spec.route)

const getParamValuesFromSpec = (route, spec) =>
  Object.values(route.params)
    .filter(({ key }) => key in spec.params)
    .map(({ key, name, stringify }) => ({
      [name]: stringify(spec.params[key]),
    }))
    .reduce((a, b) => Object.assign(a, b), {})

export default (routes, location, spec) => {
  const route = getRouteFromSpec(routes, spec)

  if (route !== undefined) {
    const paramValues = getParamValuesFromSpec(route, spec)
    const newLocation = route.getLocation(paramValues, location)

    return { ...location, ...newLocation }
  } else {
    return location
  }
}
