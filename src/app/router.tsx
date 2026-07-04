import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { paths } from '@/config/paths'

const convert = (module: { default: () => React.ReactNode }) => ({
  Component: module.default,
})

const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: () => import('./routes/landing').then(convert),
    },
    {
      path: paths.auth.login.path,
      lazy: () => import('./routes/auth/login').then(convert),
    },
    {
      path: paths.auth.register.path,
      lazy: () => import('./routes/auth/register').then(convert),
    },
    {
      path: paths.app.root.path,
      lazy: () => import('./routes/app/root').then(convert),
      children: [
        {
          path: paths.app.dashboard.path,
          lazy: () => import('./routes/app/dashboard').then(convert),
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
