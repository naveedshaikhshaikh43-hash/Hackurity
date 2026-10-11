import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'GovChain Sentinel // Immutable Government Audit & Chain of Custody',
  description: 'Zero-trust cryptographic integrity for public sector records. Continuous SHA-256 hash chaining and EVM Merkle root anchoring.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased transition-colors duration-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
