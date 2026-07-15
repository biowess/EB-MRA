import { computeDomainScore } from './src/engine/domainScore.ts'
import { QUESTIONS } from './src/data/loadQuestions.ts'

const answers: Record<string, any> = {}
for (const q of QUESTIONS) {
  if (q.id === 'RST-S02') {
    answers[q.id] = 'C'
  } else if (['RST-C03', 'RST-C05', 'RST-C08'].includes(q.id)) {
    answers[q.id] = 5
  } else {
    answers[q.id] = q.response_type === 'LIKERT5' ? 1 : 'A'
  }
}

const result = computeDomainScore(answers)
console.log('Safety gate triggered:', result.safety_gate_triggered)
console.log(result.safety_gate_details)
