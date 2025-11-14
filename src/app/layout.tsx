import { AuthProvider } from "@/lib/auth";

export default function RootLayout({ children }) {
  return (
  
        <AuthProvider>
          {children}
        </AuthProvider>
    
  );
}
