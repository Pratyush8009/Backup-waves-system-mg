import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

type EndpointKey = 'mqtt' | 'opcua' | 'modbus';

@Component({
  selector: 'app-template-storage',
  standalone: true,
  imports: [
    CommonModule, FormsModule, NzCardModule, NzSelectModule,
    NzGridModule, NzInputModule, NzInputNumberModule, NzSwitchModule,
    NzButtonModule, NzTagModule, NzDividerModule, NzSpaceModule, NzTypographyModule
  ],
  templateUrl: './template-storage.html',
  styleUrl: './template-storage.css',
})
export class TemplateStorage {
  // Config Data
  config: any = {
    templateId: "tmp-sys-13",
    templateName: "Manufacturing Standard Configuration v3.2",
    dataManagement: {
      dataRetentionDays: 120,
      archiveRetentionDays: 365,
      enableRealTimeMonitoring: true,
      monitoringInterval: "5 minutes",
      dataSourceTypes: ["FILE_UPLOAD", "API", "MQTT", "OPC-UA", "MODBUS"],
      supportedFileFormats: ["CSV", "XLSX", "JSON", "PARQUET", "XML"]
    },
    dataSync: {
      syncInterval: 500,
      syncIntervalUnit: "milliseconds",
      mode: "stream",
      protocol: "MQTT",
      endpoints: {
        mqtt: { url: "mqtt://mqtt-broker.cement-plant.local:1883", status: "CONNECTED" },
        opcua: { url: "opc.tcp://plc-master.cement-plant.local:4840", status: "CONNECTED" },
        modbus: { url: "tcp://modbus-gateway.cement-plant.local:502", status: "CONNECTED" }
      }
    },
    usageLimits: {
      maxExecutionsPerDay: 86400,
      storageQuotaMB: 500000,
      apiRateLimit: { requests: 10000, window: "hour" },
      dataPointsPerSecond: { limit: 5000 },
      concurrentConnections: { limit: 500 }
    },
    dataRetention: {
      retentionDays: 365,
      archivalAfterDays: 90,
      fileStorageProvider: "s3",
      backupFrequency: "Daily",
      backupLocation: "Cloud (US-East)"
    },
    alerting: {
      alertingEnabled: true,
      emailNotifications: true,
      smsNotifications: false,
      inAppNotifications: true,
      webhookUrl: "https://alerts.company.com/webhook",
      alertRecipients: [
        { email: "ops@company.com", role: "OPERATOR", alertTypes: ["CRITICAL", "HIGH"] },
        { email: "engineering@company.com", role: "ENGINEER", alertTypes: ["CRITICAL", "HIGH", "MEDIUM"] }
      ],
      alertingRules: {
        criticalThreshold: "Immediate",
        highThreshold: "Within 5 minutes",
        mediumThreshold: "Within 30 minutes",
        lowThreshold: "Daily summary"
      }
    },
    performance: {
      maxConcurrentExecutions: 5,
      executionTimeout: "3600s",
      queueSize: 100
    },
    monitoring: {
      realTimeMonitoring: true,
      healthCheckInterval: "60 seconds",
      customMetricsEnabled: true
    }
  };

  // Dropdown Options
  templateList = [
    { label: 'Standard Mfg v3.2', value: 'tmp-sys-13' },
    { label: 'High Performance v1.0', value: 'tmp-hp-01' },
    { label: 'Legacy Backup v2.4', value: 'tmp-leg-24' }
  ];

  monitoringIntervals = ['1 minute', '5 minutes', '15 minutes', '30 minutes', '1 hour'];
  syncUnits = ['milliseconds', 'seconds', 'minutes'];
  syncModes = ['stream', 'batch', 'manual'];

  endpointKeys: EndpointKey[] = ['mqtt', 'opcua', 'modbus'];
  protocolOptions = ['MQTT', 'OPC-UA', 'MODBUS', 'HTTP'];
  storageProviders = ['s3', 'azure-blob', 'gcs'];
  roles = ['OPERATOR', 'ENGINEER', 'ADMIN'];
  alertLevels = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  saveAll(): void {
    console.log('Final Configuration State:', this.config);
  }
}