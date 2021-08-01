namespace SearchRoom {
  export type SearchData = Record<string, string | number>

  export interface Props {
    onSubmit: (searchData: SearchData) => void
  }
}

export default SearchRoom;