import { useSelector } from "react-redux";
import { totalPosts, twitterPosts } from "../features/posts/postSelectors";

function Stats() {
  const total = useSelector(totalPosts);
  const twitter = useSelector(twitterPosts);

  return (
    <div className="card">
      <h2>Statistics</h2>

      <p>Total Posts: {total}</p>

      <p>Twitter Posts: {twitter.length}</p>
    </div>
  );
}

export default Stats;