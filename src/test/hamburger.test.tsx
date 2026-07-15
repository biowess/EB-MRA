import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TopNav from '../components/layout/TopNav'
import { expect, test } from 'vitest'

test('hamburger test', () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/documentation']}>
      <TopNav />
    </MemoryRouter>
  )
  
  const hamburger = container.querySelector('#nav-hamburger')
  console.log('Hamburger HTML:', hamburger?.outerHTML)
})
