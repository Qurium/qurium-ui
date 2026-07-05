import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom'

import { paths } from '@/config/paths'

const convert = (module: { default: () => React.ReactNode }) => ({
  Component: module.default,
})

const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.home.path,
      loader: () => redirect(paths.app.schema.path),
    },
    {
      path: paths.app.root.path,
      lazy: () => import('./routes/app/root').then(convert),
      children: [
        {
          index: true,
          loader: () => redirect(paths.app.schema.path),
        },
        {
          path: paths.app.schema.path,
          lazy: () => import('./routes/app/schema').then(convert),
        },
        {
          path: paths.app.query.path,
          lazy: () => import('./routes/app/query').then(convert),
        },
        {
          path: paths.app.connections.path,
          lazy: () => import('./routes/app/connections').then(convert),
        },
        {
          path: paths.app.newConnection.path,
          lazy: () => import('./routes/app/new-connection').then(convert),
        },
        {
          path: paths.app.history.path,
          lazy: () => import('./routes/app/history').then(convert),
        },
      ],
    },
    {
      path: '*',
      lazy: () => import('./routes/not-found').then(convert),
    },
  ])

export const AppRouter = () => {
  const router = createAppRouter()
  return <RouterProvider router={router} />
}
