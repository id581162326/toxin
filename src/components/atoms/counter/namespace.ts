namespace Counter {
  export interface Props {
    onChange: (value: number) => void
  }

  export interface Interface {
    reset: () => this
  }
}

export default Counter;