import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function getFavoriteNames() {
    const storedFavorites = localStorage.getItem("favorites");

    if (!storedFavorites) return [];

    try {
        const favorites = JSON.parse(storedFavorites);
        return Array.isArray(favorites)
            ? favorites
                .map((coin) => (typeof coin === "string" ? coin : coin?.name))
                .filter(Boolean)
            : [];
    } catch {
        return [];
    }
}

function CryptoList() {
    const queryClient = useQueryClient();

   

    const { data: coins, isPending, isError, error } = useQuery({
        queryKey: ["crypto"],
        queryFn: async () => {
            const response = await fetch(
                "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch crypto prices");
            }

            const data = await response.json();
            return [
                { name: "bitcoin", price: data.bitcoin.usd },
                { name: "ethereum", price: data.ethereum.usd },
                { name: "dogecoin", price: data.dogecoin.usd }
            ]
        },
        refetchInterval: 10000,
    });

    const { data: favoriteNames = [] } = useQuery({
        queryKey: ["favorites"],
        queryFn: getFavoriteNames,
    });

    const favoriteMutation = useMutation({
        mutationFn: async (coinName) => {
            const favorites = getFavoriteNames();

            if (!favorites.includes(coinName)) {
                favorites.push(coinName);
            }

            localStorage.setItem("favorites", JSON.stringify(favorites));

            return favorites;
        },

        onSuccess: (favorites) => {
            queryClient.setQueryData(["favorites"], favorites);
            queryClient.invalidateQueries({
                queryKey: ["favorites"],
            });
        },
    });

    if (isPending) return <h2>Loading...</h2>;

    if (isError) return <h2>{error.message}</h2>;

    return (
        <div id="crypto-prices">
            <h2>Crypto Prices</h2>

            {coins.map((coin) => (
                <div key={coin.name}>
                    <h3>{coin.name.toUpperCase()}</h3>

                    <p>Price: ${coin.price}</p>

                    <button
                        onClick={() => favoriteMutation.mutate(coin.name)}
                        type="button"
                        disabled={
                            favoriteMutation.isPending ||
                            favoriteNames.includes(coin.name)
                        }
                    >
                        {favoriteMutation.isPending &&
                        favoriteMutation.variables === coin.name
                            ? "Saving..."
                            : favoriteNames.includes(coin.name)
                            ? "Added to Favorites"
                            : "Add Favorite"}
                    </button>
                </div>
            ))}

            {favoriteMutation.isError && (
                <p role="alert">Could not save favorite: {favoriteMutation.error.message}</p>
            )}
        </div>
    );
}

export default CryptoList;