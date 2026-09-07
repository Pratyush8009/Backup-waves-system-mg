import { Component } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { TemplateStorage } from '../template-storage/template-storage';
import { SystemInfo } from '../system-info/system-info';
@Component({
  selector: 'app-system-config',
  imports: [NzBreadCrumbModule, TemplateStorage, SystemInfo],
  templateUrl: './system-config.html',
  styleUrl: './system-config.css',
})
export class SystemConfig {

}
