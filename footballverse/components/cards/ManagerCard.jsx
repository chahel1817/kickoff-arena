import { UserCircle } from 'lucide-react';

export default function ManagerCard({ manager }) {
    return (
        <div className="glass p-6 rounded-2xl card-hover text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-primary/20">
                <UserCircle className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{manager?.name || 'Pep Guardiola'}</h3>
            <p className="text-primary text-xs uppercase font-bold">{manager?.style || 'Tiki-Taka'}</p>
        </div>
    );
}
