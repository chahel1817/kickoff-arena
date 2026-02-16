import './footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-about">
                    <h2 className="footer-title">FOOTBALLVERSE</h2>
                    <p className="footer-description">
                        The most immersive football management experience on the web.
                        Build your dream squad, manage tactics, and dominate the world stage.
                    </p>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Quick Links</h4>
                    <ul className="footer-list">
                        <li><a href="#" className="footer-link">Career Mode</a></li>
                        <li><a href="#" className="footer-link">Transfer Market</a></li>
                        <li><a href="#" className="footer-link">Top Scorers</a></li>
                        <li><a href="#" className="footer-link">Hall of Fame</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Support</h4>
                    <ul className="footer-list">
                        <li><a href="#" className="footer-link">Help Center</a></li>
                        <li><a href="#" className="footer-link">Terms of Service</a></li>
                        <li><a href="#" className="footer-link">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 FootballVerse. All rights reserved.</p>
                <span>v1.0.0-alpha</span>
            </div>
        </footer>
    );
}
