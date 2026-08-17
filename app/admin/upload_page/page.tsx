"use client"

// Using the @/ alias automatically routes to your root/src folder perfectly!  
import { useAuth } from "@/context/AuthContext" 
import { Button } from "@/components/ui/ButtonComponent" 
import { Cog } from "lucide-react"
import { useState } from "react"

export default function AdminUploadPage() {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState('');
    const [terminalLogs, setTerminalLogs] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Security check: Only render if the user is an admin
    if (user?.role !== 'admin') {
        return (
            <section className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest flex items-center justify-center">
                <div className="bg-black/80 p-8 rounded-2xl border border-red-500/50 text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-gray-400">You must be an administrator to view this page.</p>
                </div>
            </section>
        )
    }

    const handleUpload = async () => {
        if (!file || !category) {
            setTerminalLogs('❌ Error: Please select both a file and a category.');
            return;
        }

        setIsUploading(true);
        setTerminalLogs(''); 

        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        try {
            const response = await fetch('http://127.0.0.1:8000/admin/upload-prices', {
                method: 'POST',
                body: formData,
            });

            if (!response.body) {
                setTerminalLogs('❌ Error: No response body from server.');
                setIsUploading(false);
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                const textChunk = decoder.decode(value, { stream: true });
                setTerminalLogs((prev) => prev + textChunk);
            }

        } catch (error: any) {
            setTerminalLogs((prev) => prev + `\n❌ Network Error:\n${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <section className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            <div className="w-full min-h-svh bg-black/50 px-4 pb-8 md:px-12 lg:px-24 md:pb-12 pt-24 flex flex-col justify-center items-center overflow-hidden">
                <div className="w-full max-w-5xl flex flex-col gap-6 backdrop-blur-sm border border-brand-white/30 px-6 md:px-12 py-8 md:py-10 rounded-2xl md:rounded-3xl text-brand-white shadow-lg bg-brand-white/10">
                    
                    <div className="flex items-center gap-3 border-b border-white/20 pb-4">
                        <Cog className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
                        <h1 className="text-2xl md:text-3xl font-bold text-brand-white">Upload Latest Insured Prices</h1>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-brand-white ml-2 mb-2">Select SNK Excel File</label>
                            <input 
                                type="file" 
                                accept=".xlsx, .xls"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="w-full text-brand-white bg-black/40 rounded-xl border border-white/40 p-3 px-4 outline-none focus:border-brand transition-colors"
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-bold text-brand-white ml-2 mb-2">Vehicle Category</label>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full text-brand-white bg-black/60 rounded-xl border border-white/40 p-3.5 px-4 outline-none focus:border-brand appearance-none transition-colors"
                            >
                                <option value="" disabled>Select a category...</option>
                                <option value="PRIVATE">PRIVATE</option>
                                <option value="COMMERCIAL">COMMERCIAL</option>
                                <option value="MOTORCYCLE">MOTORCYCLE</option>
                                <option value="LIGHT">LIGHT</option>
                                <option value="HEAVY">HEAVY</option>
                            </select>
                        </div>
                    </div>

                    <div className="w-full flex justify-end">
                        <Button onClick={handleUpload} disabled={isUploading} variant="secondary" size="sm">
                            {isUploading ? 'Uploading Data...' : 'Run Upload Script'}
                        </Button>
                    </div>

                    <div className="bg-black/80 rounded-xl p-6 h-96 overflow-y-auto font-mono text-sm border border-white/20 shadow-inner mt-2">
                        <p className="text-green-400 mb-4">$ Admin Server Terminal Live Feed:</p>
                        <pre className="text-gray-300 whitespace-pre-wrap">{terminalLogs}</pre>
                    </div>

                </div>
            </div>
        </section>
    );
}