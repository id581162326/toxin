namespace Button {
  export interface Props {
    onClick: () => void
  }

  export interface Interface {
    setDisabled: (disabled: boolean) => this,
    setLabel: (label: string) => this
  }
}

export default Button;