namespace RadioGroup {
  export interface Props {
    onChange: (value: string) => void
  }

  export interface Interface {
    setDisabled: (disabled: boolean) => this
  }
}

export default RadioGroup;