import { ContactHero } from '@/components/contact/hero';
// import { ContactForm } from '@/components/contact/contactForm';
// import { ContactInfo } from '@/components/contact/contactInfo';
import { ContactMap } from '@/components/contact/contactMap';

export const metadata = {
    title: "Contact Us",
};

export default function Contact() {
    return(
        <div className="min-h-svh">
            <ContactHero />
            <ContactMap />
            {/* <ContactForm /> */}
            {/* <ContactInfo /> */}
            
        </div>
    )
}
