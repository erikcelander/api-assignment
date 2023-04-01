export function generateResourceLinks(resource: string, id: string, type: 'single' | 'all' | 'create' | 'addExercise' | 'partialUpdate' | 'update' | 'delete' | 'login' | 'register') {
  const links = []

  if (type === 'single' || type === 'update' || type === 'delete') {
    links.push(
      {
        rel: 'self',
        href: `/api/v1/${resource}s/${id}`,
        method: 'GET',
      },
      {
        rel: 'update',
        href: `/api/v1/${resource}s/${id}`,
        method: 'PUT',
      },
      {
        rel: 'delete',
        href: `/api/v1/${resource}s/${id}`,
        method: 'DELETE',
      }
    )
  }

  if (resource !== 'auth' && (type === 'all' || type === 'create')) {
    links.push({
      rel: 'create',
      href: `/api/v1/${resource}s`,
      method: 'POST',
    })
  }

  if (resource === 'workout' && type === 'addExercise') {
    links.push({
      rel: 'addExercise',
      href: `/api/v1/${resource}s/${id}`,
      method: 'POST',
    })
  }

  if (type === 'partialUpdate') {
    links.push({
      rel: 'partialUpdate',
      href: `/api/v1/${resource}s/${id}`,
      method: 'PATCH',
    })
  }

  if (resource === 'auth' && type === 'all') {
    links.push({
      rel: 'login',
      href: `/api/v1/${resource}/login`,
      method: 'POST',
    }, {
      rel: 'register',
      href: `/api/v1/${resource}/register`,
      method: 'POST',
    })
  }

  if (resource === 'auth' && (type === 'login' || type === 'register')) {
    links.push({
      rel: `${type}`,
      href: `/api/v1/${resource}/${type}`,
      method: 'POST',
    })
  }

  return links
}