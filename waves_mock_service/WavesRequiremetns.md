# Block-Flow-Node System - WireMock Implementation

WireMock-based mock service for the system.

```
Unit → System → Model/Analysis → Pipeline → Block → Flow → Node
```

## Components

### System
- Container for Models and Analyses
- Has active/inactive status that affects visibility
- Multiple systems can exist

### Model (Digital Twin)
- Physical world mapping
- Structured with properties, schema, column mappings
- Runs frequently (scheduled/event-driven)
- Stages: EDITING → TESTING → DEPLOYMENT → PUBLISHED
- Status: DRAFT, ACTIVE, INACTIVE

### Analysis (Human Curiosity)
- Ad-hoc, occasional use
- Flexible configuration
- Can pull data from System outputs
- Collaboration and transaction logging

### Pipeline
- Contains ordered blocks
- Version controlled with change tracking
- Associated with either Model or Analysis

### Block
- Reusable processing units
- Types: INPUT, OUTPUT, PROCESSOR, DATA_UPLOAD
- Categories: I/O Blocks, Mathematical processor, Without ML processor blocks, Data Integration blocks
- Contains multiple parallel flows

### Flow
- Ordered sequence of nodes
- Types: SEQUENTIAL, PARALLEL, CONDITIONAL, LOOP
- Multiple flows in a block execute in parallel
- Block waits for all flows to complete

### Node
- Individual execution steps within flows
- Execute sequentially within a flow
- Platform-defined types with configurations

**Notes**
-----------
- need to share the required configs options to the front end
    - galaxy : system config drop down etc
    - waves : nodes & its config, system config, 
- how different version will be tested if the input is changed
- are we goiong to show model/ analysis creation related actions done by support team to users? .. i think user specific actions need to be shown 



waves (Support users who can settle things for user):
------------------------------------------------------
- list of units (user agnostic)
- list of units (user specific)
- create unit for a client(galaxy user)
- edit unit for a client(galaxy user)
- unit details
- delete unit
- list of systems specific to unit
- specific system details
- list of models with version
- list of anlysis with version
- analysis instances
- model instances

- list of systems specific to user // not implemented yet

## Endpoints for Waves requirements
### 1. Unit Level Mocks
- **GET /api/v1/waves/units** - List all units 
- **GET /api/v1/waves/users/{id}/units** - User-specific units 
- **POST /api/v1/waves/units** - Create unit 
- **PUT /api/v1/waves/units/{id}** - Edit unit 
- **GET /api/v1/waves/units/{id}** - Unit details 
- **DELETE /api/v1/waves/units/{id}** - Delete unit 

### 2. System Level Mocks
- **GET /api/v1/waves/units/{id}/systems** - Systems in unit 
- **POST /api/v1/waves/units/{id}/systems** - Create System in unit
- **GET /api/v1/waves/systems/{id}** - Get system by ID
- **GET /api/v1/waves/systems/{id}/activities** - System activity log
- **PUT /api/systems/{id}** - Update system
- **DELETE /api/systems/{id}** - Delete system
- **PUT /api/systems/{id}/activate** - Activate system
- **PUT /api/systems/{id}/deactivate** - Deactivate system
- **GET /api/v1/waves/systems/{id}/properties** - System properties
- **PUT /api/v1/waves/systems/{id}/configuration** - Update system config
- **GET /api/v1/waves/systems/{id}/analyses** - List analyses with instances
- **GET /api/v1/waves/systems/{id}/models** - List models with instances

