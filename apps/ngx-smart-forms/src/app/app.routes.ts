import { Route } from '@angular/router';

import { SmartErrorDisplayDemoComponent } from './smart-error-display-demo/smart-error-display-demo.component';
import { SmartInputTypeDemoComponent } from './smart-input-type-demo/smart-input-type-demo.component';
import { SmartFileUploadDemoComponent } from './smart-file-upload-demo/smart-file-upload-demo.component';

export const appRoutes: Route[] = [
  {
    path: 'smart-error-display-demo',
    component: SmartErrorDisplayDemoComponent,
  },
  {
    path: 'smart-input-type-demo',
    component: SmartInputTypeDemoComponent,
  },
  {
    path: 'smart-file-upload-demo',
    component: SmartFileUploadDemoComponent,
  },
];
