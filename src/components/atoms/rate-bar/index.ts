import Radio from 'modules/radio';

import Namespace from './namespace';

class RateBar extends Radio {
  constructor(wrap: HTMLElement, props: Namespace.Props) {
    super('rate-bar', wrap, props)
  }
}

export default RateBar;