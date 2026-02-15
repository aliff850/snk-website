// Helper function to assist with smooth scrolling
export const scrollToElement = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY
        window.scrollTo({
            top: elementPosition - 100, // Offset for header/padding
            behavior: "smooth"
        })
    }
}