### 3. Model Level Mocks
- **GET /api/v1/waves/systems/{id}/models** - Models with versions (empty, draft, active, inactive, all stages)
- **GET /api/v1/waves/models/{id}** - Get model by ID with versions
- **POST /api/v1/waves/models** - Create model
- **PUT /api/v1/waves/models/{id}** - Update model
- **DELETE /api/v1/waves/models/{id}** - Delete model
- **GET /api/v1/waves/models/{id}/versions** - Get version history
- **PUT /api/v1/waves/models/{id}/stage** - Change stage (editing→testing→deployment→published)
- **PUT /api/v1/waves/models/{id}/run-validation-checks** - ALl validation needs to be checked e.g.block config, connections, params in the range, node connections, node connection format mismatch, system existence, no gap in the pipeline arrangement, no disconnected block or node etc
- **PUT /api/v1/waves/models/{id}/status** - Change status (draft→active→inactive)
- **POST /api/v1/waves/models/{id}/properties** - Manage properties
- **POST /api/v1/waves/models/{id}/data-mapper** - Configure data mapper via block also can be done
- **POST /api/v1/waves/models/{id}/upload** - Upload files
- **GET /api/v1/waves/models/{id}/changelog** - Get change log

### 3. Analysis Level Mocks
- **GET /api/v1/waves/systems/{systemId}/analyses** - List of Analyses with versions 
- **GET /api/v1/waves/analyses/{id}** - Get analysis by ID
- **POST /api/v1/waves/analyses** - Create analysis
- **PUT /api/v1/waves/analyses/{id}** - Update analysis
- **DELETE /api/v1/waves/analyses/{id}** - Delete analysis
- **POST /api/v1/waves/analyses/{id}/upload** - Upload result files
- **GET /api/v1/waves/analyses/{id}/collaboration** - Get collaboration info
- **POST /api/v1/waves/analyses/{id}/transaction-logs** - Transaction logs
- **GET /api/v1/waves/analyses/{id}/changelog** - Get change log

### 4. Pipeline Level Mocks [pipeline is tightly depends on analysis & model.. any changes related to block, flow, node in analysis & model will change their version as well as pipelineId]
- **GET /api/v1/waves/pipelines/{id}** - Get pipeline with complete details blocks, flow, nodes
- **POST /api/v1/waves/pipelines** - Create pipeline [either only empty blocks or with flows or all together block+flow+node]
- **PUT /api/v1/waves/pipelines/{id}** - Update pipeline => update the model version as per the changes impact 
- **DELETE /api/v1/waves/pipelines/{id}** - Delete pipeline [when model version is deleted it automatically deleted else when all blocks deleted from the pipeline, it will be deleted from the BE]
- **POST /api/v1/waves/pipelines/{id}/update** - Add/Remove block/flow/node to pipeline

### 5. Configurations from Platform
- **GET /api/v1/waves/systems/config-options** - Get generic config dropdown options for systems
- **GET /api/v1/waves/blocks/config-options** - Get generic config dropdown options for creating custom blocks like name, metadata, port options etc
- **GET /api/v1/waves/blocks/analyses/platform** - Platform level analyses blocks
- **GET /api/v1/waves/blocks/models/platform** - Platform level models blocks
- **GET /api/v1/waves/nodes/analyses/platform** - Platform level analyses nodes
- **GET /api/v1/waves/nodes/models/platform** - Platform level models nodes

### 6. Block Level Mocks
- **GET /api/blocks/{id}** - Get block template
- **POST /api/blocks** - Create custom block
- **GET /api/block-instances/{id}** - Get block instance with flows
- **PUT /api/block-instances/{id}/ui-layout** - Update UI layout

### 7. Flow Level Mocks
- **GET /api/blocks/{blockId}/flows** - List flows in block (parallel flows)
- **GET /api/flows/{id}** - Get flow with nodes
- **POST /api/flows** - Create flow
- **PUT /api/flows/{id}** - Update flow
- **DELETE /api/flows/{id}** - Delete flow
- **PUT /api/flows/{id}/priority** - Set priority level

### 8. Node Level Mocks [before deleting support team can check howmany instances are available for the existing nodes then decide to update that status or version]
- **GET /api/node-types** - List platform-defined node types
- **GET /api/node-types/{id}** - Get node type
- **GET /api/flows/{flowId}/nodes** - List nodes in flow (sequential)
- **GET /api/node-instances/{id}** - Get node instance
- **POST /api/node-instances** - Create node instance
- **PUT /api/node-instances/{id}** - Update node instance
- **DELETE /api/node-instances/{id}** - Delete node instance
- **POST /api/node-connections** - Create connection between nodes
- **PUT /api/node-instances/{id}/ui-layout** - Update UI layout

