import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TemplateSelectionService {
    readonly activeSectionId = signal<string | null>(null);
    readonly activePlotId = signal<string | null>(null);

    selectSection(sectionId: string): void {
        // Toggle off if clicking the currently selected section
        if (this.activeSectionId() === sectionId) {
            this.clearSelection();
            console.log('[SelectionService] Deselected Section. Active Section ID: ""');
            return;
        }

        // Select section and clear plot selection
        this.activePlotId.set(null);
        this.activeSectionId.set(sectionId);
        console.log('[SelectionService] Selected Section ID:', sectionId);
    }

    selectPlot(plotId: string): void {
        // Toggle off if clicking the currently selected plot
        if (this.activePlotId() === plotId) {
            this.clearSelection();
            console.log('[SelectionService] Deselected Plot. Active Plot ID: ""');
            return;
        }

        // Select plot and clear section selection
        this.activeSectionId.set(null);
        this.activePlotId.set(plotId);
        console.log('[SelectionService] Selected Plot ID:', plotId);
    }

    clearSelection(): void {
        this.activeSectionId.set(null);
        this.activePlotId.set(null);
    }
}