import LikeButton from 'atoms/like-button/namespace';

namespace Review {
  export interface Props {
    onLikeChange: LikeButton.Props['onChange']
  }
}

export default Review;