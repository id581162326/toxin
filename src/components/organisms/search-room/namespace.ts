import {Option} from 'fp-ts/Option';

namespace SearchRoom {
  export interface SearchData {
    residence_time: Option<[Date, Date]>,
    guests: Record<string, number>
  }

  export interface Props {
    onSubmit: (searchData: SearchData) => void
  }
}

export default SearchRoom;