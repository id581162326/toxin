namespace Counter {
  export interface Props {
    onChange: (data: Record<string, number>) => void
  }

  export interface Interface {
    reset: () => this
  }
}

export default Counter;