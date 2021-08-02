namespace Calculation {
  export type CalculationData = Record<string, string | number>;

  export interface Props {
    onSubmit: (calculationData: CalculationData) => void
  }
}

export default Calculation;