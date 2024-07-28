import { AtlasInfraestructure } from './factories/infraestructure';
import { ApplicationLayerStack } from './layers/application.layer';
import { CoreLayerStack } from './layers/core.layer';

/**
 * Function to create layers stack. It creates 'core-layer' and 'application-layer'.
 *
 * @returns array of layers.
 */
const createStacks = () => {
  return [
    { name: 'core-layer', provide: CoreLayerStack },
    {
      name: 'application-layer',
      provide: ApplicationLayerStack,
      dependencies: ['core-layer'],
    },
  ];
};

/**
 * Configuration for the application. Contains configurations for both production and development.
 */
const infraestructure = new AtlasInfraestructure({
  production: {
    // Name of your application
    applicationName: 'atlas',
    // Stage name for the environment
    stageName: 'production',
    // Domain name  environment
    domainName: 'sandbox.dishsphere.com',
    // API domain name for the environment
    apiDomainName: 'api.sandbox.dishsphere.com',
    // Public host ID for the  environment (AWS Route 53 Hosted Zone ID)
    idPublicHostZone: 'Z05530532SEMIK1PB3KRQ',
    env: {
      // AWS account ID for the environment
      account: '058264135739',
      // AWS region for the environment (e.g., 'us-east-1')
      region: 'us-east-1',
    },
    layersStack: createStacks(),
  },
  development: {
    // Name of your application
    applicationName: 'atlas',
    // Stage name for the environment
    stageName: 'development',
    // Domain name  environment
    domainName: 'sandbox.dishsphere.com',
    // API domain name for the environment
    apiDomainName: 'api.sandbox.dishsphere.com',
    // Public host zone ID for the  environment (AWS Route 53 Hosted Zone ID)
    idPublicHostZone: 'Z05530532SEMIK1PB3KRQ',
    env: {
      // AWS account ID for the environment
      account: '058264135739',
      // AWS region for the environment (e.g., 'us-east-1')
      region: 'us-east-1',
    },
    layersStack: createStacks(),
  },
});

// Execute synth method
infraestructure.synth();
