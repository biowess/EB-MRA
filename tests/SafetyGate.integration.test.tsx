import { render, screen, within, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AssessmentRunner from '../src/views/AssessmentRunner'
import { QUESTIONS } from '../src/data/loadQuestions'

describe('Safety Gate integration', () => {
  it('renders SafetyResourcesScreen when safety gate is triggered and hides all results', async () => {
    render(<AssessmentRunner />)

    fireEvent.click(screen.getByRole('checkbox', { name: /i am 16 or older/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /self-reflection tool/i }))
    fireEvent.click(screen.getByRole('button', { name: /begin assessment/i }))

    for (let i = 0; i < QUESTIONS.length; i++) {
      const q = QUESTIONS[i]
      const questionArea = screen.getByTestId('question-area')
      const radioButtons = within(questionArea).getAllByRole('radio')
      
      if (q.id === 'RST-S02') {
        // Select 'C' (3rd option, index 2)
        fireEvent.click(radioButtons[2])
      } else if (['RST-C03', 'RST-C05', 'RST-C08'].includes(q.id)) {
        // These are reverse-scored; clicking option 5 (index 4) gives a low contribution score
        fireEvent.click(radioButtons[4])
      } else {
        // First option
        fireEvent.click(radioButtons[0])
      }

      if (i < QUESTIONS.length - 1) {
        fireEvent.click(screen.getByRole('button', { name: /next/i }))
      } else {
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      }
    }

    await waitFor(() => {
      expect(screen.getByTestId('safety-resources-screen')).toBeInTheDocument()
    })

    // Assert that domain scores or profile elements are NOT rendered
    // Query by text/role to assert absence
    expect(screen.queryByText(/Assessment complete/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Profile:/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Score:/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument()
  }, 10000)
})
