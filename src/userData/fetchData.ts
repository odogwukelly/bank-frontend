import server from "@/server";

const cardData = async () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    const user_id = Number(userData.id)
    try {
        const res = await fetch(`${server}/users/card/all?user_id=${user_id}`);

        if (!res.ok) throw new Error('Failed to fetch card data');

        const data = await res.json();

        const cardArray = data || [];

        const formattedCards = (cardArray || []).map(card => ({
            id: card.id,
            name: card.cardName[0].toUpperCase() + card.cardName.slice(1).toLowerCase(),
            type: card.cardType,
            balance: card.cardBalance,
            number: "****" + card.cardNumber.slice(-4),
            cvv: card.cvv,
            expiryDate: card.expiresAt.slice(2, 4) + "/" + card.expiresAt.slice(5, 7),
            status: card.status ? "Active" : "Inactive",
        }));

        return { "formatted": formattedCards, "cards": cardArray };

    } catch (err) {
        console.error('❌ Error fetching card:', err);
    }
};




export default cardData
