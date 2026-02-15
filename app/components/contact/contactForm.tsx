import AnimateOnLoad from '@/components/ui/AnimateOnLoad';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/ButtonComponent';

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'select' | 'textarea';
    required: boolean;
    options?: string[];
    placeholder?: string;
}

const formFields: FormField[] = [
    {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your full name'
    },
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'Enter your email address'
    },
    {
        name: 'company',
        label: 'Company',
        type: 'text',
        required: false,
        placeholder: 'Enter your company name'
    },
    {
        name: 'phone',
        label: 'Phone Number',
        type: 'text',
        required: false,
        placeholder: 'Enter your phone number'
    },
    {
        name: 'inquiry',
        label: 'Type of Inquiry',
        type: 'select',
        required: true,
        options: [
            'General Information',
            'Sales Inquiry',
            'Technical Support',
            'Partnership Opportunity',
            'Media Inquiry',
            'Other'
        ]
    },
    {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        placeholder: 'Tell us about your needs and how we can help...'
    }
];

export function ContactForm() {
    return (
        <section className="w-full bg-brand py-4 md:py-16 px-2 md:px-12 lg:px-24 font-onest">
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 md:gap-8">

                <AnimateOnLoad animation="fade-in-up">
                    <div className="text-center flex flex-col gap-2 md:gap-4">
                        <h2 className="text-white text-4xl md:text-5xl font-bold">Send Us a Message</h2>
                        <p className="text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
                            Fill out the form below and our team will get back to you within 24 hours
                        </p>
                    </div>
                </AnimateOnLoad>

                <AnimateOnLoad animation="fade-in-up" delay={200}>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-brand-white/95 backdrop-blur-sm rounded-xl md:rounded-3xl p-2 md:p-12 border border-brand-white/20 shadow-lg">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {formFields.slice(0, 4).map((field, index) => (
                                        <AnimateOnLoad
                                            key={field.name}
                                            animation="fade-in-up"
                                            delay={(index * 100 + 300) as 0 | 100 | 200 | 300 | 400}
                                        >
                                            <div className="space-y-2">
                                                <label htmlFor={field.name} className="block text-brand text-sm font-semibold">
                                                    {field.label} {field.required && <span className="text-brand-element">*</span>}
                                                </label>
                                                {field.type === 'select' ? (
                                                    <select
                                                        id={field.name}
                                                        name={field.name}
                                                        required={field.required}
                                                        className="w-full px-4 py-3 rounded-xl border border-brand/20 focus:outline-none focus:ring-2 focus:ring-brand-element text-brand bg-white"
                                                    >
                                                        <option value="">Select an option</option>
                                                        {field.options?.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={field.type}
                                                        id={field.name}
                                                        name={field.name}
                                                        required={field.required}
                                                        placeholder={field.placeholder}
                                                        className="w-full px-4 py-3 rounded-xl border border-brand/20 focus:outline-none focus:ring-2 focus:ring-brand-element text-brand bg-white placeholder-brand/50"
                                                    />
                                                )}
                                            </div>
                                        </AnimateOnLoad>
                                    ))}
                                </div>

                                <AnimateOnLoad animation="fade-in-up" delay={200}>
                                    <div className="space-y-2">
                                        <label htmlFor="inquiry" className="block text-brand text-sm font-semibold">
                                            Type of Inquiry <span className="text-brand-element">*</span>
                                        </label>
                                        <select
                                            id="inquiry"
                                            name="inquiry"
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-brand/20 focus:outline-none focus:ring-2 focus:ring-brand-element text-brand bg-white"
                                        >
                                            <option value="">Select an option</option>
                                            {formFields.find(f => f.name === 'inquiry')?.options?.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </AnimateOnLoad>

                                <AnimateOnLoad animation="fade-in-up" delay={300}>
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="block text-brand text-sm font-semibold">
                                            Message <span className="text-brand-element">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={6}
                                            placeholder="Tell us about your needs and how we can help..."
                                            className="w-full px-4 py-3 rounded-xl border border-brand/20 focus:outline-none focus:ring-2 focus:ring-brand-element text-brand bg-white placeholder-brand/50 resize-none"
                                        ></textarea>
                                    </div>
                                </AnimateOnLoad>

                                <AnimateOnLoad animation="fade-in-up" delay={400}>
                                    <div className="flex justify-center">
                                        <Button
                                            type="submit"
                                            variant="secondary"
                                            size="lg"
                                            className="grow flex gap-2 text-xl"
                                        >
                                            Send Message
                                            <ArrowRight />
                                        </Button>

                                    </div>
                                </AnimateOnLoad>
                            </form>
                        </div>
                    </div>
                </AnimateOnLoad>

            </div>
        </section>
    )
}
