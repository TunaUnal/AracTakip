import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function AdminRoute({ children }) {
    const { user } = useSelector(state => state.user);
    if (!user) return <p>Yükleniyor…</p>;
    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
}

export function ModRoute({ children }) {
    const { user } = useSelector(state => state.user);
    if (!user) return <p>Yükleniyor…</p>;
    if (user.role !== 'admin' && user.role !== 'moderator') {
        return <Navigate to="/" replace />;
    }
    return children;
}
