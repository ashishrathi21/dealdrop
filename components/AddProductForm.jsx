"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";
import { Loader2 } from "lucide-react";
import { addProduct } from "@/app/actions";
import { toast } from "sonner";

const AddProductForm = ({ user }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e) => {
      e.preventDefault()

      if(!user){
        setShowAuthModal(true)
        return
      }

      setLoading(true)

      const formData = new FormData()
      formData.append("url", url)

      const result = await addProduct(formData)

      if(result.error){
        toast.error(result.error)
      } else {
        toast.success(result.message || "Product added successfully!")
        setUrl("")
      }
      setLoading(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste product URL (Amazon, Walmart, etc.)"
            className="h-12 text-base bg-zinc-50 border-border text-zinc-900 placeholder-zinc-400 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/50 rounded-lg"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            disabled={loading}
            className="bg-violet-600 hover:bg-violet-550 text-white h-12 px-8 rounded-lg font-semibold transition-all shadow-md shadow-violet-600/10 shrink-0 cursor-pointer"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Track Price"
            )}
          </Button>
        </div>
      </form>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

export default AddProductForm;