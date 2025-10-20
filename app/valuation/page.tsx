// import { ValuationLayout } from "../components/valuation/Valuation"
// import { ValuationLayoutAlt } from "../components/valuation/layout2"
import ValuationPage from "./ValuationPage"

export const metadata = {
    title: "Real-Time Online Inquiry Platform",
};

export default function VehicleValuation() {
    return(

        <section className="w-full min-h-screen bg-fixed bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            
            <ValuationPage />          
            
        </section>

    )
}