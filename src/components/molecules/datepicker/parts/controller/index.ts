import * as F from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import * as H from 'globals/helpers';

import Namespace from './namespace';

class Controller implements Namespace.Interface {
  public readonly dispatch = (action: Namespace.Actions) => {
    pipe(action.type, H.switchCases([
      ['TURN_NEXT', this.model.turnToNext],
      ['TURN_PREV', this.model.turnToPrev],
      ['RESET_SELECTED', this.model.resetSelected],
      ['SET_SELECTED', () => pipe(action as Namespace.SetSelected, H.prop('dates'), this.model.setSelected)],
    ], F.constVoid));

    return (this);
  };

  constructor(view: Namespace.View, private readonly model: Namespace.Model) {
    model.attachListener(view);
  }
}

export default Controller;