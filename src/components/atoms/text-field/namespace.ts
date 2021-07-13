namespace TextField {
  export interface Props {
    onChange: (value: string) => void
  }

  export interface Interface {
    setValid: (valid: boolean) => this,
    setDisabled: (disabled: boolean) => this,
    setValue: (value: string) => this
  }
}

export default TextField;