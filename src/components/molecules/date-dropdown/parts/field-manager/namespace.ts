namespace FieldManager {
  export interface Interface {
    setDisabled: (disabled: boolean) => this,
    updateValue: (dates?: [Date, Date]) => this
  }
}

export default FieldManager;