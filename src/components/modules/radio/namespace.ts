namespace Radio {
  export interface Props {
    onChange: (data: Record<string, string>) => void
  }

  export interface Interface {
    setDisabled: (disabled: boolean) => this
  }
}

export default Radio;