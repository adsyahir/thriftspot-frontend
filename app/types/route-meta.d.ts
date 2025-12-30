/**
 * Extend Nuxt's route meta types to include permission properties
 */
declare module '#app' {
  interface PageMeta {
    /**
     * Single permission required to access the page
     * @example
     * definePageMeta({
     *   permission: 'manage roles'
     * })
     */
    permission?: string

    /**
     * Multiple permissions required to access the page
     * Use with permissionOperator to define AND/OR logic
     * @example
     * definePageMeta({
     *   permissions: ['view roles', 'edit roles'],
     *   permissionOperator: 'AND' // User must have BOTH permissions
     * })
     */
    permissions?: string[]

    /**
     * Operator for multiple permissions check
     * - 'AND': User must have ALL permissions (default)
     * - 'OR': User must have AT LEAST ONE permission
     * @default 'AND'
     */
    permissionOperator?: 'AND' | 'OR'
  }
}

export {}
