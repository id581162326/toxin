import View from './parts/view';
import Model from './parts/model';
import Controller from './parts/controller';

import Namespace from './namespace';

class Datepicker implements Namespace.Interface {
  public readonly reset = () => {
    this.controller.dispatch({type: 'RESET_SELECTED'});

    return (this);
  };

  constructor(private readonly wrap: HTMLElement, private readonly props: Namespace.Props) {
    this.view = new View(wrap, {
      onTurnNext: this.handleTurnNext,
      onTurnPrev: this.handleTurnPrev,
      onSelect: this.handleSelect,
      onSelectionEnd: props.onSelectionEnd
    });
    this.model = new Model({onSelect: props.onSelect, selected: props.selected});
    this.controller = new Controller(this.view, this.model);
  }

  private readonly view: InstanceType<typeof View>;
  private readonly model: InstanceType<typeof Model>;
  private readonly controller: InstanceType<typeof Controller>;

  private readonly handleTurnNext = () => this.controller.dispatch({type: 'TURN_NEXT'});
  private readonly handleTurnPrev = () => this.controller.dispatch({type: 'TURN_PREV'});
  private readonly handleSelect = (dates: [Date, Date]) => this.controller.dispatch({type: 'SET_SELECTED', dates});
}

export default Datepicker;