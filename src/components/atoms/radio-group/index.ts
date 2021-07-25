import Radio from 'modules/radio';

import Namespace from './namespace';

class RadioGroup extends Radio {
  constructor(wrap: HTMLElement, props: Namespace.Props) {
    super('radio-group', wrap, props);
  }
}

export default RadioGroup;