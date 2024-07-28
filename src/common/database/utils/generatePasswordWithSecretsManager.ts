import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

export const generatePasswordWithSecretsManager = async (secretName: string) : Promise<string> => {
  const region = process.env.AWS_REGION ?? 'us-east-1';
  const client = new SecretsManagerClient({ region });
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const data = await client.send(command);
    if (data.SecretString) {
      const secret = JSON.parse(data.SecretString);
      console.log('Secret: ', secret);
      return secret.password; // Adjust the property name based on your secret structure
    }
    throw new Error('SecretString is empty');
  } catch (err) {
    console.error('Error retrieving secret from AWS Secrets Manager', err);
    throw err;
  }
};
