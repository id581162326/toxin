namespace Checkbox {
  export interface Props {
    onChange: (data: Record<string, boolean>) => void
  }

  export interface Interface {
    setDisabled: (disabled: boolean) => this
  }
}

export default Checkbox;