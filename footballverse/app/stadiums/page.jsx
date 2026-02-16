export default function StadiumsPage() {
    return (
        <div className="page-container">
            <h1 className="text-4xl mb-4 text-gradient">Stadium Explorer</h1>
            <p className="text-muted mb-8">Coming Soon: Explore iconic stadiums from around the world.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass h-64 rounded-3xl animate-pulse"></div>
                <div className="glass h-64 rounded-3xl animate-pulse"></div>
            </div>
        </div>
    );
}