### 9. Execution Mocks
- **POST /api/model/{modelId}/pipelines/{id}/execute** - Execute model 
- **POST /api/analysis/{analysisId}/pipelines/{id}/execute** - Execute analysis
- **GET /api/model/{modelId}/pipelines/{id}/execution-status** - Get execution status
- **GET /api/analysis/{analysisId}/pipelines/{id}/execution-status** - Get execution status
- **POST /api/model/{modelId}/flows/{id}/execute** - Execute individual flow
- **POST /api/analysis/{analysisId}/flows/{id}/execute** - Execute individual flow
- **GET /api/model/{modelId}/flows/{id}/execution-status** - Get flow execution status
- **GET /api/analysis/{analysisId}/flows/{id}/execution-status** - Get flow execution status


##Wiremock impl status : 
- /api/v1/systems :
    - empty sys => done
    - Multiple Systems considering all units sys => done
    - Multiple Systems considering single unit => done

- /api/v1/systems/{id} :
    - no sys => done
    - System with only models => done
    - System with only analyses => done
    - System with only metadata => done
    - System with both model & analysis => done

- /api/v1/systems/{id}/activities : => done

- /api/v1/systems/{id}/properties : => done

- /api/v1/systems/{id}/configuration : => done but need review

- /api/v1/systems/config-options : => done

- /api/v1/systems/{id}/analyses : => done

- /api/v1/systems/{id}/models :

- /api/v1/models/{id}/execute : => done

- /api/v1/models/{id}/plots : => done

- /api/v1/models/{id}/results/summary : => done

- /api/v1/models/{id}/files :

- /api/v1/analyses/{id} : => done

- /api/v1/analyses/{id}/execute : => done

- /api/v1/analysis/{id}/plots : => done

- /api/v1/analysis/{id}/results/summary : => done but need review

- /api/v1/notifications : => done

- /api/v1/model/pipeline/blocks : => done

- /api/v1/analysis/pipeline/blocks : => done

-------------

