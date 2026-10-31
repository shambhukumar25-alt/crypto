import { useQuery } from "@tanstack/react-query";

function Favorites() {
  const handleBack = () => {
    document.getElementById("crypto-prices")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const { data, isPending } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      return favorites
        .map((coin) => (typeof coin === "string" ? coin : coin?.name))
        .filter(Boolean);
    },
  });

  if (isPending) return <p>Loading favorites...</p>;

  return (
    <div>
      <button onClick={handleBack}>← Back to Prices</button>

      <h2>My Favorite Coins</h2>

      {data.length === 0 ? (
        <p>No favorites yet</p>
      ) : (
        data.map((coin) => <p key={coin}>{coin.toUpperCase()}</p>)
      )}
    </div>
  );
}

export default Favorites;