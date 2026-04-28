import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { CommandPalette } from '@/components/common/CommandPalette';
import { MitreHeatmap } from '@/components/views/MitreHeatmap';
import { CorrelationTimeline } from '@/components/views/CorrelationTimeline';
import { CoverageScorecard } from '@/components/views/CoverageScorecard';
import { GeoMap } from '@/components/views/GeoMap';
import { AttackReplay } from '@/components/views/AttackReplay';
import { AlertsTable } from '@/components/views/AlertsTable';
import { IncidentReport } from '@/components/views/IncidentReport';
import { useUiStore } from '@/store/useUiStore';
import { useAlertsQuery } from '@/hooks/useAlertsQuery';
import { useAttackLog } from '@/hooks/useAttackLog';
import { useAlertStream } from '@/hooks/useAlertStream';
export default function App() {
    useAlertsQuery();
    useAttackLog();
    useAlertStream();
    const view = useUiStore((s) => s.activeView);
    return (_jsxs("div", { className: "flex h-screen bg-soc-bg text-soc-ink", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsx(TopBar, {}), _jsxs("main", { className: "flex-1 overflow-auto", children: [view === 'timeline' && _jsx(CorrelationTimeline, {}), view === 'mitre' && _jsx(MitreHeatmap, {}), view === 'coverage' && _jsx(CoverageScorecard, {}), view === 'geo' && _jsx(GeoMap, {}), view === 'replay' && _jsx(AttackReplay, {}), view === 'alerts' && _jsx(AlertsTable, {})] })] }), _jsx(CommandPalette, {}), _jsx(IncidentReport, {})] }));
}
