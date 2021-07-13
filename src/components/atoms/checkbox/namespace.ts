namespace Checkbox {
  export interface Props {
    onChange: (checked: boolean) => void
  }

  export interface Interface {
    setDisabled: (disabled: boolean) => this
  }
}

export default Checkbox;