## Unit :
### Create Unit
- waves user should define more requirements for unit creation at one go
- before creating a unit for a client, support user should check user is a valid user or not, whether he has verfied the email or not.
- support user can directly choose subscription for client while creating an unit (optional but can be added)
- provide the configurations for unit level (alerting: email/mobile/in_app, usage_limit, template)
- support agent can set state, status for the unit
- we can keep approval of senior agent if required (need to discuss)
- **Request Body** : 
```json
{
    "request_body": {
    "supportRequest":{
        "type":"CREATE-UNIT-FOR-CLIENT",
        "supportTicketReferenceId":"",
        "comment":"Create a unit with client validation, subscription setup, and configurations"
    },

    "clientValidation": {
      "clientId": "CLIENT-550e8400-e29b-41d4-a716-446655440001",
      "clientEmail": "client@organization.com",
      "emailVerified": true,
      "clientStatus": "ACTIVE",
      "validationRequired": true
    },
    
    "unitBasics": {
      "name": "Global Manufacturing Division",
      "type": "MANUFACTURING",
      "description": "Primary manufacturing operations division",
      "location": "Plant A, Bengalurru, India",
      "notes": "Unit created with standard manufacturing template"
    },
    
    "unitState": {
      "state": "ACTIVE",
      "status": "PROVISIONING",
      "createdBy": "USR-support-005",
      "approvedBy": "USR-manager-002"
    },
    
    "subscription": {
      "subscriptionId": "SUB-550e8400-e29b-41d4-a716-446655440001",
      "planType": "ENTERPRISE",
      "billingModel": "Annual",
      "currency": "USD",
      "amount": 50000,
      "startDate": "2024-04-09T00:00:00Z",
      "endDate": "2025-04-08T23:59:59Z",
      "autoRenew": true,
      "features": {
        "maxSystems": 50,
        "maxModels": 200,
        "maxAnalyses": 100,
        "maxUsers": 100,
        "maxApiCallsPerMonth": 10000000,
        "dataRetentionDays": 365,
        "supportLevel": "24x7 Premium"
      }
    },
    
    "configurations": {
      "alerting": {
        "emailAlerts": {
          "enabled": true,
          "recipients": [
            {
              "email": "admin@organization.com",
              "role": "ADMIN",
              "alertTypes": ["CRITICAL", "HIGH", "MEDIUM"]
            },
            {
              "email": "ops@organization.com",
              "role": "OPERATOR",
              "alertTypes": ["CRITICAL", "HIGH"]
            }
          ],
          "frequency": "Real-time for CRITICAL, Daily digest for others",
          "retryAttempts": 3,
          "retryIntervalMinutes": 5
        },
        
        "mobileAlerts": {
          "enabled": true,
          "pushNotificationEnabled": true,
          "smsAlerts": {
            "enabled": true,
            "recipients": [
              {
                "phoneNumber": "+91 997-784-7845",
                "name": "Emergency Contact",
                "alertTypes": ["CRITICAL"],
                "timeWindow": "24x7"
              }
            ]
          },
          "appNotifications": {
            "enabled": true,
            "alertTypes": ["CRITICAL", "HIGH", "MEDIUM"]
          }
        },
        
        "inAppAlerts": {
          "enabled": true,
          "alertTypes": ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"],
          "inlineNotifications": true,
          "soundEnabled": true,
          "desktopNotifications": true
        },
        
        "alertingRules": {
          "criticalThreshold": "Immediate notification",
          "highThreshold": "Within 5 minutes",
          "mediumThreshold": "Within 30 minutes",
          "lowThreshold": "Daily summary",
          "quietHours": {
            "enabled": false,
            "startTime": "22:00",
            "endTime": "06:00",
            "allowCriticalOnly": true
          }
        }
      },
      
      "usageLimit": {
        "enabled": true,
        "limits": {
          "monthlyApiCalls": {
            "limit": 10000000,
            "alertAt": "80%",
            "softLimit": true,
            "hardLimit": false
          },
          "monthlyDataIngestion": {
            "limitGB": 1000,
            "alertAt": "80%",
            "softLimit": true,
            "hardLimit": false
          },
          "maxSystems": {
            "limit": 50,
            "alertAt": "90%",
            "softLimit": false,
            "hardLimit": true
          },
          "maxModels": {
            "limit": 200,
            "alertAt": "85%",
            "softLimit": false,
            "hardLimit": true
          },
          "maxUsers": {
            "limit": 100,
            "alertAt": "80%",
            "softLimit": false,
            "hardLimit": true
          },
          "storageGB": {
            "limit": 5000,
            "alertAt": "75%",
            "softLimit": true,
            "hardLimit": false
          }
        },
        
        "overage": {
          "allowOverage": true,
          "overageChargePerUnit": 0.01,
          "maxOveragePercentage": 20,
          "overageNotification": "Monthly invoice"
        },
        
        "resetPolicy": {
          "resetFrequency": "Monthly",
          "resetDay": "First day of month",
          "resetTime": "00:00 UTC"
        }
      },
      
      "template": {
        "templateId": "TEMPLATE-MANUFACTURING-STANDARD-001",
        "templateName": "Manufacturing Standard Configuration",
        "templateVersion": "3.2.1",
        "includePreConfiguredSystems": true,
        "includePreConfiguredModels": true,
        "includeSampleDashboards": true,
        "preConfiguredElements": {
          "systems": [
            {
              "systemName": "Production Line 1",
              "systemType": "PRODUCTION",
              "monitoringInterval": "1 second"
            },
            {
              "systemName": "Quality Testing Lab",
              "systemType": "TESTING",
              "monitoringInterval": "10 seconds"
            }
          ],
          "models": [
            {
              "modelName": "OEE Analysis Model",
              "modelType": "Analytics"
            }
          ],
          "dashboards": [
            {
              "dashboardName": "Production Overview",
              "type": "Real-time"
            },
            {
              "dashboardName": "Quality Metrics",
              "type": "Analytical"
            }
          ]
        }
      },
      
      "operatingConfiguration": {
        "businessHours": {
          "timezone": "Kolkata",
          "weekdayStart": "06:00",
          "weekdayEnd": "22:00",
          "weekendStart": "08:00",
          "weekendEnd": "18:00",
          "holidays": ["2024-12-25", "2025-01-01"]
        },
        
        "maintenanceWindow": {
          "enabled": true,
          "day": "Sunday",
          "startTime": "02:00",
          "endTime": "04:00",
          "timezone": "UTC",
          "notificationAdvanceHours": 24
        },
        
        "dataRetention": {
          "operationalData": 180,
          "analyticalData": 365,
          "archiveData": 2555,
          "auditLogs": 2555,
          "deletionPolicy": "Soft delete then archive"
        },
        
        "backup": {
          "backupFrequency": "Daily",
          "backupTime": "02:00 UTC",
          "backupLocation": "Cloud (US-East)",
          "backupRetentionCopies": 30,
          "testRestoreFrequency": "Monthly"
        }
      },
      
      "monitoring": {
        "realTimeMonitoring": true,
        "monitoringFrequency": "Every 5 minutes",
        "healthCheckInterval": "Every 60 seconds",
        "metricsCollected": [
          "CPU Usage",
          "Memory Usage",
          "Disk Usage",
          "Network Throughput",
          "API Response Time",
          "Error Rate"
        ],
        "customMetrics": [
          "Production Throughput",
          "Quality Defect Rate",
          "System Availability"
        ]
      },
      
      "compliance": {
      },
      
      "integrations": {
      }
    },
    
    "staffing": {
      "primaryContact": {
        "name": "John Manager",
        "email": "john.manager@organization.com",
        "phone": "+91 313-555-0101",
        "role": "Unit Manager"
      },
      "technicalContact": {
        "name": "Jane Engineer",
        "email": "jane.engineer@organization.com",
        "phone": "+91 313-555-0102",
        "role": "Technical Lead"
      },
      "supportContact": {
        "name": "Support Team",
        "email": "support@organization.com",
        "phone": "+91 800-444-124"
      }
    }
  }
}
```


