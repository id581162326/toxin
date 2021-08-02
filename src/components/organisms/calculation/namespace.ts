namespace Calculation {
  export type DataNamesMap = 'rent-price' | 'discount' | 'sum-price' | 'service-price' | 'additional-price' | 'total-price' | 'days' | string;

  export type CalculationData = Record<DataNamesMap, string | number>;

  export interface Props {
    onSubmit: (calculationData: CalculationData) => void
  }
}

export default Calculation;