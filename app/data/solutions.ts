export interface Solution {
    title: string;
    description: string;
    image: string;
    learnMoreUrl: string;
    features?: string[];
}

export const solutions: Solution[] = [
    {
        title: "SNK COLS Investigation System",
        description: "Online system for motor vehicle accident investigation",
        learnMoreUrl: "/services/allclaims",
        image: "/services/cols_2.jpg",
        features: ["AI-powered analysis", "Real-time processing", "Mobile compatibility", "Insurance integration"]
    },
    {
        title: "SNK Vehicle Valuation",
        description: "Online real-time valuation of vehicles for industry players and financial institutions",
        learnMoreUrl: "/services/valuation",
        image: "/services/value.jpg",
        features: ["Real-time data", "Multi-vehicle support", "Market analysis", "API integration"]
    },
    {
        title: "SNK Auto Estimation",
        description: "Damage estimation value for a motor vehicle accident claim",
        learnMoreUrl: "/services/estimation",
        image: "/services/accident.png",
        features: ["Automated workflows", "Fraud detection", "Document processing", "Analytics dashboard"]
    },
    {
        title: "SNK MyMotorPal",
        description: "One stop solution app for motor vehicle services, information and products",
        learnMoreUrl: "/services/mymotorpal",
        image: "/services/app.jpg",
        features: ["Mobile-first design", "GPS integration", "Photo capture", "Emergency assistance"]
    },
    {
        title: "SNK Road Ranger",
        description: "Providing end to end service from roadside assistance to claims settlement",
        learnMoreUrl: "/services/roadranger",
        image: "/services/callcenter.png",
        features: ["End-to-end workflow", "Multi-stakeholder access", "Real-time updates", "Document management"]
    }
];
