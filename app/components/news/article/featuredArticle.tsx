import Image from "next/image"
import Link from "next/link"

export function FeaturedGrid() {
    return(
        <div className="bg-brand/10 rounded-2xl border border-brand/60 hover:scale-105 transition-all duration-300 group overflow-hidden text-brand/80">
            {/* All these are still placeholders */}
            {/* Image */}
            <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
                <Image
                    src="/images/g70.jpg"
                    alt="Test"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t group-hover:from-brand/30 to-transparent transition-all duration-300"></div>
                
            </div>
            <div className="p-4 flex flex-col gap-2">
                <div className=""> 
                    <h2 className="group-hover:text-brand transition-colors duration-300 text-xl font-bold truncate">Article Name Goes Here</h2>
                    <span className="text-sm">Nicholas Raj</span>
                </div>

                <hr className="border border-brand/20"/>
                
                <div className="flex flex-col text-sm">
                    {/* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                    </svg> */}
                    <Link href="/" className="flex gap-2 items-center text-brand/80 hover:text-brand font-semibold text-sm transition-colors duration-200">
                        Read More
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                </div>
                {/* <p className="truncate">Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque maxime magni recusandae a nobis earum repellendus, voluptatum vel aut dolorem quisquam! Ab dolore doloremque blanditiis ut rem temporibus corporis quibusdam.</p> */}
            </div>
        </div>
    )
}