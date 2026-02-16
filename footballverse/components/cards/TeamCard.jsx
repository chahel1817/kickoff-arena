export default function TeamCard({ team }) {
    return (
        <div className="glass p-6 rounded-2xl card-hover text-center">
            <div className="w-20 h-20 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">{team?.name?.[0] || 'T'}</span>
            </div>
            <h3 className="text-xl font-bold">{team?.name || 'Manchester City'}</h3>
            <p className="text-muted text-sm">{team?.league || 'Premier League'}</p>
        </div>
    );
}
