import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DanceStudioDoors } from './DanceStudioDoors'

describe('DanceStudioDoors', () => {
  it("renders Ev's Dance sign", () => {
    render(<DanceStudioDoors />)
    expect(screen.getByText("Ev's Dance")).toBeInTheDocument()
  })

  it('has an accessible door control', () => {
    render(<DanceStudioDoors />)
    const doorButton = screen.getByRole('button', { name: /open studio doors/i })
    expect(doorButton).toBeInTheDocument()
  })

  it('toggles the door label on click', () => {
    render(<DanceStudioDoors />)
    const doorButton = screen.getByRole('button', { name: /open studio doors/i })
    fireEvent.click(doorButton)
    expect(screen.getByRole('button', { name: /close studio doors/i })).toBeInTheDocument()
  })
})
