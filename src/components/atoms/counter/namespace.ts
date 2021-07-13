namespace Counter {
  export interface Props {
    onChange: (value: number) => void
  }

  export interface Interface {
    reset: () => this,
    isMin: boolean
  }
}

export default Counter;