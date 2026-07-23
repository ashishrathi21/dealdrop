
import { createClient } from '@/utils/supabase/server';
import { getProducts } from './actions';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';

const page = async () => {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <LandingPage />;
    }

    const products = await getProducts();
    
    // Fetch user's price histories to display aggregate analytics on the dashboard
    const { data: priceHistory } = await supabase
        .from("price_history")
        .select("product_id, price, checked_at")
        .order("checked_at", { ascending: true });

    // Map initial prices (first recorded check) onto the products objects
    const productsWithInitial = products.map((p) => {
        const history = (priceHistory || [])
            .filter((h) => h.product_id === p.id)
            .sort((a, b) => new Date(a.checked_at) - new Date(b.checked_at));
        return {
            ...p,
            initial_price: history.length > 0 ? history[0].price : p.current_price
        };
    });

    return (
        <Dashboard 
            user={user} 
            products={productsWithInitial} 
            priceHistory={priceHistory || []} 
        />
    );
};

export default page;