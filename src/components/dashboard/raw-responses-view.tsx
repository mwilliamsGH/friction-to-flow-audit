'use client';

import { NeoCard } from '@/components/ui';
import { SURVEY_QUESTIONS } from '@/lib/constants';

interface RawResponsesViewProps {
    responses: Record<string, any>;
}

export function RawResponsesView({ responses }: RawResponsesViewProps) {
    // Filter out any metadata fields that aren't answers if they exist
    // We can just iterate over the responses object. 
    // It should mostly match SURVEY_QUESTIONS keys.

    const renderValue = (value: any) => {
        if (value === null || value === undefined) return <span className="text-gray-400 italic">No answer</span>;
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (Array.isArray(value)) {
            if (value.length === 0) return <span className="text-gray-400 italic">None</span>;
            return (
                <ul className="list-disc pl-5 mt-1 space-y-1">
                    {value.map((item, i) => (
                        <li key={i} className="text-gray-700">{item}</li>
                    ))}
                </ul>
            );
        }
        if (typeof value === 'object') {
            return (
                <div className="mt-2 text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">
                    {Object.entries(value).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                            <span className="font-medium text-gray-600 capitalize">{k.replace(/-/g, ' ')}</span>
                            <span className="text-gray-900 font-semibold">{v as React.ReactNode}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return <span className="text-gray-900">{String(value)}</span>;
    };

    const sortedKeys = Object.keys(responses).sort((a, b) => {
        // Try to sort by q number if possible (e.g., q1, q2)
        const numA = parseInt(a.match(/^q(\d+)/)?.[1] || '999');
        const numB = parseInt(b.match(/^q(\d+)/)?.[1] || '999');
        if (numA !== numB) return numA - numB;
        return a.localeCompare(b);
    });

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Raw Survey Data</h2>
                <p className="text-sm text-gray-500">Unfiltered responses directly from the user's submission.</p>
            </div>

            {sortedKeys.map((key) => {
                const value = responses[key];
                // Handle empty strings as unanswered
                if (value === '') return null;

                const questionConfig = SURVEY_QUESTIONS[key.split('_')[0]]; // Try to match q1 from q1_name

                let label = key;
                let description = null;

                if (questionConfig) {
                    label = questionConfig.question;
                    description = questionConfig.description;
                } else {
                    // Fallback formatting for keys like q13_friction_types_other
                    label = key.replace(/^q\d+_/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                }

                return (
                    <NeoCard key={key} className="p-5 hover:border-primary/30 transition-colors">
                        <div className="mb-3">
                            <h4 className="font-medium text-gray-900 text-base">{label}</h4>
                            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
                            {!questionConfig && <span className="inline-block mt-1 text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded">Key: {key}</span>}
                        </div>
                        <div className="text-sm">
                            {renderValue(value)}
                        </div>
                    </NeoCard>
                );
            })}
        </div>
    );
}
