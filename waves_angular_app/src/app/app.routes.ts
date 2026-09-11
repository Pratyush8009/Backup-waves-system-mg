import { Routes } from '@angular/router';
import { UnitsPage } from './pages/units-page/units-page';
import { ModelPage } from './pages/model-page/modelpage';
import { SystemPage } from './pages/system-page/system-page';
import { Home } from './pages/home/home';
import { BlockEditor } from './pages/block-editor/block-editor';
import { UnitPage } from './pages/unit-page/unit-page';
import { SystemOverview } from './components/system-details/system-overview/system-overview';
import { AnalysisPage } from './pages/analysis-page/analysis-page';
import { SystemConfig } from './components/system-details/system-config/system-config';
import { UnitOverview } from './components/unit-details/unit-overview/unit-overview';
import { UnitSystems } from './components/unit-details/unit-systems/unit-systems';
import { UnitManage } from './components/unit-details/unit-manage/unit-manage';
import { FileUpload } from './components/system-details/file-upload/file-upload';
import { UnitBilling } from './components/unit-details/unit-billing/unit-billing';
import { UnitSubscription } from './components/unit-details/unit-subscription/unit-subscription';
import { SystemModels } from './components/system-details/system-models/system-models';
import { SystemAnalysis } from './components/system-details/system-analysis/system-analysis';
import { SystemTemplate } from './components/system-details/system-template/system-template';

import { ModelConfiguration } from './components/model-details/model-configuration/model-configuration';
import { ModelOverview } from './components/model-details/model-overview/model-overview';
import { Testing } from './components/testing/testing';
import { ModelDeploy } from './components/model-details/model-deploy/model-deploy';
import { ModelTemplate } from './components/model-details/model-template/model-template';
import { ModelSchema } from './components/model-details/model-schema/model-schema';


import { RenderTemplateWithPlotsConfigurationWithFeedData } from './components/template-render-components/pages/render-template-with-plots-configuration-with-feed-data/render-template-with-plots-configuration-with-feed-data';
import { LandingPagesForAllTemplatePage } from './components/template-render-components/pages/landing-pages-for-all-template-page/landing-pages-for-all-template-page';
import { RenderTemplateOnly } from './components/template-render-components/pages/render-template-only/render-template-only';
import { RenderTemplateWithPlotsConfiguration } from './components/template-render-components/pages/render-template-with-plots-configuration/render-template-with-plots-configuration';
import { FlowEditor } from './pages/flow-editor/flow-editor';
import { FlowEditor2 } from './pages/code-safety/flow-editor'

export const routes: Routes = [
    { path: 'units/:id', component: UnitsPage },
    {
        path: 'user/:id/units/:unitId',
        component: UnitPage,
        children: [
            { path: '', component: UnitOverview },
            { path: 'systems', component: UnitSystems },
            { path: 'subscription', component: UnitSubscription },
            { path: 'configuration', component: UnitManage },
            { path: 'billings', component: UnitBilling },

        ]
    },
    {
        path: 'units/:id/systems/:systemId',
        component: SystemPage,
        children: [
            { path: 'models', component: SystemModels },
            { path: '', component: SystemOverview },
            { path: 'analysis', component: SystemAnalysis },
            { path: 'configure', component: SystemConfig },
            {
                path: 'template',
                component: SystemTemplate,
                children: [
                    {
                        path: 'render-template-with-plots-configuration-with-feed-data/:entityId/:templateId',
                        component: RenderTemplateWithPlotsConfigurationWithFeedData,
                    }
                ]
            },
            { path: 'upload', component: FileUpload },

        ]
    },

    {
        path: 'units/:unitId/systems/:systemId/models/:modelId',
        component: ModelPage,
        children: [
            { path: '', component: ModelOverview },
            { path: 'configuration', component: ModelConfiguration },
            { path: 'template', component: ModelTemplate },
            { path: 'testing', component: Testing },
            { path: 'deploy', component: ModelDeploy },
            { path: 'schema', component: ModelSchema },


        ]
    },
    {
        path: 'units/:unitId/systems/:systemId/models/:modelId/schema/block-editor',
        component: BlockEditor
    },
    {
        path: 'units/:unitId/systems/:systemId/models/:modelId/schema/flow-editor/:blockId',
        component: FlowEditor2
    },
    {
        path: 'units/:unitId/systems/:systemId/models/:modelId/schema/flow-editor/:blockId/:flowId',
        component: FlowEditor2
    },


    {
        path: 'template-landing-dashboard',
        children: [
            { path: '', component: LandingPagesForAllTemplatePage },
            { path: 'render-template-only/:templateId', component: RenderTemplateOnly },
            {
                path: 'render-template-with-plots-configuration/:entityId/:templateId',
                component: RenderTemplateWithPlotsConfiguration,
            },
            {
                path: 'render-template-with-plots-configuration-with-feed-data/:entityId/:templateId',
                component: RenderTemplateWithPlotsConfigurationWithFeedData,
            },
        ],
    },

    { path: 'units/:unitId/systems/:systemId/analysis/:analysisId', component: AnalysisPage },
    { path: 'unit/system/subsystem/configure/:id', component: BlockEditor },
    { path: '', component: Home },
];