### Unit DEtails : 
- support user can able to see the complete details metadata, config, subscription plan
- list of members with highlighting roles as owner/manager etc, no of systems with status, is there any model/ analysis running
- current usage stats
- payment status
```json

```

### Delete Unit : 
- support user can able to see the complete details metadata, config, subscription plan
- from the 
```json

```

---

## System :
### Create System
- waves user should define more requirements while creation of system at one go
- before creating a system for a client under a unit, support user should check user is a valid user or not, whether he has verfied the email or not. what is subscripiton plan for the unit, whether limit exist for creating a system. 
- support user can create system by providing metadata & all the configurations for system level (alerting: email/mobile/in_app, usage_limit, template, starred or not)
- support agent can set state, status for the system
- we can keep approval of senior agent if required (need to discuss)
- **Request Body** : 
```json
{
    "supportRequest":{
        "type":"CREATE-SYSTEM-FOR-CLIENT",
        "supportTicketReferenceId":"tkt-id",
        "comment":"Create a system with client validation, and configurations"
    },
  "clientValidation": {
    "clientId": "CLT-client-001",
    "userId": "USR-galaxy-001",
    "verifyEmail": true,
    "checkSubscription": true
  },
  "systemDetails": {
    "name": "Manufacturing Line Alpha System",
    "type": "MANUFACTURING",
    "description": "Real-time monitoring system for production line alpha",
    "location": "Plant-A, Building-3, Floor-2",
    "department": "Production Engineering",
    "costCenter": "CC-PROD-001"
  },
  "state": "ACTIVE",
  "status": "OPERATIONAL",
  "starred": true,
  "template": {
    "useTemplate": true,
    "templateId": "TMPL-MANUFACTURING-001",
    "templateName": "Standard Manufacturing Template"
  },
  "configuration": {
    "dataManagement": {
      "dataRetentionDays": 180,
      "archiveRetentionDays": 730,
      "enableRealTimeMonitoring": true,
      "monitoringInterval": "5 minutes",
      "dataSourceTypes": ["TELEMETRY", "FILE_UPLOAD", "API", "MQTT"],
      "supportedFileFormats": ["CSV", "XLSX", "JSON", "PARQUET"]
    },
    "dataSync": {
      "syncInterval": 500,
      "mode": "stream",
      "protocol": "MQTT",
      "endpoints": {
        "mqtt": "mqtt://mqtt-broker.plant-a.local:1883",
        "opcua": "opc.tcp://plc-line-alpha.local:4840",
        "modbus": "tcp://modbus-gateway.plant-a.local:502"
      }
    },
    "usageLimits": {
      "maxExecutionsPerDay": 100000,
      "storageQuotaMB": 750000,
      "apiRateLimit": {
        "requests": 15000,
        "window": "hour"
      },
      "dataPointsPerSecond": 8000
    },
    "dataRetention": {
      "retentionDays": 365,
      "archivalAfterDays": 90,
      "fileStorageProvider": "s3"
    },
    "alerting": {
      "alertingEnabled": true,
      "emailNotifications": true,
      "smsNotifications": true,
      "inAppNotifications": true,
      "webhookUrl": "https://alerts.plant-a.company.com/webhook",
      "alertRecipients": [
        "ops-alpha@company.com",
        "engineering-alpha@company.com",
        "manager-production@company.com"
      ],
      "alertPriority": {
        "critical": ["sms", "email", "in_app", "webhook"],
        "high": ["email", "in_app", "webhook"],
        "medium": ["in_app", "webhook"],
        "low": ["in_app"]
      },
      "escalationRules": {
        "enabled": true,
        "escalateAfterMinutes": 15,
        "escalationContacts": ["manager-ops@company.com"]
      }
    },
    "performance": {
      "maxConcurrentExecutions": 10,
      "executionTimeout": "7200s",
      "queueSize": 500,
      "priorityQueueEnabled": true
    }
  },
  "approvalRequired": true,
  "approvalDetails": {
    "requireSeniorApproval": true,
    "approverRole": "SENIOR_SUPPORT_AGENT",
    "approverUserId": "USR-senior-support-001",
    "reason": "High-cost system with advanced monitoring requirements"
  },
  "createdBy": "USR-support-agent-003"
}
```

