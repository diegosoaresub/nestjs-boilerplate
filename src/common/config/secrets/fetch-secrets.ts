import {
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

export const getSecret = async (
  secretName: string,
  region: string,
): Promise<any> => {
  const client = new SecretsManagerClient({
    region: region,
  });
  let response: GetSecretValueCommandOutput;
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      }),
    );
  } catch (error) {
    throw error;
  }
  return JSON.parse(response.SecretString);
};
