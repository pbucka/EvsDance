import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Draggable } from './Draggable'

describe('Draggable', () => {
  it('renders children at the given position', () => {
    render(
      <Draggable x={100} y={200} onMove={() => {}}>
        <span>Drag me</span>
      </Draggable>,
    )
    expect(screen.getByText('Drag me')).toBeInTheDocument()
    const wrapper = screen.getByText('Drag me').closest('.draggable')
    expect(wrapper).toHaveStyle({ left: '100px', top: '200px' })
  })

  it('applies a custom className', () => {
    render(
      <Draggable x={0} y={0} onMove={() => {}} className="minivan-draggable">
        <span>Van</span>
      </Draggable>,
    )
    expect(screen.getByText('Van').closest('.minivan-draggable')).toBeInTheDocument()
  })
})