### Systems List // All Units

### Systems List Specific to a Unit


### System details
- Here we are sharing all details of systems for a unit
- we are sharing a list of all available models & analyses with all versions & status, state values
- we are sharing system properties (I/O) if available & config details
- activity logs for system

## Model
# Model Creation with Metadata
- Waves support user can Create a model for a system by providing name, description etc.
- Before creation validation unit, system status, subscription plan of unit
- by default status is created, state is INACTIVE
- 
```json
{

    "supportRequest":{
        "type":"CREATE-Model-FOR-CLIENT",
        "supportTicketReferenceId":"tkt-id",
        "comment":"Create a model for a system with validation checks"
    },
  "request_body": {
    "modelBasics": {
      "name": "Production Line 1 Model",
      "description": "Digital twin model for production line 1 monitoring and optimization",
      "type": "PREDICTION",
      "category": "PerformanceMonitoring"
    },

    "systemReference": {
      "systemId": "SYS-550e8400-e29b-41d4-a716-446655440001",
      "systemName": "Manufacturing Unit ABC"
    },

    "metadata": {
      "owner": "Jane Engineer",
      "ownerEmail": "jane.engineer@company.com"
      "tags": ["production", "efficiency", "digital-twin"]
    },

    "pipelineConfig": {
      "createEmptyPipeline": true,
      "pipelineType": "EMPTY",
      "includePreConfiguredBlocks": false
    },

    "createdBy": "USR-support-005",
    "createdByName": "Support Agent Johnson"
  }
}
```

## Analysis
# Analysis Creation with Metadata
- Waves support user can Create a model for a system by providing name, description etc.
- Before creation validation unit, system status, subscription plan of unit
- by default status is created, state is INACTIVE



### Search System
-> unit => done
-> system => done
-> 