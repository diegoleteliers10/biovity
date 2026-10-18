const test = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const path = require('node:path')

test('admin verification queue shows each request age from its creation time', () => {
  const createdAt = '2026-10-09T12:00:00.000Z'
  const run = spawnSync(process.execPath, ['-e', `
    require('./tests/register-ts.cjs')
    const Module = require('node:module')
    const load = Module._load
    Module._load = function(name, ...args) {
      if (name === '@tanstack/react-query') return {
        useQueryClient: () => ({ invalidateQueries: async () => {} }),
        useQuery: () => ({ data: { isOk: () => true, isErr: () => false, value: [{ id: 'request-1', organizationId: 'org-1', organizationName: 'Bio Lab', legalName: 'Bio Lab SpA', countryCode: 'CL', registrationNumber: '76.123.456-7', registryUrl: 'https://registro.example/1', status: 'pending', createdAt: '${createdAt}', ownerEmail: 'owner@biolab.cl', website: 'https://biolab.cl', readiness: { ready: true, corporateEmailVerified: true, profileComplete: true, missingProfileFields: [] } }] }, isLoading: false }),
        useMutation: () => ({ isPending: false, mutate: () => {} }),
      }
      if (name === '@/components/ui/button') return { Button: ({children, ...props}) => require('react').createElement('button', props, children) }
      if (name === '@/components/ui/input') return { Input: (props) => require('react').createElement('input', props) }
      if (name === '@/lib/api/organizations') return { listOrganizationVerificationRequests: async () => {}, reviewOrganizationVerification: async () => {} }
      if (name === '@/lib/utils') return { formatFechaRelativa: (date) => date === '${createdAt}' ? 'hace 2 días' : 'fecha inesperada' }
      return load.call(this, name, ...args)
    }
    const React = require('react')
    const { renderToStaticMarkup } = require('react-dom/server')
    const { AdminOrganizationVerificationQueue } = require('./components/dashboard/admin/AdminOrganizationVerificationQueue.tsx')
    process.stdout.write(renderToStaticMarkup(React.createElement(AdminOrganizationVerificationQueue)))
  `], {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8',
  })

  assert.equal(run.status, 0, run.stderr)
  assert.match(run.stdout, new RegExp(`<time[^>]*dateTime="${createdAt}"[^>]*>Recibida hace 2 días</time>`))
})
