import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  signal,
} from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzResultModule } from 'ng-zorro-antd/result';
import { finalize } from 'rxjs/operators';
import { resolveDashboardTemplate } from '../plots-new/dynamic-component-registry';
import { TemplateService, TemplateConfig } from '../template-service';

export type TemplateRenderMode = 'only' | 'config' | 'feed';

/**
 * Shared rendering engine used by all 3 template-render pages.
 * Given a templateId + mode it fetches the right shaped config from
 * TemplateService or dynamically renders systemData passed directly from parent components.
 */
@Component({
  selector: 'app-template-renderer',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet, NzSpinModule, NzResultModule],
  templateUrl: './template-renderer.html',
  styleUrl: './template-renderer.css',
})
export class TemplateRenderer implements OnInit, OnChanges {
  /** Used when mode === 'only' — a template's own id.
   *  Also used when mode === 'config' | 'feed' — which of the entity's
   *  saved templates to render; falls back to the entity's active template
   *  when omitted. */
  @Input() templateId?: string | null;
  /** Used when mode === 'config' | 'feed' — a saved entity's id (its plot configuration). */
  @Input() entityId?: string;
  @Input({ required: true }) mode!: TemplateRenderMode;

  /** Allows parent components like SystemTemplate to pass system state directly */
  @Input() systemData?: any;

  loading = signal(true);
  error = signal<string | null>(null);

  template = signal<TemplateConfig | null>(null);
  rawLiveData = signal<any>(null);

  private initialized = false;

  constructor(private templateService: TemplateService) { }

  ngOnInit(): void {
    this.initialized = true;
    this.load();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) return;

    // Reactively update layout whenever systemData changes from parent
    if (changes['systemData'] && this.systemData) {
      this.syncSystemDataToTemplate(this.systemData);
      return;
    }

    if (
      changes['templateId'] ||
      changes['entityId'] ||
      changes['mode']
    ) {
      this.load();
    }
  }

  private load(): void {
    if (!this.mode) {
      return;
    }

    // If local reactive systemData is passed directly from parent, use it directly
    if (this.systemData) {
      this.loading.set(false);
      this.syncSystemDataToTemplate(this.systemData);
      return;
    }

    if (this.mode === 'only' && !this.templateId) {
      return;
    }
    if ((this.mode === 'config' || this.mode === 'feed') && !this.entityId) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.template.set(null);
    this.rawLiveData.set(null);

    const done = () => this.loading.set(false);

    switch (this.mode) {
      case 'only':
        this.templateService
          .getTemplateOnly(this.templateId!)
          .pipe(finalize(done))
          .subscribe({
            next: (template) => this.template.set(template),
            error: () => this.error.set('Failed to load template.'),
          });
        break;

      case 'config':
        this.templateService
          .getTemplateWithPlotsConfiguration(
            this.entityId!,
            this.templateId ?? undefined
          )
          .pipe(finalize(done))
          .subscribe({
            next: (template) => this.template.set(template),
            error: () =>
              this.error.set('Failed to load template configuration.'),
          });
        break;

      case 'feed':
        this.templateService
          .getTemplateWithFeedData(
            this.entityId!,
            this.templateId ?? undefined
          )
          .pipe(finalize(done))
          .subscribe({
            next: ({ template, feedData }) => {
              this.template.set(template);
              this.rawLiveData.set(feedData);
            },
            error: () =>
              this.error.set('Failed to load template with feed data.'),
          });
        break;
    }
  }

  /**
   * Transforms parent systemData payload into the formatted TemplateConfig structure
   * needed by design templates (like TmpSyd1).
   */
  private syncSystemDataToTemplate(sysData: any): void {
    if (!sysData) return;

    const targetEntityId = this.entityId || sysData.entityId;

    // Load feed data if not already set or when entityId changes
    if (targetEntityId) {
      const feed = this.templateService['findEntityFeed']
        ? this.templateService['findEntityFeed'](targetEntityId)
        : null;

      if (feed) {
        this.rawLiveData.set(feed);
      } else {
        // Fallback using public service method
        this.templateService
          .getTemplateWithFeedData(targetEntityId, this.templateId ?? undefined)
          .subscribe({
            next: ({ feedData }) => this.rawLiveData.set(feedData),
          });
      }
    }

    const targetTemplateId = this.templateId || sysData.activeTemplateId;
    const activeTmpl = sysData.templates?.find(
      (t: any) => t.templateId === targetTemplateId
    );

    if (!activeTmpl) {
      this.error.set(`Template not found: ${targetTemplateId}`);
      return;
    }

    const templateDef = this.templateService['findTemplateDef']
      ? this.templateService['findTemplateDef'](targetTemplateId)
      : null;

    const rawSections = templateDef?.sectionList || activeTmpl.sections || [];
    const allPlots: any[] = activeTmpl.plots || [];

    const formattedSections = rawSections.map((sec: any) => {
      const sectionPlots = allPlots.filter(
        (p: any) => p.belongSection === sec.sectionId
      );

      const categoryMap = new Map<string, any[]>();
      sectionPlots.forEach((plot: any) => {
        const cat = plot.category || 'General';
        if (!categoryMap.has(cat)) {
          categoryMap.set(cat, []);
        }
        categoryMap.get(cat)!.push({ ...plot });
      });

      const categories = Array.from(categoryMap.entries()).map(
        ([category, components]) => ({
          category,
          components: [...components],
        })
      );

      return {
        sectionId: sec.sectionId,
        title: sec.title,
        description: sec.description,
        parentPlaceholderTemplate: sec.parentPlaceholderTemplate,
        categories:
          categories.length > 0
            ? categories
            : [{ category: 'Default', components: [...sectionPlots] }],
      };
    });

    this.template.set({
      templateId: activeTmpl.templateId,
      name: activeTmpl.name || activeTmpl.templateId,
      sections: [...formattedSections],
    } as TemplateConfig);
  }
  getTemplateComponent() {
    const template = this.template();
    if (!template) return null;
    return resolveDashboardTemplate(template.templateId);
  }
}