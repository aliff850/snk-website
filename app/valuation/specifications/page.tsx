import { CarSpecifications } from "@/components/valuation/Specifications";

export const metadata = {
    title: "Vehicle Specification",
};

export default function VehicleSpecification() {

    return(
        <section className="w-full min-h-svh bg-fixed bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            
            <CarSpecifications />          
            
        </section>
    )

}