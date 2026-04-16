import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';

export default function CriticalQueueTable({ complaints, onSelectTicket }) {
    const criticalComplaints = complaints.filter(c => c.status !== 'RESOLVED' && (c.priority_score >= 8 || c.sla_risk));

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/5">
                        <tr>
                            <th className="px-8 py-5">System ID</th>
                            <th className="px-8 py-5">Node / Dept</th>
                            <th className="px-8 py-5">Incident Intelligence</th>
                            <th className="px-8 py-5 text-center">Threat Level</th>
                            <th className="px-8 py-5">Response Time</th>
                            <th className="px-8 py-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {criticalComplaints.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-16 text-center text-slate-600 font-bold uppercase tracking-widest bg-slate-900/10">
                                    Queue clear. No immediate threats detected.
                                </td>
                            </tr>
                        ) : (
                            criticalComplaints.map(complaint => (
                                <tr key={complaint.ticket_id} className="group hover:bg-white/[0.02] transition-colors relative overflow-hidden">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                            <span className="font-mono font-black text-slate-200 text-base">{complaint.ticket_id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                            {complaint.department}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 max-w-xs truncate text-slate-400 font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">
                                        "{complaint.normalized_text}"
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <span className="text-xl font-black text-rose-500 tracking-tighter leading-none">{complaint.priority_score}</span>
                                            <span className="text-[8px] font-bold text-rose-500/50 uppercase tracking-widest mt-1">Severity Peak</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-300 font-bold">
                                            <AlertCircle className="w-4 h-4 text-amber-500 items-center" />
                                            {complaint.estimated_resolution_time}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => onSelectTicket(complaint)}
                                            className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all active:scale-95 group/btn shadow-lg"
                                        >
                                            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
