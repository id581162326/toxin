namespace TextField {
  export interface Props {
    onChange: (value: string) => void,
    onEnterPress?: () => void,
    dateMask?: true
  }

  export interface Interface {
    focus: () => this,
    setValid: (valid: boolean) => this,
    setDisabled: (disabled: boolean) => this,
    setValue: (value: string) => this
  }
}

export default TextField;