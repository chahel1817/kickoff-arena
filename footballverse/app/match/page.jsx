export default function MatchPage() {
    return (
        <div className="page-container text-center">
            <h1 className="text-4xl mb-4 text-gradient">Match Day</h1>
            <p className="text-muted mb-12">Prepare for kick-off in the mini-game arena.</p>

            <div className="glass p-12 rounded-[3rem] inline-block">
                <div className="text-6xl mb-6">⚽</div>
                <h3 className="text-2xl font-bold mb-4">Penalty Shootout</h3>
                <button className="btn-primary">KICK OFF NOW</button>
            </div>
        </div>
    );
}
