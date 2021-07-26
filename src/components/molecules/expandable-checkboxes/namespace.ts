import CheckboxGroup from '../checkbox-group/namespace';

namespace ExpandableCheckboxes {
  export interface Props extends CheckboxGroup.Props {
  }

  export interface Interface {
    setExpanded: (expanded: boolean) => this
  }
}

export default ExpandableCheckboxes;