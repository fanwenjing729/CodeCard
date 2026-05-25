export interface QuizState {
  index: number;
  score: number;
  done: boolean;
  submitted: boolean;
  selected: string | null;
  fillAnswer: string;
}

export type QuizAction =
  | { type: 'SELECT'; value: string }
  | { type: 'FILL'; value: string }
  | { type: 'SUBMIT' }
  | { type: 'SCORE' }
  | { type: 'NEXT'; nextIndex: number }
  | { type: 'DONE' }
  | { type: 'RESET' };

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SELECT':
      return { ...state, selected: action.value };
    case 'FILL':
      return { ...state, fillAnswer: action.value };
    case 'SUBMIT':
      return { ...state, submitted: true };
    case 'SCORE':
      return { ...state, score: state.score + 1 };
    case 'NEXT':
      return { ...state, index: action.nextIndex, submitted: false, selected: null, fillAnswer: '' };
    case 'DONE':
      return { ...state, done: true };
    case 'RESET':
      return { index: 0, score: 0, done: false, submitted: false, selected: null, fillAnswer: '' };
  }
}
