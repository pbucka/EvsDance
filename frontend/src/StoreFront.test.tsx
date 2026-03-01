import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StoreFront } from './StoreFront'

describe('StoreFront', () => {
  it('renders the store sign text', () => {
    render(<StoreFront sign="COFFEE" signClass="sign-coffee" facadeClass="store-coffee" />)
    expect(screen.getByText('COFFEE')).toBeInTheDocument()
  })

  it('renders with different sign text', () => {
    render(<StoreFront sign="PIZZA" signClass="sign-pizza" facadeClass="store-pizza" />)
    expect(screen.getByText('PIZZA')).toBeInTheDocument()
  })
})
