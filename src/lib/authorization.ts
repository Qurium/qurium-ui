import { useMemo } from 'react'

import { useUser } from '@/features/auth/api/get-user'
import type { Role } from '@/types/api'

export const POLICIES = {
  'settings:manage': 'settings:manage',
} as const

export type Policy = (typeof POLICIES)[keyof typeof POLICIES]

/**
 * Permission-based access control (PBAC): each policy inspects the role
 * (and optionally the resource) to decide access, so new rules don't
 * require touching every call site that checks a role directly.
 */
export const policies = {
  [POLICIES['settings:manage']]: (user: { role: Role }) =>
    user.role === 'ADMIN',
} satisfies Record<Policy, (user: { role: Role }) => boolean>

export const useAuthorization = () => {
  const user = useUser().data

  if (!user) {
    throw new Error('User does not exist')
  }

  const checkAccess = useMemo(
    () => ({
      hasRole: (allowedRoles: Role[]) => allowedRoles.includes(user.role),
      hasPolicy: (policy: Policy) => policies[policy](user),
    }),
    [user],
  )

  return checkAccess
}

type AuthorizationProps = {
  forbiddenFallback?: React.ReactNode
  children: React.ReactNode
} & (
  | { allowedRoles: Role[]; policyCheck?: never }
  | { allowedRoles?: never; policyCheck: Policy }
)

export const Authorization = ({
  policyCheck,
  allowedRoles,
  forbiddenFallback = null,
  children,
}: AuthorizationProps) => {
  const { hasPolicy, hasRole } = useAuthorization()

  let canAccess = false

  if (allowedRoles) {
    canAccess = hasRole(allowedRoles)
  } else if (policyCheck) {
    canAccess = hasPolicy(policyCheck)
  }

  return canAccess ? children : forbiddenFallback
}
