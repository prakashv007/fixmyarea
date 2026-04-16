import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

export default function LiveMap({ complaints }) {
    const center = [12.9716, 77.5946];

    return (
        <div className="w-full h-full min-h-[400px]">
            <MapContainer center={center} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%', background: '#020617' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {complaints.filter(c => c.location).map((complaint) => {
                    const [lat, lng] = complaint.location.split(',').map(Number);
                    const isHighPriority = complaint.priority_score >= 8 || complaint.sla_risk;
                    
                    if (isNaN(lat) || isNaN(lng)) return null;

                    return (
                        <CircleMarker
                            key={complaint.ticket_id}
                            center={[lat, lng]}
                            pathOptions={{
                                color: isHighPriority ? '#f43f5e' : '#6366f1',
                                fillColor: isHighPriority ? '#f43f5e' : '#6366f1',
                                fillOpacity: 0.6,
                                weight: 2
                            }}
                            radius={8}
                        >
                            <Popup>
                                <div className="bg-slate-950 text-slate-100 p-4 rounded-2xl border border-white/10 shadow-2xl min-w-[200px]">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Incident Pulse</p>
                                            <p className="text-xl font-black italic tracking-tighter text-white">{complaint.ticket_id}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${isHighPriority ? 'bg-rose-500/20 text-rose-500 border border-rose-500/20' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'}`}>
                                            {isHighPriority ? 'Critical' : 'Nominal'}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed">
                                            "{complaint.normalized_text.substring(0, 60)}..."
                                        </p>
                                        
                                        <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-500 border-t border-white/5 pt-3">
                                            <div className="flex flex-col">
                                                <span className="text-[7px] text-slate-600">Department</span>
                                                <span className="text-indigo-400">{complaint.department}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[7px] text-slate-600">Response</span>
                                                <span className="text-white">{complaint.estimated_resolution_time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
