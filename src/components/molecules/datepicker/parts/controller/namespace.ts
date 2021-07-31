import {Option} from 'fp-ts/Option';

import Model from '../model/namespace';
import View from '../view/namespace';

namespace Controller {
  export interface TurnNext {type: 'TURN_NEXT'}

  export interface TurnPrev {type: 'TURN_PREV'}

  export interface SetSelected {type: 'SET_SELECTED', dates: Option<[Date, Date]>}

  export type Actions = TurnNext | TurnPrev | SetSelected;

  export interface View extends View.Interface {
  }

  export interface Model extends Model.Interface {
  }

  export interface Interface {
    dispatch: (action: Actions) => this
  }
}

export default Controller;