import './globals.css';

export const metadata = {
  title: 'Database Inventory Management System',
  description:
    'Web application built to streamline the tracking and management of stock, suppliers, and transactions for small to medium-sized businesses'
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen w-full flex-col">{children}</body>
    </html>
  );
}
