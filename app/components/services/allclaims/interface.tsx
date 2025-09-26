export function Interface() {

    return(
        <div className="absolute inset-4 rounded-xl shadow-inner">
            <div className="p-4 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L19.5 8.5V10C19.5 14.5 17.5 17.5 12 19.5C6.5 17.5 4.5 14.5 4.5 10V8.5L12 4.5Z"/>
                        </svg>
                    </div>
                    <span className="text-brand font-semibold">AllClaims AI</span>
                </div>
                
                {/* Image Upload Area */}
                <div className="flex-1 border-2 border-dashed border-brand-element/30 rounded-xl mb-4 flex items-center justify-center">
                    <div className="text-center">
                        <svg className="w-12 h-12 text-brand-element/50 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                        </svg>
                        <p className="text-brand-element/70 text-sm">Upload Damage Photos</p>
                    </div>
                </div>
                
                {/* Analysis Results */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center bg-brand-element/10 rounded-lg p-2">
                        <span className="text-brand text-sm">Front Bumper</span>
                        <span className="text-brand font-semibold text-sm">$850</span>
                    </div>
                    <div className="flex justify-between items-center bg-brand-element/10 rounded-lg p-2">
                        <span className="text-brand text-sm">Headlight Assembly</span>
                        <span className="text-brand font-semibold text-sm">$420</span>
                    </div>
                    <div className="border-t border-brand/20 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-brand font-bold">Total Estimate</span>
                            <span className="text-brand font-bold text-lg">$1,270</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}