export interface Solution {
    title: string;
    description: string;
    image: string;
    learnMoreUrl: string;
    features?: string[];
}

export const solutions: Solution[] = [
    {
        title: "COLS Investigation System",
        description: "Online system for motor vehicle accident investigation",
        learnMoreUrl: "/services/allclaims",
        image: "/services/cols_2.jpg",

    },
    {
        title: "Vehicle Market Valuation",
        description: "Online real-time valuation of vehicles for industry players and financial institutions",
        learnMoreUrl: "/services/valuation",
        image: "/services/value.jpg",

    },
    {
        title: "Motor Vehicle Accident Estimation",
        description: "Damage estimation value for a motor vehicle accident claim",
        learnMoreUrl: "/services/estimation",
        image: "/services/accident.png",

    },
    {
        title: "MyMotorPal",
        description: "One stop solution app for motor vehicle services, information and products",
        learnMoreUrl: "/services/mymotorpal",
        image: "/services/app.jpg",

    },
    {
        title: "Road Ranger",
        description: "Providing end to end service from roadside assistance to claims settlement",
        learnMoreUrl: "/services/roadranger",
        image: "/services/callcenter.png",

    },
    {
        title: "Online Insurance Platform",
        description: "A digital platform for selling direct insurance products online",
        learnMoreUrl: "services/online-insurance",
        image: "/services/insurance.jpg"
    }
];
