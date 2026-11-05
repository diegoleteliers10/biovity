if (process.env.JOB_SEARCH_UX_BUN_TEST === '1') {
  const assert = require('node:assert/strict')
  const React = require('react')
  const { beforeEach, mock, test } = require('bun:test')
  const { renderToStaticMarkup } = require('react-dom/server')

  let state, result, updates, resetClick
  const setUrlState = (value) => updates.push(value)
  const defaults = () => ({ q: '', ubicacion: '', modalidad: '', formato: '', salarioMin: null, salarioMax: null, moneda: 'CLP', experiencia: '', categoria: null, orden: 'recientes', pagina: 1 })

  mock.module('nuqs', () => ({ useQueryStates: () => [state, setUrlState] }))
  mock.module('@/lib/api/use-jobs', () => ({ useJobsSearch: () => result }))
  mock.module('@/lib/api/jobs', () => ({ formatJobLocation: () => 'Santiago' }))
  mock.module('@/lib/parsers/trabajos', () => ({ trabajosParsers: {} }))
  mock.module('next/navigation', () => ({ useRouter: () => ({ push() {} }) }))
  mock.module('@/components/landing/trabajos/TrabajosSearchFilters', () => ({ TrabajosSearchFilters: () => null }))
  mock.module('@/components/landing/trabajos/SortSelect', () => ({ SortSelect: () => null }))
  mock.module('@/components/ui/button', () => ({
    Button: ({ children, onClick, ...props }) => {
      if (children === 'Limpiar filtros') resetClick = onClick
      return React.createElement('button', props, children)
    },
  }))

  const { TrabajosPageContent } = require('@/components/landing/trabajos/TrabajosPageContent.tsx')
  const render = () => renderToStaticMarkup(React.createElement(TrabajosPageContent))
  const emptyText = 'No se encontraron ofertas con los filtros seleccionados'
  const job = { id: 'job-1', title: 'Investigador', createdAt: '2026-01-01', location: { city: 'Santiago' }, organization: { name: 'Laboratorio' }, salary: { min: 0, max: 0, currency: 'CLP' }, benefits: [], description: '', category: 'biotech' }

  beforeEach(() => {
    state = defaults()
    result = { data: { data: [] } }
    updates = []
    resetClick = null
  })

  test('filtered API-empty response offers a clear-filter action', () => {
    state.q = 'sin resultados'
    const html = render()
    assert.match(html, new RegExp(emptyText))
    assert.match(html, /Limpiar filtros/)
    assert.doesNotMatch(html, /No hay ofertas publicadas/)
  })

  test('unfiltered empty board keeps its distinct published-jobs message', () => {
    const html = render()
    assert.match(html, /No hay ofertas publicadas/)
    assert.doesNotMatch(html, new RegExp(emptyText))
  })

  test('client-filtered empty results still expose reset', () => {
    state.ubicacion = 'Valparaíso'
    result = { data: { data: [job], total: 1 } }
    const html = render()
    assert.match(html, new RegExp(emptyText))
    assert.match(html, /Limpiar filtros/)
    assert.equal(typeof resetClick, 'function')
  })

  test('reset clears filters, category, and page while preserving sort', () => {
    Object.assign(state, { q: 'x', ubicacion: 'Santiago', modalidad: 'remoto', formato: 'part-time', salarioMin: 1, salarioMax: 2, moneda: 'USD', experiencia: 'senior', categoria: 'biotech', pagina: 4, orden: 'antiguos' })
    result = { data: { data: [job], total: 1 } }
    render()
    assert.equal(typeof resetClick, 'function')
    resetClick()
    assert.deepEqual(updates, [{ q: null, ubicacion: null, modalidad: null, formato: null, salarioMin: null, salarioMax: null, moneda: null, experiencia: null, categoria: null, pagina: null }])
    assert.equal(state.orden, 'antiguos')
  })

  test('loading and error states do not show misleading empty results', () => {
    result = { data: undefined, isLoading: true, isError: false }
    let html = render()
    assert.match(html, /Cargando ofertas/)
    assert.doesNotMatch(html, new RegExp(emptyText))
    assert.doesNotMatch(html, /No hay ofertas publicadas/)
    result = { data: undefined, isLoading: false, isError: true }
    html = render()
    assert.match(html, /No pudimos cargar las ofertas/)
    assert.doesNotMatch(html, new RegExp(emptyText))
    assert.doesNotMatch(html, /No hay ofertas publicadas/)
  })
} else {
  const assert = require('node:assert/strict')
  const { spawnSync } = require('node:child_process')
  const path = require('node:path')
  const { test } = require('node:test')

  test('job search UX regression cases', () => {
    const run = spawnSync('bun', ['test', path.join('tests', path.basename(__filename))], {
      cwd: path.resolve(__dirname, '..'),
      encoding: 'utf8',
      env: { ...process.env, JOB_SEARCH_UX_BUN_TEST: '1' },
    })
    assert.equal(run.status, 0, `${run.stdout}\n${run.stderr}`)
    assert.match(`${run.stdout}\n${run.stderr}`, /5 pass/)
  })
}
