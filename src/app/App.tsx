import { useRoutes } from 'react-router-dom'
import { routes } from './router/routes'

export function App() {
  return useRoutes(routes)
}
