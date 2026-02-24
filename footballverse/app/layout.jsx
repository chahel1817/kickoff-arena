import './globals.css';
import ClientChrome from './client-chrome';

export { metadata, viewport } from './metadata';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ClientChrome>{children}</ClientChrome>
            </body>
        </html>
    );
}
