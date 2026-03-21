import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t-2 border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} IGAP Club. Built for devs, by devs.
          </p>
          
          <div className="flex gap-6">
            <Link 
              href="/about" 
              className="text-sm font-medium hover:underline decoration-2 underline-offset-4 transition-all"
            >
              About
            </Link>
            <Link 
              href="/terms" 
              className="text-sm font-medium hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Terms of Use
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm font-medium hover:underline decoration-2 underline-offset-4 transition-all"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}