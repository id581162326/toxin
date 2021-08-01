namespace TextField {
  export interface Props {
    onChange: (value: Record<string, string>) => void,
    onEnterPress?: () => void,
    dateMask?: true
  }

  export interface Interface {
    validate: () => boolean,
    setDisabled: (disabled: boolean) => this,
    setValue: (value: string) => this
  }
}

export default TextField;