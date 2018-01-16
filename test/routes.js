import { createRoutes } from 'redux-routable'

export default createRoutes([
  {
    key: 'home',
    path: '/',
  },
  {
    key: 'user',
    path: '/user/:user_id',
    params: {
      userId: {
        name: 'user_id',
        parse: id => Number(id),
        stringify: id => String(id),
      },
    },
  },
  {
    key: 'users',
    path: '/users/:role?',
    params: {
      role: {
        name: 'role',
      },
      nameQuery: {
        name: 'name_query',
      },
    },
  },
])
